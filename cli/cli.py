import argparse
import asyncio
import base64
import getpass
import json
import logging
import os
import subprocess
import shutil
import sys
import time
import docker
import httpx
from supabase import create_client, Client
import psutil
import platform
import torch
import tarfile
import boto3

# File to store login credentials
CREDENTIALS_FILE = "login_credentials.txt"

# Set up the Supabase client with your URL and API Key
url = "https://pristirosscbgmkblozz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXN0aXJvc3NjYmdta2Jsb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDI2MzQsImV4cCI6MjA1NTc3ODYzNH0.7NWqkC5MUndwTxuLGlyBIEskItFzJ3M8iAKcARc_1yM"  # Replace with your Supabase anonymous API key

supabase: Client = create_client(url, key)


client = docker.from_env()

ECR_URI = "864899844109.dkr.ecr.us-east-1.amazonaws.com/hacklytics25/storage"
ecr_client = boto3.client("ecr")
s3 = boto3.client("s3")

response = ecr_client.get_authorization_token()
auth_token = response["authorizationData"][0]["authorizationToken"]
decoded_token = base64.b64decode(auth_token).decode("utf-8")
_user, _pass = decoded_token.split(":")

registry = response["authorizationData"][0]["proxyEndpoint"]
client.login(username=_user, password=_pass, registry=registry)

UUID = None


def authenticate(username, password):
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": username, "password": password}
        )
    except Exception as e:
        logging.error(f"Error during authentication: {e}")
        return False
    return auth_response.user.id


def create_account(username, password):
    try:
        sign_up_response = supabase.auth.sign_up(
            {"email": username, "password": password}
        )
    except Exception as e:
        logging.error(f"Error during account creation: {e}")
        return False
    return sign_up_response.user.id


def save_credentials(username, password):
    with open(CREDENTIALS_FILE, "w") as file:
        file.write(f"{username}\n{password}\n")


def load_credentials():
    if os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, "r") as file:
            username, password = file.read().splitlines()
            return username, password
    return None, None


def delete_credentials():
    if os.path.exists(CREDENTIALS_FILE):
        os.remove(CREDENTIALS_FILE)
        logging.info("Successfully logged out.")


def download_docker_container(job_id):
    image_uri = f"{ECR_URI}:{job_id}"

    logging.info(f"Pulling {image_uri}")
    client.images.pull(image_uri)

    tar_file_path = f"{job_id}.tar"
    with open(tar_file_path, "wb") as f:
        for chunk in client.images.get(image_uri).save():
            f.write(chunk)

    logging.info(f"Image saved")

    return tar_file_path


API_ROUTE = "http://127.0.0.1:8000"  # Replace with your API endpoint


# Custom logging handler to send logs to an API
class ApiLogHandler(logging.Handler):
    def __init__(self, client):
        super().__init__()
        self.client = client

    async def emit(self, record):
        try:
            log_message = self.format(record)
            await self.send_log_to_api(log_message)
        except Exception as e:
            logging.error(f"Failed to send log: {e}")

    async def send_log_to_api(self, log_message):
        try:
            async with self.client.post(
                API_ROUTE + "/append-logs/", json={"log": log_message}
            ) as response:
                if response.status_code != 200:
                    logging.error(f"Failed to send log: {response.status_code}")
        except Exception as e:
            logging.error(f"Error sending log: {e}")


# Configure logging to log to both console and the API
async def configure_logging():
    client = httpx.AsyncClient()
    api_handler = ApiLogHandler(client)

    # Set up logging configuration
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",  # Log format
        handlers=[
            logging.StreamHandler(sys.stdout),  # Logs to console
            api_handler,  # Send logs to API
        ],
    )


