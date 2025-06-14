from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import os
import random
import string
import argparse

def random_filename(length=12):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

# 初始化 Gemini 客户端
client = genai.Client()

quadrilaterals = {
    "square": (
        "A high-quality photograph of a real-world square object. Choose from: "
        "ceramic floor/wall tile, table placemat, coaster, mirror, picture frame, "
        "chessboard square, gift box, lunch box, sticky note (Post-it), grid paper, "
        "building blocks, square window, QR code, Sudoku grid, Rubik's cube face, "
        "or circuit board component. The object should be photographed straight-on "
        "to clearly show all four equal sides and right angles. Natural lighting, "
        "clean background, sharp focus. Perfect square shape for teaching elementary "
        "students geometry."
    ),
    "rectangle": (
        "High-quality photograph of a real-world rectangular object. Choose from: "
        "smartphone screen, book cover, credit card, wooden door, computer monitor, "
        "brick from a wall, or sheet of paper. The object should be photographed "
        "to clearly show two pairs of equal sides and four right angles. "
        "Natural lighting, clean background, sharp focus. Perfect example for "
        "elementary students to recognize rectangular shapes."
    ),
    "rhombus": (
        "High-quality photograph of a real-world diamond/rhombus shaped object. "
        "Choose from: decorative diamond-shaped tile, diamond road sign, "
        "diamond-shaped window, kite, or diamond pattern on fabric/jewelry. "
        "The object should clearly show four equal sides with non-right angles, "
        "distinctly different from a square. Natural lighting, clean background, "
        "sharp focus. Perfect for teaching students the difference between "
        "rhombus and square shapes."
    ),
    "parallelogram": (
        "High-quality photograph of a real-world parallelogram shaped object. "
        "Choose from: complete diagonal shadow of a rectangular window cast on a wall "
        "by slanted sunlight (showing ALL four corners of the shadow), "
        "side view of a slanted roof section, herringbone parquet floor tiles, "
        "slanted road sign, angled building facade, or skewed picture frame. "
        "The object should clearly show two pairs of parallel sides with "
        "non-right angles. For window shadows, ensure the entire shadow is visible "
        "with all four corners clearly defined to distinguish it from a trapezoid. "
        "Natural lighting, clean background, sharp focus. "
        "The parallelogram shape should be obvious for elementary geometry education."
    ),
    "trapezoid": (
        "High-quality photograph of a real-world trapezoid shaped object. "
        "Choose from: side view of stairs showing the trapezoidal profile, "
        "car side window, slanted roof beam, partially drawn curtain, "
        "tilted desk surface, trapezoidal packaging box, or wedge-shaped tool. "
        "IMPORTANT: The object should be photographed from FRONT VIEW (not from above/below) "
        "to clearly show the trapezoid shape with only one pair of parallel sides "
        "(top and bottom different lengths). Avoid showing top/bottom surfaces that "
        "might confuse the shape identification. Natural lighting, clean background, sharp focus."
    )
}

