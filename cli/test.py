import base64
import boto3
import docker
import tarfile
import json

client = docker.from_env()
ECR_URI = "864899844109.dkr.ecr.us-east-1.amazonaws.com/hacklytics25/storage"

# Authenticate with AWS ECR
ecr_client = boto3.client('ecr')
response = ecr_client.get_authorization_token()
auth_token = response['authorizationData'][0]['authorizationToken']
decoded_token = base64.b64decode(auth_token).decode('utf-8')    
_user, _pass = decoded_token.split(':')

registry = response['authorizationData'][0]['proxyEndpoint']
client.login(username=_user, password=_pass, registry=registry)

def download_docker_container(job_id):
    image_uri = f"{ECR_URI}:{job_id}"
    
    # Pull the image
    print(f"Pulling {image_uri}...")
    client.images.pull(image_uri)

    # Save the image as a tar file
    tar_file_path = f"{job_id}.tar"
    with open(tar_file_path, "wb") as f:
        for chunk in client.images.get(image_uri).save():
            f.write(chunk)
    
    print(f"Image saved to {tar_file_path}")

    return tar_file_path

def get_image_id_from_tar(tar_file_path):
    with tarfile.open(tar_file_path, 'r') as tar:
        manifest = tar.extractfile('manifest.json')
        if manifest:
            manifest_data = json.load(manifest)
            config_path = manifest_data[0]["Config"]  # e.g., "blobs/sha256/f2023f95286c87efcf..."
            image_id = config_path.split("/")[-1].split(".")[0]  # Extract only the hash part
            return image_id
        else:
            raise ValueError("manifest.json not found in tar file")

# Example usage
job_id = "205df0dd-359f-4dbb-acf6-6e233ee5a27e"
tar_file = download_docker_container(job_id)
image_id = get_image_id_from_tar(tar_file)

print(f"Extracted Image ID: {image_id}")
