import google.generativeai as genai
from PIL import Image
from io import BytesIO
import os
import random
import string

def random_filename(length=12):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

# Gemini API 配置
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("请设置 GEMINI_API_KEY 环境变量")

# 初始化 Gemini 客户端
genai.configure(api_key=GEMINI_API_KEY)

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
        "A clear, simple photo of a real-world object that is a perfect rhombus, but not look like a square. "
        "The object should have four equal sides, but the angles are not right angles, and it should not look like a square. "
        "The background should be plain. This image is for elementary school students to recognize the shape. "
        "Do not include any other geometric shapes in the image."
    ),
    "parallelogram": (
        "A clear, simple photo of a real-world object that is a perfect parallelogram. "
        "The object should have two pairs of parallel sides, but the angles are not right angles. "
        "The parallelogram should be the main focus, not located on the side of an object or on the background. "
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
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-preview-image-generation')
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.4,
                top_p=1,
                top_k=32,
                max_output_tokens=2048,
            )
        )
        
        # 处理响应
        if response.candidates and response.candidates[0].content:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'text') and part.text:
                    print(f"Generated text for {shape}:", part.text)
                elif hasattr(part, 'inline_data') and part.inline_data:
                    # 保存图片
                    image = Image.open(BytesIO(part.inline_data.data))
                    filename = random_filename() + ".png"
                    out_path = f"real/{shape}/{filename}"
                    os.makedirs(os.path.dirname(out_path), exist_ok=True)
                    image.save(out_path)
                    print(f"{shape} 图片已保存到 {out_path}")
                
    except Exception as e:
        print(f"处理 {shape} 时发生错误：{str(e)}") 