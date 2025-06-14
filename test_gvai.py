import requests
import json
import os

# 替换为你的项目ID和区域
project = "organic-totem-373602"
location = "us-central1"
api_endpoint = f"https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/google/models/imagegeneration:predict"

# 读取服务账号token
from google.auth.transport.requests import Request
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file(
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"],
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)
credentials.refresh(Request())
token = credentials.token

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

data = {
    "instances": [
        {
            "prompt": "一个完美的正方形，四条边相等，四个角都是直角，在现实世界中的物体"
        }
    ],
    "parameters": {
        "sampleCount": 1
    }
}

response = requests.post(api_endpoint, headers=headers, data=json.dumps(data))
print(response.json())