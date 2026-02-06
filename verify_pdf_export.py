import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'agency_os', 'backend'))

try:
    from backend.services.export_service import export_service
    print("Backend imported successfully.")
except ImportError:
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from backend.services.export_service import export_service
    print("Backend imported via alternate path.")

def test_pdf_export():
    print("--- Testing PDF Export ---")
    data = {
        "brand_context": "A modern coffee shop.",
        "brand_dna": {
            "purpose": "Wake the world up.",
            "tone": "Energetic",
            "primaryColor": "#FF5733",
            "accentColor": "#C70039"
        },
        "strategy_reasoning": "High energy requires bold colors.",
        "selected_style": "Minimalist",
        "assets": [
            {"type": "Instagram Story", "prompt_used": "Coffee cup on table", "url": "http://example.com/img1.jpg"}
        ]
    }
    
    try:
        pdf_bytes = export_service.generate_strategy_pdf(data)
        with open("test_strategy.pdf", "wb") as f:
            f.write(pdf_bytes)
        print("✅ PDF 'test_strategy.pdf' generated successfully.")
    except Exception as e:
        print(f"❌ PDF Generation failed: {e}")

if __name__ == "__main__":
    test_pdf_export()
