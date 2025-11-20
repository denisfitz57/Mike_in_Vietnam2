import fitz  # pymupdf
import pytesseract
from PIL import Image
import io
import json
import os
import re

# Configuration
TXT_PATH = "docs/Mike Vietnam Remembrances circa 2003 .txt"
PDF_PATH = "docs/MikeFitz.pdf"
OUTPUT_DIR = "public/images"
DATA_FILE = "src/data/content.json"

# Ensure directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

def process_remembrances(path):
    print(f"Processing text file: {path}")
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Normalize line endings
    content = content.replace('\r\n', '\n')
    
    # Split by double newline (paragraphs)
    # The user said: "Two consecutive carriage return line feeds should be regarded as a marker for a paragraph. 
    # Spaces should be substituted for all other carriage return line feeds."
    
    # First, split by double newlines to get paragraphs
    paragraphs_raw = re.split(r'\n\s*\n', content)
    
    cleaned_paragraphs = []
    for p in paragraphs_raw:
        # Replace single newlines with spaces within the paragraph
        cleaned = p.replace('\n', ' ').strip()
        if cleaned:
            cleaned_paragraphs.append(cleaned)
            
    print(f"  Found {len(cleaned_paragraphs)} paragraphs.")
    return cleaned_paragraphs

def process_pdf(path):
    print(f"Processing PDF: {path}")
    doc = fitz.open(path)
    clippings = []
    
    for i, page in enumerate(doc):
        images = page.get_images(full=True)
        print(f"  Page {i+1}: Found {len(images)} images")
        
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            ext = base_image["ext"]
            
            # Save image
            filename = f"clip_p{i+1}_{img_index}.{ext}"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            with open(filepath, "wb") as f:
                f.write(image_bytes)
            
            # Perform OCR
            try:
                pil_image = Image.open(io.BytesIO(image_bytes))
                ocr_text = pytesseract.image_to_string(pil_image)
            except Exception as e:
                print(f"    OCR failed for {filename}: {e}")
                ocr_text = ""
            
            clippings.append({
                "id": f"p{i+1}_{img_index}",
                "path": f"/images/{filename}",
                "page": i + 1,
                "ocr_text": ocr_text.strip()
            })
            
    print(f"  Extracted {len(clippings)} clippings.")
    return clippings

def main():
    remembrances = process_remembrances(TXT_PATH)
    clippings = process_pdf(PDF_PATH)
    
    data = {
        "remembrances": remembrances,
        "clippings": clippings
    }
    
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Data saved to {DATA_FILE}")

if __name__ == "__main__":
    main()
