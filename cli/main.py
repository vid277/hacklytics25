import requests

API_KEY = "YOUR_WEB3_STORAGE_API_KEY"

def upload_to_web3storage(data):
    url = "https://api.web3.storage/upload"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    files = {"file": (None, data.encode())}
    response = requests.post(url, headers=headers, files=files)
    return response.json()

hash_data = "your-hash-to-store"
result = upload_to_web3storage(hash_data)
print("Stored at:", result["cid"])