def run_docker_container(container_name, docker_dir, timeout_days):
    timeout_seconds = timeout_days * 86400
    logging.info(
        f"Running Docker container {container_name} with a timeout of {timeout_days} days..."
    )

    try:
        logging.info(f"Output directory: {str(os.path.abspath('./out'))}")

        # Run the docker container and capture stdout and stderr
        process = subprocess.Popen(
            [
                "docker",
                "run",
                "-v",
                f"{str(os.path.abspath('./out'))}:{docker_dir}",
                container_name,
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        start_time = time.time()

        while True:
            return_code = process.poll()

            if return_code is not None:
                break

            elapsed_time = time.time() - start_time
            if elapsed_time > timeout_seconds:
                process.kill()  # Kill the process if it times out
                logging.error(
                    f"Error: Docker container timed out after {timeout_days} days."
                )
                return

            if process.stdout:
                stdout_line = process.stdout.readline()
                if stdout_line:
                    logging.info("Docker Out: " + stdout_line.strip())

            if process.stderr:
                stderr_line = process.stderr.readline()
                if stderr_line:
                    logging.error("Docker Err: " + stderr_line.strip())

            time.sleep(0.1)

        # Process finished, check the return code
        if return_code != 0:
            logging.error(f"Error running Docker container: {process.stderr.read()}")
            exit(1)

    except subprocess.CalledProcessError as e:
        logging.error(f"Error running Docker container: {e}")
        exit(1)

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        exit(1)


def track_files():
    output_dir = "out"
    created_files = []
    for root, _, files in os.walk(output_dir):
        for file in files:
            created_files.append(os.path.join(root, file))
    return created_files


def upload_files(files, job_id):
    bucket_name = job_id

    if not s3.list_buckets().get("Buckets", []):
        s3.create_bucket(Bucket=bucket_name)

    for file_path in files:
        logging.info(f"Uploading {file_path} to S3 bucket {bucket_name}...")
        file_name = os.path.basename(file_path)
        try:
            s3.upload_file(file_path, bucket_name, file_name)
            logging.info(f"Uploaded {file_name} to S3 bucket {bucket_name}")
        except Exception as e:
            logging.error(f"Failed to upload {file_name} to S3: {e}")


def delete_docker_resources(container_name, output_dir):
    logging.info(f"Removing Docker container {container_name}...")

    if os.path.exists(container_name):
        logging.info(f"Removing Docker image file {container_name}...")
        os.remove(container_name)

    if os.path.exists(output_dir):
        logging.info(f"Deleting files in the output directory {output_dir}...")
        shutil.rmtree(output_dir)


async def fetch_container_info(id):
    url = f"{API_ROUTE}/get-job-info/{id}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code == 200:
        job_data = response.json()
        logging.info(f"Job found: {job_data}")
        return job_data
    else:
        logging.error(f"Error requesting job: {response.status_code}")
        return None


def get_image_id_from_tar(tar_file_path):
    with tarfile.open(tar_file_path, "r") as tar:
        manifest = tar.extractfile("manifest.json")
        if manifest:
            manifest_data = json.load(manifest)
            config_path = manifest_data[0][
                "Config"
            ]  # e.g., "blobs/sha256/f2023f95286c87efcf..."
            image_id = config_path.split("/")[-1].split(".")[
                0
            ]  # Extract only the hash part
            return image_id
        else:
            raise ValueError("manifest.json not found in tar file")


async def grab_task(id):
    url = f"{API_ROUTE}/take-job?job_id={id}&lender_id={UUID}"

    async with httpx.AsyncClient() as client:
        response = await client.post(url)

    if response.status_code == 200:

        logging.info(f"Job grabbed: {response.json()}")
        return True
    else:
        logging.info(f"Error fetching job info: {response.status_code}")
        return None


async def run_command(id):
    # data = await fetch_container_info(id)
    # if not data:
    #     logging.info("Job not found or job taken.")
    #     return None
    # logging.info("container info\n" + data)
    # user_id = data["user_id"]
    # compute_type =  data["compute_type"]
    # timeout = data["timeout"]
    # docker_dir = data["output_directory"]

    docker_dir = "/app/"
    container_name = f"{id}.tar"

    tar_file = download_docker_container(id)
    run_docker_container(get_image_id_from_tar(tar_file), docker_dir, 1, id)
    logging.info("Finished running job")

    delete_docker_resources(container_name, "./out")


async def isActive():
    return True


def get_cpu_info():
    return {
        "Name": platform.processor(),
        "Cores": psutil.cpu_count(logical=False),
        "Threads": psutil.cpu_count(logical=True),
        "Max Frequency (MHz)": psutil.cpu_freq().max,
    }


def is_gpu_available():
    return torch.cuda.is_available()


async def autorun_command():
    if not await isActive():
        return None

    use_gpu = is_gpu_available()

    if use_gpu:
        return "GPU Available - Running with GPU."
    else:
        cpu_info = get_cpu_info()
        return f"No valid GPU detected. Using CPU: {cpu_info}."


def main():
    asyncio.run(configure_logging())

    parser = argparse.ArgumentParser(description="Custom CLI with authentication")
    subparsers = parser.add_subparsers(dest="command", required=True)

    run_parser = subparsers.add_parser("run", help="Run a task")
    run_parser.add_argument("-k", required=True, help="Authentication key")

    plogout = subparsers.add_parser("logout", help="Logout")
    plogin = subparsers.add_parser("login", help="Login")
    pcreate_acc = subparsers.add_parser("create_account", help="Create Account")
    pautorun = subparsers.add_parser(
        "autorun", help="Run tasks automatically for a set amount of time"
    )
    pautorun.add_argument("-t", required=True, help="Amount of time to run tasks for")

    global UUID

    args = parser.parse_args()

    if args.command == "logout":
        logging.info("Deleting saved credentials...")
        delete_credentials()
        return
    elif args.command == "login":
        username, password = load_credentials()
        if username and password:
            logging.info(f"Loaded saved creds - {username}")
            logging.info("Run logout to delete current user")
            pass
        else:
            username = input("Username (email): ").lower()
            password = getpass.getpass("Password: ")
        if uuid := authenticate(username, password):

            UUID = uuid
            save_credentials(username, password)
            logging.info("Successfully logged in.")
        else:
            logging.info("Authentication failed.")
        return
    elif args.command == "create_account":
        username = input("Username (email): ").lower()
        password = getpass.getpass("Password: ")
        if create_account(username, password):
            if uuid := authenticate(username, password):

                UUID = uuid
                save_credentials(username, password)
                logging.info("Successfully created account and logged in.")
            else:
                logging.info("Failed to log in after account creation.")
        else:
            logging.info("Account creation failed.")
        return
    elif args.command == "run":
        if not args.k:
            logging.info("Please provide a job id with -k")
            return
        username, password = load_credentials()
        if username and password:
            if uuid := authenticate(username, password):

                UUID = uuid
                logging.info(f"Logged in as {username}")
                asyncio.run(run_command(args.k))

            else:
                logging.info("Authentication failed.")
                return

        else:
            logging.info("No saved credentials found. Please log in.")
            username = input("Username (email): ").lower()
            password = getpass.getpass("Password: ")

            if uuid := authenticate(username, password):

                UUID = uuid
                save_credentials(username, password)
                asyncio.run(run_command(args.k))
            else:
                logging.info("Authentication failed.")
                create_account_choice = (
                    input("Do you want to create a new account? (y/n): ")
                    .strip()
                    .lower()
                )
                if create_account_choice == "y":
                    if uuid := create_account(username, password):

                        UUID = uuid
                        if authenticate(username, password):
                            save_credentials(username, password)
                            asyncio.run(run_command(args.k))
                        else:
                            logging.error("Failed to log in after account creation.")
                    else:
                        logging.error("Account creation failed.")
                else:
                    logging.info("Exiting...")
    elif args.command == "autorun":

        username, password = load_credentials()
        if username and password:
            if uuid := authenticate(username, password):

                UUID = uuid
                logging.info(f"Logged in as {username}")
                save_credentials(username, password)
                asyncio.run(autorun_command())
            else:
                logging.error("Authentication failed.")
                return

            asyncio.run(autorun_command())

        else:
            logging.info("No saved credentials found. Please log in.")
            username = input("Username (email): ").lower()
            password = getpass.getpass("Password: ")

            if uuid := authenticate(username, password):

                UUID = uuid
                save_credentials(username, password)
                asyncio.run(autorun_command())
            else:
                logging.info("Authentication failed.")
                create_account_choice = (
                    input("Do you want to create a new account? (y/n): ")
                    .strip()
                    .lower()
                )
                if create_account_choice == "y":
                    if uuid := create_account(username, password):

                        UUID = uuid
                        if authenticate(username, password):
                            save_credentials(username, password)
                            asyncio.run(autorun_command())
                        else:
                            logging.error("Failed to log in after account creation.")
                    else:
                        logging.info("Account creation failed.")
                else:
                    logging.info("Exiting...")


if __name__ == "__main__":
    main()
