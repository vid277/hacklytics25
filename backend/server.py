from fastapi import FastAPI, File, UploadFile, Form
import docker
import shutil
import os

app = FastAPI()
client = docker.from_env()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-docker/")
async def upload_docker(user_id: str = Form(...), file: UploadFile = File(...)):
    """
    Accepts a Docker image tar file, saves it temporarily, and loads it into Docker.
    """
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}.tar")

    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Load image into Docker
    try:
        with open(file_path, "rb") as image_file:
            image = client.images.load(image_file.read())[0]  # Load and get first image
        image.tag(f"user_{user_id}:latest")  # Tag the image
    except Exception as e:
        return {"status": "error", "message": str(e)}

    # Remove the file after loading
    os.remove(file_path)

    return {"status": "success", "message": f"Docker image for user {user_id} uploaded and tagged."}
