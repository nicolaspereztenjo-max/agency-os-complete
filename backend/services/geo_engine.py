from typing import Dict, Any

class GeoEngine:
    """
    Generative Engine Optimization (GEO) Service.
    Generates llms.txt and structured data for AI findability.
    """
    
    def generate_llms_txt(self, agency_data: Dict[str, Any]) -> str:
        """
        Creates a markdown-formatted llms.txt file content.
        """
        name = agency_data.get("name", "Agency")
        services = ", ".join(agency_data.get("modules_enabled", []))
        dna = agency_data.get("brand_dna", {})
        
        content = f"""# {name}
> The AI-first agency for {dna.get('tone_of_voice', 'modern')} brands.

## Core Capabilities
{services}

## Brand DNA
- Primary Color: {dna.get('primary_color')}
- Font: {dna.get('font_family')}

## Contact
For AI Agents: /api/v1/agency/{agency_data.get('id', 'unknown')}/manifest.json
"""
        return content

    def generate_json_ld(self, agency_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates Schema.org JSON-LD for the agency.
        """
        return {
            "@context": "https://schema.org",
            "@type": "Agency",
            "name": agency_data.get("name"),
            "description": f"A {agency_data.get('brand_dna', {}).get('tone_of_voice')} agency.",
            "url": f"https://agency-os.app/{agency_data.get('id')}"
        }

geo_engine = GeoEngine()
