from datetime import datetime
import hashlib
import docker
import boto3
ECR_URI = "864899844109.dkr.ecr.us-east-1.amazonaws.com/hacklytics25/storage"

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, HTTPException, UploadFile, Form, Query

import base64
import shutil
import os
from pydantic import BaseModel
from supabase import create_client
import uuid

supabase_url = "https://pristirosscbgmkblozz.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXN0aXJvc3NjYmdta2Jsb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDI2MzQsImV4cCI6MjA1NTc3ODYzNH0.7NWqkC5MUndwTxuLGlyBIEskItFzJ3M8iAKcARc_1yM"
supabase = create_client(supabase_url, supabase_key)




app = FastAPI()
client = docker.from_env()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
ecr_client = boto3.client('ecr')
s3 = boto3.client('s3')
response = ecr_client.get_authorization_token()
auth_token = response['authorizationData'][0]['authorizationToken']
decoded_token = base64.b64decode(auth_token).decode('utf-8')    
username, password = decoded_token.split(':')

registry = response['authorizationData'][0]['proxyEndpoint']
client.login(username=username, password=password, registry=registry)

def insert_job(user_id, job_id, compute_type, timeout, output_directory, price):
    supabase.table("jobs").insert([{"user_id": user_id, "job_id": job_id, "compute_type": compute_type, "timeout": timeout, "output_directory": output_directory, "price": price}]).execute()

def fetch_job(job_id):
    response = supabase.table("jobs").select("*").eq("job_id", job_id).execute()
    return response.data

@app.post("/create-job/")
async def create_job(
    user_id: str = Form(...),  
    file: UploadFile = File(...),  
    compute_type: str = Form(...), 
    timeout: int = Form(...), 
    output_directory: str = Form(...),
    price: float = Form(...)
):
    filename = file.filename
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    job_id = str(uuid.uuid4())
    try:
        with open(file_path, "rb") as image_file:
            image = client.images.load(image_file.read())[0]  # Load and get first image
        tag = f"{ECR_URI}:{job_id}"       
        
        image.tag(tag)        
        push_logs = client.images.push(tag)

    except Exception as e:
        return {"status": "error", "message": str(e)}
    os.remove(file_path)
    
    insert_job(user_id, job_id, compute_type, timeout, output_directory, price)

    return {"status": "success", "message": f"Job id {job_id} created successfully"}


class JobResponse(BaseModel):
    user_id: str
    job_id: str
    compute_type: str
    timeout: int
    output_directory: str
    price: float

@app.get("/get-job-info/", response_model=JobResponse)
async def get_job_info(job_id: str = Form(...), lender_id: str = Form(...)):
    response = fetch_job(job_id)
    if not response:
        raise HTTPException(status_code=404, detail="Job not found")

    job_data = response[0]
    print(job_data)
    if job_data['lender_id'] != lender_id or job_data['completed']:
        raise HTTPException(status_code=400, detail="Job already taken by lender")
    
    return JobResponse(
        user_id=job_data['user_id'],
        job_id=job_data['job_id'],
        compute_type=job_data['compute_type'],
        timeout=job_data['timeout'],
        output_directory=job_data['output_directory'],
        price = job_data['price']
    )