# 详细的具体物体选项
specific_objects = {
    "square": [
        # 日常生活用品
        "A white ceramic bathroom tile on a wall, showing perfect square proportions with visible grout lines",
        "A fabric table placemat laid flat on a wooden dining table, showing square edges",
        "A cork coaster on a coffee table with a coffee cup, showing clear square shape",
        "A square mirror mounted on a white wall, reflecting light to show square frame",
        "A wooden picture frame hanging on wall, displaying clear square proportions",
        "A single square from a chessboard, photographed close-up showing black and white contrast",
        
        # 包装与容器
        "A small gift box with lid, photographed from above showing perfect square top",
        "A square lunch box or bento box on a kitchen counter, showing geometric design",
        "A square chocolate box packaging photographed straight-on",
        
        # 教学与文具
        "A single square from graph/grid paper, photographed close-up with pencil lines visible",
        "A yellow sticky note (Post-it) on a white surface, showing classic square shape",
        "A wooden building block or educational toy cube, photographed to show one square face",
        "A colorful square tile from a children's learning puzzle",
        
        # 建筑与设计
        "A square window of a modern building, photographed straight-on from outside",
        "A square ventilation grill on a white wall, showing geometric pattern",
        "A square floor lamp or ceiling light fixture, photographed to emphasize shape",
        "An aerial view of a city block showing square urban planning grid",
        
        # 数学与科技
        "A QR code displayed on a white background, showing overall square structure",
        "A close-up of a square electronic component on a green circuit board",
        "A computer screen displaying a single square pixel grid enlarged",
        
        # 游戏与娱乐
        "One face of a Rubik's cube showing nine small squares in a 3x3 grid",
        "A Sudoku puzzle grid photographed straight-on, showing square cells",
        "A tic-tac-toe game board drawn on paper, showing square playing grid",
        "A single square tile from a board game, photographed on gaming table"
    ],
    "rectangle": [
        "A hardcover book lying flat, showing clear rectangular cover with visible edges",
        "A smartphone placed on a desk, screen facing up, showing perfect rectangular shape",
        "A credit card on a wooden table, showing standard rectangular proportions",
        "A wooden front door of a house, showing classic rectangular design",
        "A computer monitor screen displaying a white background, showing rectangular frame"
    ],
    "rhombus": [
        "A decorative diamond-shaped ceramic tile with colorful pattern, mounted on wall",
        "A yellow diamond-shaped road warning sign on a post, photographed straight-on",
        "A diamond-shaped stained glass window panel with light shining through",
        "A traditional diamond-shaped kite laid flat on grass, showing four equal sides",
        "A diamond-shaped decorative mirror hanging on a wall"
    ],
    "parallelogram": [
        "The complete diagonal shadow of a rectangular window cast on a white wall by afternoon sunlight, showing ALL four corners of the shadow clearly",
        "A side view of a slanted roof section against the sky, showing clear parallelogram outline",
        "Herringbone parquet floor tiles arranged in a parallelogram pattern, photographed from above",
        "A slanted rectangular road sign on an angled post, showing parallelogram shape",
        "The side facade of a modern building with slanted windows forming parallelograms",
        "A skewed picture frame hanging at an angle, creating parallelogram shape",
        "The complete shadow of a door cast diagonally across a concrete floor, showing all four corners"
    ],
    "trapezoid": [
        "Side view of concrete stairs showing clear trapezoid profile against a plain background",
        "A car side window photographed from outside, showing classic trapezoid shape",
        "A slanted roof beam or rafter viewed from the side, showing trapezoid cross-section",
        "A partially drawn curtain viewed straight-on, showing trapezoid shape",
        "The side profile of a tilted drafting desk or drawing table",
        "A trapezoidal gift box or packaging container photographed from the front",
        "A wooden wedge tool lying flat, showing trapezoid profile",
        "The front view of a support bracket showing trapezoid shape",
        "A train or airplane window viewed straight-on, showing trapezoid proportions",
        "The side view of a blackboard or whiteboard stand showing trapezoid frame",
        "A pyramid viewed from a specific angle showing trapezoid face"
    ]
}

# 按分类组织的正方形物体（用于更有针对性的生成）
square_categories = {
    "daily_life": [
        "bathroom ceramic tile", "kitchen floor tile", "fabric placemat", 
        "cork coaster", "square mirror", "picture frame", "chessboard square"
    ],
    "packaging": [
        "gift box", "chocolate box", "lunch box", "bento container", 
        "square food packaging", "jewelry box"
    ],
    "education": [
        "graph paper square", "sticky note", "Post-it note", 
        "wooden building block", "educational toy cube", "puzzle tile"
    ],
    "architecture": [
        "square window", "ventilation grill", "floor lamp", 
        "ceiling light fixture", "city block planning", "room layout"
    ],
    "technology": [
        "QR code", "circuit board component", "pixel grid", 
        "electronic chip", "computer interface element"
    ],
    "games": [
        "Rubik's cube face", "Sudoku grid", "tic-tac-toe board", 
        "board game tile", "chess square", "game grid"
    ]
}

