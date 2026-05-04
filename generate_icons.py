from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    img = Image.new('RGB', (size, size), color='#111827')
    draw = ImageDraw.Draw(img)
    
    # Cercle de fond
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], fill='#7c3aed')
    
    # "MF" texte
    try:
        font_size = size // 3
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "MF"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1]
    draw.text((x, y), text, fill='white', font=font)
    
    img.save(output_path, 'PNG')
    print(f"Generated {output_path}")

os.makedirs('/home/claude/marwanfit-pwa/public', exist_ok=True)
create_icon(192, '/home/claude/marwanfit-pwa/public/icon-192.png')
create_icon(512, '/home/claude/marwanfit-pwa/public/icon-512.png')
create_icon(180, '/home/claude/marwanfit-pwa/public/apple-touch-icon.png')
