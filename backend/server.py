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

from supabase import create_client

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
async def get_job_info(job_id: str = Form(...)):
    response = fetch_job(job_id)

    if not response:
        raise HTTPException(status_code=404, detail="Job not found")

    job_data = response.data[0]
    if job_data['lender_id']:
        raise HTTPException(status_code=400, detail="Job already taken by lender")
    
    return JobResponse(
        user_id=job_data['user_id'],
        job_id=job_data['job_id'],
        compute_type=job_data['compute_type'],
        timeout=job_data['timeout'],
        output_directory=job_data['output_directory'],
        price = job_data['price']
    )


def retrieve_container(job_id, image_name):
    image_uri = f"{ECR_URI}:{job_id}"
    client.images.pull(image_uri)
    tar_file_path = f"{image_name}.tar"
    with open(tar_file_path, "wb") as f:
        for chunk in client.images.get(image_uri).save():
            f.write(chunk)

@app.post("/take-job/")
def take_job(job_id: str = Form(...), lender_id: str = Form(...)):
    try:
        supabase.table("jobs").update({"lender_id": lender_id}).eq("job_id", job_id).execute()
        return {"status": "success", "message": f"Job id {job_id} taken by lender {lender_id}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
@app.post("/append-logs/")
def append_logs(job_id: str = Form(...), logs: str = Form(...)):
    try:
        response = supabase.table("logs").select("logs").eq("job_id", job_id).execute()
        
        if response.data:  # Record exists, update it
            current_logs = response.data[0]['logs']
            updated_logs = current_logs + logs
            supabase.table("logs").update({"logs": updated_logs}).eq("job_id", job_id).execute()
        else:  # Record does not exist, insert new
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

@app.get("/retrieve-files-for-job")
def retrieve_files_for_job(job_id: str = Query(...)):
    logs = fetch_logs(job_id)
    files = get_from_s3(job_id)
    ret_dict = {"logs": logs}
    file_list = []
    for file in files:
        file_obj = s3.get_object(Bucket=job_id, Key=file['Key'])
        file_content = file_obj['Body'].read()
        file_list.append({"filename": file['Key'], "content": base64.b64encode(file_content).decode('utf-8')})    
    ret_dict["files"] = file_list
    return ret_dict
    