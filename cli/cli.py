import argparse
import asyncio
import base64
import getpass
import os
import subprocess
import shutil
import docker
import httpx
import requests
from supabase import create_client, Client
import boto3

# File to store login credentials
CREDENTIALS_FILE = "login_credentials.txt"

# Set up the Supabase client with your URL and API Key
url = "https://pristirosscbgmkblozz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXN0aXJvc3NjYmdta2Jsb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDI2MzQsImV4cCI6MjA1NTc3ODYzNH0.7NWqkC5MUndwTxuLGlyBIEskItFzJ3M8iAKcARc_1yM"  # Replace with your Supabase anonymous API key

supabase: Client = create_client(url, key)


client = docker.from_env()

ECR_URI = "864899844109.dkr.ecr.us-east-1.amazonaws.com/hacklytics25/storage"
ecr_client = boto3.client('ecr')
response = ecr_client.get_authorization_token()
auth_token = response['authorizationData'][0]['authorizationToken']
decoded_token = base64.b64decode(auth_token).decode('utf-8')    
_user, _pass = decoded_token.split(':')

registry = response['authorizationData'][0]['proxyEndpoint']
client.login(username=_user, password=_pass, registry=registry)

def authenticate(username, password):
    try:
        auth_response = supabase.auth.sign_in_with_password({"email": username, "password": password})
    except Exception as e:
        print(f"Error during authentication: {e}")
        return False
    return True

def create_account(username, password):
    try:
        sign_up_response = supabase.auth.sign_up({"email": username, "password": password})
    except Exception as e:
        print(f"Error during account creation: {e}")
        return False
    return True

def save_credentials(username, password):
    with open(CREDENTIALS_FILE, 'w') as file:
        file.write(f"{username}\n{password}\n")

def load_credentials():
    if os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, 'r') as file:
            username, password = file.read().splitlines()
            return username, password
    return None, None

def delete_credentials():
    if os.path.exists(CREDENTIALS_FILE):
        os.remove(CREDENTIALS_FILE)
        print("Successfully logged out.")

def download_docker_container(container_url, container_name, username):
    print(f"Downloading from {container_url}...")
    response = requests.get(container_url, stream=True)
    if response.status_code == 200:
        with open(container_name, 'wb') as f:
            shutil.copyfileobj(response.raw, f)
        subprocess.run(["docker", "load", "-i", container_name], check=True)
        print(f"Downloaded/Loaded Docker container {container_name}.")
    else:
        print("Failed to download/load Docker container.")
        exit(1)

def run_docker_container(container_name, docker_dir, timeout_days):
    timeout_seconds = timeout_days * 86400
    print(f"Running Docker container {container_name} with a timeout of {timeout_days} days...")

    try:
        print(str(os.path.abspath('./out')))
        subprocess.run(
            ["docker", "run", "-v", f"{str(os.path.abspath('./out'))}:{docker_dir}", container_name],
            check=True,
            timeout=timeout_seconds
        )
    except subprocess.CalledProcessError as e:
        print(f"Error running Docker container: {e}")
        exit(1)
    except subprocess.TimeoutExpired:
        print(f"Error: Docker container timed out after {timeout_days} days.")
        exit(1)

def track_files():
    output_dir = "out"
    created_files = []
    for root, _, files in os.walk(output_dir):
        for file in files:
            created_files.append(os.path.join(root, file))
    return created_files

def upload_files(files):
    print("Uploading created files...")
    for file in files:
        print(f"Uploading {file}...")  # Implement your file upload logic
    print("All files uploaded successfully.")

def delete_docker_resources(container_name, output_dir):
    print(f"Removing Docker container {container_name}...")
    subprocess.run(["docker", "rm", container_name], check=True)
    
    if os.path.exists(container_name):
        print(f"Removing Docker image file {container_name}...")
        os.remove(container_name)

    if os.path.exists(output_dir):
        print(f"Deleting files in the output directory {output_dir}...")
        shutil.rmtree(output_dir)

async def fetch_container_info(id):
    url = f"http://your-fastapi-url/get-job-info/{id}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    
    if response.status_code == 200:
        job_data = response.json()
        print(f"Job found: {job_data}")
        return job_data
    else:
        print(f"Error fetching job info: {response.status_code}")
        return None
    
async def run_command(id, username):
    data = await fetch_container_info(id)
    print("container info\n" + data)
    user_id = data["user_id"]
    compute_type =  data["compute_type"]
    timeout = data["timeout"]
    docker_dir = data["output_directory"]
    image_name = data["container_name"]


    container_url = "http://example.com/docker_image.tar"
    container_name = f"task_{id}_container.tar" 

    download_docker_container(container_url, container_name, username)
    run_docker_container(image_name, docker_dir)
    
    created_files = track_files()
    upload_files(created_files)

    delete_docker_resources(container_name, "./out")

def main():
    parser = argparse.ArgumentParser(description="Custom CLI with authentication")
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    run_parser = subparsers.add_parser("run", help="Run a task")
    run_parser.add_argument("-k", required=True, help="Authentication key")
   
    run_parser = subparsers.add_parser("logout", help="Logout")
    run_parser = subparsers.add_parser("login", help="Login")
    run_parser = subparsers.add_parser("create_account", help="Create Account")


    args = parser.parse_args()
     
    if args.command == "logout":
        print("Deleting saved credentials...")
        delete_credentials()
        return 
    elif args.command == "login":
        username = input("Username (email): ").lower()
        password = getpass.getpass("Password: ")
        if authenticate(username, password):
            save_credentials(username, password)
            print("Successfully logged in.")
        else:
            print("Authentication failed.")
        return
    elif args.command == "create_account":
        username = input("Username (email): ").lower()
        password = getpass.getpass("Password: ")
        if create_account(username, password):
            if authenticate(username, password):
                save_credentials(username, password)
                print("Successfully created account and logged in.")
            else:
                print("Failed to log in after account creation.")
        else:
            print("Account creation failed.")
        return
    elif args.command == "run":
        if not args.k:
            print("Please provide an authentication key.")
            return
        username, password = load_credentials()
        if username and password:
            print(f"Logged in as {username}")
            if args.command == "run":
                asyncio.run(run_command(args.k, username))
            
        else:
            print("No saved credentials found. Please log in.")
            username = input("Username (email): ").lower()
            password = getpass.getpass("Password: ")

            if authenticate(username, password):
                save_credentials(username, password)
                asyncio.run(run_command(args.k, username))
            else:
                print("Authentication failed.")
                create_account_choice = input("Do you want to create a new account? (y/n): ").strip().lower()
                if create_account_choice == 'y':
                    if create_account(username, password):
                        if authenticate(username, password):
                            save_credentials(username, password)
                            asyncio.run(run_command(args.k, username))
                        else:
                            print("Failed to log in after account creation.")
                    else:
                        print("Account creation failed.")
                else:
                    print("Exiting...")

if __name__ == "__main__":
    main()
