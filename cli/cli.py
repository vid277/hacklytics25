#!/usr/bin/env python3

import argparse
import getpass
import os
import subprocess
import shutil
import requests
from supabase import create_client, Client

# Set up the Supabase client with your URL and API Key
url = "https://pristirosscbgmkblozz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXN0aXJvc3NjYmdta2Jsb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDI2MzQsImV4cCI6MjA1NTc3ODYzNH0.7NWqkC5MUndwTxuLGlyBIEskItFzJ3M8iAKcARc_1yM"  # Replace with your Supabase anonymous API key

supabase: Client = create_client(url, key)

def authenticate(username, password):
    try:
        auth_response = supabase.auth.sign_in_with_password({"email": username, "password": password})
    except Exception as e:
        print(f"Error during authentication: {e}")
        return False
    return True
def create_account(username, password):
    try:
        # Sign up using email (username) and password
        sign_up_response = supabase.auth.sign_up({"email": username, "password": password})

    except Exception as e:
        print(f"Error during account creation: {e}")
        return False
    return True
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

def run_docker_container(container_name, docker_dir):
    print(f"Running Docker container {container_name}...")
    try:
        print(str(os.path.abspath('./out')))
        subprocess.run(["docker", "run", "-v", f"{str(os.path.abspath('./out'))}:{docker_dir}", container_name], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running Docker container: {e}")
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
        print(f"Uploading {file}...")
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

def fetch_container_info(id):
    print(f"Fetching container info for task {id}...")
    

def run_command(id, username):
    data = fetch_container_info(id)

    container_url = "http://example.com/docker_image.tar" # data["container_url"]
    container_name = f"task_{id}_container.tar" # data["container_name"]
    docker_dir = "/app/output"  # FOR DOCKER JAWN # data["docker_dir"]
    

    download_docker_container(container_url, container_name, username)
    run_docker_container("test-container", docker_dir)
    
    created_files = track_files()
    upload_files(created_files)

    delete_docker_resources(container_name, "./out")

def main():
    parser = argparse.ArgumentParser(description="Custom CLI with authentication")
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    run_parser = subparsers.add_parser("run", help="Run a task")
    run_parser.add_argument("-k", required=True, help="Authentication key")
    
    args = parser.parse_args()

    username = input("Username (email): ").lower()
    password = getpass.getpass("Password: ")

    # Authenticate user via Supabase
    if authenticate(username, password):
        if args.command == "run":
            run_command(args.k)
    else:
        print("Authentication failed.")
        create_account_choice = input("Do you want to create a new account? (y/n): ").strip().lower()
        if create_account_choice == 'y':
            username = input("Username (email): ")
            password = getpass.getpass("Password: ")
            if create_account(username, password):
                
                if authenticate(username, password):
                    if args.command == "run":
                        run_command(args.k)
                else:
                    print("Failed to log in after account creation.")
            else:
                print("Account creation failed.")
        else:
            print("Exiting...")

if __name__ == "__main__":
    main()