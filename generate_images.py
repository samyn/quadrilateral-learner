import requests
import json
import os
from google.auth.transport.requests import Request
from google.oauth2 import service_account
import base64
import random
import string

def random_filename(length=12):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

# 替换为你的项目ID和区域
project = "organic-totem-373602"  # 用你的实际项目ID
location = "us-central1"
api_endpoint = f"https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/google/models/imagegeneration:predict"

# 获取token
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

quadrilaterals = {
    "square": (
        "A clear, simple photo of a real-world object that is a perfect square. "
        "The object should have four equal sides and four right angles, with obvious straight edges. "
        "The background should be plain. This image is for elementary school students to recognize the shape. "
        "Do not include any other geometric shapes in the image."
    ),
    "rectangle": (
        "A clear, simple photo of a real-world object that is a perfect rectangle. "
        "The object should have two pairs of equal sides and four right angles, with obvious straight edges. "
        "The background should be plain. This image is for elementary school students to recognize the shape. "
        "Do not include any other geometric shapes in the image."
    ),
    "rhombus": (
        "A clear, simple photo of a real-world object that is a perfect rhombus, but not look like asquare. "
        "The object should have four equal sides, but the angles are not right angles, and it should not look like a square. "
        "The background should be plain. This image is for elementary school students to recognize the shape. "
        "Do not include any other geometric shapes in the image."
    ),
    "parallelogram": (
        "A clear, simple photo of a real-world object that is a perfect parallelogram. "
        "The object should have two pairs of parallel sides, but the angles are not right angles."
        "the parallelogram should be the main focus, not located on the side of an object or on the background "
        "The background should be plain. This image is for elementary school students to recognize the shape. "
        "Do not include any other geometric shapes in the image."
    ),
    "trapezoid": (
        "A clear, simple photo of a real-world object that is a perfect trapezoid. "
        "The object should have four sides with only one pair of parallel sides. "
        "The background should be plain. This image is for elementary school students to recognize the shape. "
        "Do not include any other geometric shapes in the image."
    )
}

for shape, prompt in quadrilaterals.items():
    data = {
        "instances": [
            {
                "prompt": prompt
            }
        ],
        "parameters": {
            "sampleCount": 1
        }
    }
    response = requests.post(api_endpoint, headers=headers, data=json.dumps(data))
    result = response.json()
    # 检查是否有图片返回
    if "predictions" in result and len(result["predictions"]) > 0:
        img_b64 = result["predictions"][0]["bytesBase64Encoded"]
        img_bytes = base64.b64decode(img_b64)
        filename = random_filename() + ".png"        
        out_path = f"real/{shape}/{filename}"
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "wb") as f:
            f.write(img_bytes)
        print(f"{shape} 图片已保存到 {out_path}")
    else:
        print(f"{shape} 生成失败，返回内容：{result}") 