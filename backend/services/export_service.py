from fpdf import FPDF
import io

class ExportService:
    def generate_strategy_pdf(self, data: dict) -> bytes:
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_font("Arial", "B", 20)
        pdf.cell(0, 15, "Agency OS - Strategy Report", ln=True, align="C")
        pdf.ln(10)
        
        # Brand DNA Section
        brand_dna = data.get("brand_dna")
        if brand_dna:
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, "Brand Identity (DNA)", ln=True)
            pdf.set_font("Arial", "", 10)
            
            # Helper to clean text
            def clean(text):
                if not text: return "N/A"
                return str(text).encode('latin-1', 'replace').decode('latin-1')

            pdf.cell(0, 6, f"Core Purpose: {clean(brand_dna.get('purpose'))}", ln=True)
            pdf.cell(0, 6, f"Tone of Voice: {clean(brand_dna.get('tone'))}", ln=True)
            
            # Colors
            pdf.cell(0, 6, f"Primary Color: {clean(brand_dna.get('primaryColor'))} | Accent: {clean(brand_dna.get('accentColor'))}", ln=True)
            pdf.ln(5)

        # Brand Context
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "Campaign Context", ln=True)
        pdf.set_font("Arial", "", 12)
        # Handle unicode issues with FPDF (basic fix)
        context = data.get("brand_context", "N/A").encode('latin-1', 'replace').decode('latin-1')
        pdf.multi_cell(0, 10, context)
        pdf.ln(5)
        
        # Strategic Reasoning
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "Strategic Reasoning", ln=True)
        pdf.set_font("Arial", "", 12)
        reasoning = data.get("strategy_reasoning", "N/A").encode('latin-1', 'replace').decode('latin-1')
        pdf.multi_cell(0, 10, reasoning)
        pdf.ln(5)
        
        # Selected Style
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "Visual Style", ln=True)
        pdf.set_font("Arial", "", 12)
        style = data.get("selected_style", "N/A").capitalize()
        pdf.cell(0, 10, f"Style: {style}", ln=True)
        pdf.ln(5)
        
        # Financial Projections
        projection = data.get("financial_projection")
        if projection:
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, "Financial Impact & Projections", ln=True)
            
            pdf.set_fill_color(240, 240, 240)
            pdf.set_font("Arial", "B", 24)
            lift = projection.get("lift", "N/A")
            pdf.cell(0, 20, lift, ln=True, align="C", fill=True)
            
            pdf.set_font("Arial", "I", 10)
            justification = projection.get("justification", "N/A").encode('latin-1', 'replace').decode('latin-1')
            pdf.multi_cell(0, 10, f"Strategic Justification: {justification}")
            pdf.ln(5)

        # Assets
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "Proposed Campaign Assets", ln=True)
        pdf.set_font("Arial", "", 10)
        
        assets = data.get("assets", [])
        for i, asset in enumerate(assets, 1):
            pdf.set_font("Arial", "B", 11)
            pdf.cell(0, 8, f"Asset {i}: {asset.get('type', 'Unknown')}", ln=True)
            
            pdf.set_font("Arial", "I", 10)
            prompt = asset.get('prompt_used', 'No prompt').encode('latin-1', 'replace').decode('latin-1')
            pdf.multi_cell(0, 6, f"Prompt: {prompt}")
            
            url = asset.get('url', '')
            if url:
                pdf.set_text_color(0, 0, 255)
                pdf.set_font("Arial", "U", 10)
                pdf.cell(0, 6, "View Image", ln=True, link=url)
                pdf.set_text_color(0, 0, 0)
            
            pdf.ln(3)

        # Output to string/bytes
        return bytes(pdf.output(dest='S'))

export_service = ExportService()
