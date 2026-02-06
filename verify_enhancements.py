import asyncio
import sys
import os

# Add parent directory to path to import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.services.creative_director import creative_director
from backend.services.export_service import export_service

async def verify():
    print("--- Verifying Creative Director ---")
    context = "Luxury organic coffee brand focusing on sustainability and premium taste."
    dna = {
        "primaryColor": "#4B2E1E",
        "secondaryColor": "#F5F5DC",
        "accentColor": "#D4AF37",
        "tone": "Elegant",
        "purpose": "To provide the worlds most sustainable coffee experience."
    }
    
    result = await creative_director.generate_campaign_assets(context, brand_dna=dna)
    
    print(f"Style Selected: {result['selected_style']}")
    print(f"Financial Lift: {result['financial_projection']['lift']}")
    print(f"Justification: {result['financial_projection']['justification']}")
    
    print("\n--- Verifying PDF Export ---")
    pdf_bytes = export_service.generate_strategy_pdf(result)
    
    if pdf_bytes and len(pdf_bytes) > 1000:
        print(f"PDF Generated Successfully. Size: {len(pdf_bytes)} bytes")
        with open("verify_report.pdf", "wb") as f:
            f.write(pdf_bytes)
        print("Report saved to verify_report.pdf")
    else:
        print("PDF Generation Failed!")

if __name__ == "__main__":
    asyncio.run(verify())
