import fitz
import docx
import os

def analyze_pdf(path):
    print(f"Analyzing PDF: {path}")
    try:
        doc = fitz.open(path)
        print(f"  Pages: {len(doc)}")
        total_images = 0
        for i, page in enumerate(doc):
            images = page.get_images(full=True)
            count = len(images)
            total_images += count
            print(f"  Page {i+1}: {count} images")
            if i == 0 and count > 0:
                # Try extracting one
                xref = images[0][0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                with open("temp_test_image.png", "wb") as f:
                    f.write(image_bytes)
                print("  Successfully extracted a test image from page 1.")
        print(f"  Total images found: {total_images}")
    except Exception as e:
        print(f"  Error analyzing PDF: {e}")

def analyze_docx(path):
    print(f"Analyzing DOCX: {path}")
    try:
        doc = docx.Document(path)
        text = "\n".join([p.text for p in doc.paragraphs])
        print(f"  Total characters: {len(text)}")
        print(f"  First 200 chars: {text[:200]}")
        return text
    except Exception as e:
        print(f"  Error analyzing DOCX: {e}")
        return ""

def read_txt(path):
    print(f"Reading TXT: {path}")
    try:
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        print(f"  Total characters: {len(text)}")
        print(f"  First 200 chars: {text[:200]}")
        return text
    except Exception as e:
        print(f"  Error reading TXT: {e}")
        return ""

if __name__ == "__main__":
    pdf_path = "docs/MikeFitz.pdf"
    docx_path = "docs/Five Pages  From Mike About Vietname.docx"
    txt_path = "docs/Mike Vietnam Remembrances circa 2003 .txt"

    analyze_pdf(pdf_path)
    docx_text = analyze_docx(docx_path)
    txt_text = read_txt(txt_path)

    if docx_text and txt_text:
        # Simple comparison
        import difflib
        ratio = difflib.SequenceMatcher(None, docx_text, txt_text).ratio()
        print(f"Similarity between DOCX and TXT: {ratio:.2f}")