def generate_image(shape, count=1):
    for i in range(count):
        try:
            # 为正方形使用分类选择
            if shape == "square":
                # 随机选择一个分类
                category = random.choice(list(square_categories.keys()))
                category_objects = square_categories[category]
                selected_object = random.choice(category_objects)
                
                category_names = {
                    "daily_life": "daily household item",
                    "packaging": "packaging or container",
                    "education": "educational or stationery item",
                    "architecture": "architectural or design element",
                    "technology": "technology or digital element",
                    "games": "game or entertainment item"
                }
                
                specific_prompt = (
                    f"High-quality photograph of a real {selected_object} as a perfect example "
                    f"of a square shape. This {category_names[category]} should clearly show "
                    f"four equal sides and four right angles. Photographed straight-on with "
                    f"natural lighting, clean background, sharp focus. The square geometry "
                    f"must be obvious and perfect for elementary school students to identify "
                    f"and understand square characteristics."
                )
                
                print(f"正在生成第 {i+1}/{count} 张 {shape} 图片 (类别: {category_names[category]})...")
                print(f"选择物体: {selected_object}")
                
            else:
                # 其他形状使用原有逻辑
                if shape in specific_objects:
                    specific_prompt = random.choice(specific_objects[shape])
                    specific_prompt += ". High-quality photography, natural lighting, clean composition, sharp focus. The {} shape should be clearly visible and perfect for elementary school geometry education.".format(shape)
                else:
                    specific_prompt = quadrilaterals[shape]
                
                print(f"正在生成第 {i+1}/{count} 张 {shape} 图片...")
            
            print(f"提示词: {specific_prompt[:100]}...")
            
            response = client.models.generate_content(
                model="gemini-2.0-flash-preview-image-generation",
                contents=specific_prompt,
                config=types.GenerateContentConfig(
                    response_modalities=['TEXT', 'IMAGE']
                )
            )
            
            # 处理响应
            for part in response.candidates[0].content.parts:
                if part.text is not None:
                    print(f"Generated text for {shape}:", part.text)
                elif part.inline_data is not None:
                    # 保存图片
                    image = Image.open(BytesIO(part.inline_data.data))
                    
                    # 为正方形添加分类信息到文件名
                    if shape == "square":
                        filename = f"{shape}_{category}_{random_filename()}.png"
                    else:
                        filename = f"{shape}_{random_filename()}.png"
                        
                    out_path = f"real/{shape}/{filename}"
                    os.makedirs(os.path.dirname(out_path), exist_ok=True)
                    image.save(out_path)
                    print(f"✅ {shape} 图片已保存到 {out_path}")
                    
        except Exception as e:
            print(f"❌ 处理 {shape} 时发生错误：{str(e)}")

def main():
    parser = argparse.ArgumentParser(description='生成四边形图片')
    parser.add_argument('--shape', type=str, choices=['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid'],
                      help='要生成的图形类型')
    parser.add_argument('--count', type=int, default=1,
                      help='要生成的图片数量（默认为1）')
    
    args = parser.parse_args()
    
    if args.shape:
        print(f"开始生成 {args.shape} 图片，数量：{args.count}")
        generate_image(args.shape, args.count)
    else:
        print("请指定要生成的图形类型，例如：--shape square --count 2")
        print("可用的图形类型：square, rectangle, rhombus, parallelogram, trapezoid")

if __name__ == "__main__":
    main()

print("🎉 所有图片生成完成！")
print("\n📊 正方形物体分类统计：")
for category, objects in square_categories.items():
    print(f"  {category}: {len(objects)} 种物体")
print(f"\n总计：{sum(len(objects) for objects in square_categories.values())} 种正方形物体选项")