@app.post("/take-job/")
def take_job(job_id: str = Form(...), lender_id: str = Form(...)):
    try:
        supabase.table("jobs").update({"lender_id": lender_id}).eq("job_id", job_id).execute()
        return {"status": "success", "message": f"Job id {job_id} taken by lender {lender_id}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

    
@app.post("/free-job/")
def free_job(job_id: str = Form(...)):
    try:
        response = supabase.table("jobs").select("job_id").eq("job_id", job_id).execute()
        
        if not response.data:
            return {"status": "error", "message": f"Job ID {job_id} not found"}

        update_response = supabase.table("jobs").update({"lender_id": None}).eq("job_id", job_id).execute()

        if update_response.status_code != 200:
            return {"status": "error", "message": f"Failed to update job ID {job_id}. Response: {update_response.status_code}"}

        return {"status": "success", "message": f"Job ID {job_id} lender freed"}
    
    except Exception as e:
        return {"status": "error", "message": f"An error occurred: {str(e)}"}

@app.post("/append-logs/")
def append_logs(job_id: str = Form(...), logs: str = Form(...)):
    try:
        response = supabase.table("logs").select("logs").eq("job_id", job_id).execute()
        
        if response.data: 
            current_logs = response.data[0]['logs']
            updated_logs = current_logs + logs
            supabase.table("logs").update({"logs": updated_logs}).eq("job_id", job_id).execute()
        else: 
            supabase.table("logs").insert({"job_id": job_id, "logs": logs}).execute()
        
        return {"status": "success", "message": "Logs updated successfully"}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/get-log/")
def get_logs(job_id: str = Form(...)):
    response = supabase.table("logs").select("logs").eq("job_id", job_id).execute()
    return response.data[0]['logs'] if response.data else ""


def fetch_logs(job_id):
    response = supabase.table("logs").select("logs").eq("job_id", job_id).execute()
    return response.data[0]['logs'] if response.data else ""

def get_from_s3(job_id):
    
    bucket_name = job_id
    response = s3.list_objects_v2(Bucket=bucket_name)
    files = response['Contents']
    return files

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding

def decrypt(uuid_key, encrypted_message):
    key = hashlib.sha256(uuid_key.encode()).digest() 
    encrypted_data = base64.b64decode(encrypted_message)

    iv = encrypted_data[:12] 
    tag = encrypted_data[-16:]  
    ciphertext = encrypted_data[12:-16]

    cipher = Cipher(algorithms.AES(key), modes.GCM(iv, tag))
    decryptor = cipher.decryptor()
    
    return decryptor.update(ciphertext) + decryptor.finalize()

@app.get("/retrieve-files-for-job")
def retrieve_files_for_job(job_id: str = Query(...), uuid: str = Query(...)):
    logs = fetch_logs(job_id)
    files = get_from_s3(job_id)


    if logs != decrypt(uuid, supabase.table("hashes").select("hash").eq("job_id", job_id).execute()).decode():
        raise HTTPException(status_code=404, detail="Insecure hash. Task maliciously modified.")
    
    ret_dict = {"logs": logs}
    file_list = []
    for file in files:
        file_obj = s3.get_object(Bucket=job_id, Key=file['Key'])
        file_content = file_obj['Body'].read()
        file_list.append({"filename": file['Key'], "content": base64.b64encode(file_content).decode('utf-8')})    
    ret_dict["files"] = file_list
    return ret_dict
    

def get_hour_index():
    now = datetime.utcnow()  
    weekday = now.weekday()  
    hour = now.hour
    return (weekday * 24) + hour
@app.get("/is-active/")
def is_active(user_id: str = Form(...)):
    try:
        response = supabase.table("users").select("lending_active").eq("id", user_id).execute()
        print(response)
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")

        lending_active = response.data[0]["lending_active"]

        hour_index = get_hour_index()

        if hour_index >= len(lending_active):
            return {"active": False}

        is_active = lending_active[hour_index] == "1"

        return {"active": is_active}
    except Exception as e:
        return {"active": False, "error": str(e)}
    
def get_active_time_left(user_id):
    response = supabase.table("users").select("lending_active").eq("id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    lending_active = response.data[0]["lending_active"]
    current_index = get_hour_index()

    if current_index >= len(lending_active) or lending_active[current_index] != "1":
        return 0

    time_left = 0
    for i in range(current_index, len(lending_active)):
        if lending_active[i] == "1":
            time_left += 1
        else:
            break

    return time_left

@app.get("/get-best-job/")
def get_best_job(user_id: str = Form(...), gpu: bool = False):
    try:
        time_left = get_active_time_left(user_id)
        print(time_left)
        if time_left == 0:
            return {"job": None, "message": "No active lending time left"}

        query = supabase.table("jobs").select("*").is_("lender_id", None).lte("timeout", time_left)

        if not gpu:
            query = query.eq("compute_type", "cpu")
        response = query.order("price", desc=True).limit(1).execute()

        best_job = response.data[0] if response.data else None
        return {"job_id": best_job['job_id']}
    except Exception as e:
        return {"job_id": None, "error": str(e)}
