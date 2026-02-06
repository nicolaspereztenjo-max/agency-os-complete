import asyncio
import os
import json
from typing import List, Dict, Any, Tuple
from .banana_adapter import banana_adapter
from openai import OpenAI

class CreativeDirectorService:
    """
    Orchestrates the creation of campaign assets based on high-level brand context.
    Acts as the 'brain' that decides WHAT to generate, then uses BananaAdapter to generate it.
    """
    
    def __init__(self):
        # Automatically detect if API KEY is available
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None

    async def generate_campaign_assets(self, brand_context: str, brand_dna: Dict[str, Any] = None, feedback: str = None) -> Dict[str, Any]:
        """
        Orchestrates the creation of visual strategy and proposed assets.
        If feedback is provided, it refines the previous strategy.
        """
        print(f"🎨 Creative Director: Thinking about '{brand_context}'...")
        if feedback:
            print(f"💬 Incorporating Feedback: '{feedback}'")

        # Simulate "Thinking" time for the AI Strategy phase
        await asyncio.sleep(1.5)

        if self.client:
            # AI Analysis (OpenAI)
            print("🧠 Creative Director: Using GPT-4 for analysis...")
            ai_analysis = await self._analyze_with_ai(brand_context, brand_dna, feedback)
            style = ai_analysis.get("style", "realistic")
            strategy_reasoning = ai_analysis.get("reasoning", "AI Analysis Complete.")
            financial_projection = ai_analysis.get("financial_projection", {"lift": "+15%", "justification": "Baseline growth focus."})
            roi_series = ai_analysis.get("roi_series", [])
            assets_to_generate = ai_analysis.get("assets", [])
        else:
            # Fallback to Mock Logic (Deterministic)
            print("🤖 Creative Director: Using Logic Rules (No API Key found)...")
            style, strategy_reasoning, financial_projection, roi_series, assets_to_generate = self._analyze_with_rules(brand_context, brand_dna, feedback)

        # FAILSAFE: If AI didn't return assets (failure or empty), use fallback defaults
        if not assets_to_generate:
             print("⚠️ AI returned no assets. Using fallback defaults.")
             assets_to_generate = [
                {
                    "type": "Instagram Story",
                    "prompt": f"Vertical {style} composition, {brand_context}, engaging background, high contrast"
                },
                {
                    "type": "Feed Post",
                    "prompt": f"Product focus, {brand_context}, {style} lighting, professional photography"
                },
                {
                    "type": "Ad Creative",
                    "prompt": f"Action shot, {brand_context}, {style} style, dynamic angle for high CTR"
                }
            ]

        # Generate Assets using Banana (if applicable)
        generated_assets = []
        tasks = []
        for asset in assets_to_generate:
            # We use the creative director's specific prompt for EACH asset
            p = asset.get("prompt", f"{brand_context} in {style} style")
            tasks.append(banana_adapter.generate_image(p, style))
        
        # Wait for all images to generate in parallel
        image_urls = await asyncio.gather(*tasks)

        for i, asset in enumerate(assets_to_generate):
            generated_assets.append({
                "type": asset.get("type", "Social Media Asset"),
                "url": image_urls[i],
                "prompt_used": asset.get("prompt", "")
            })

        return {
            "brand_context": brand_context,
            "selected_style": style,
            "strategy_reasoning": strategy_reasoning,
            "financial_projection": financial_projection,
            "roi_series": roi_series,
            "brand_dna": brand_dna,
            "assets": generated_assets
        }


    async def _analyze_with_ai(self, context: str, brand_dna: Dict[str, Any] = None, feedback: str = None) -> Dict[str, Any]:
        """
        Uses OpenAI to determine visual style and asset prompts.
        """
        dna_context = ""
        if brand_dna:
            dna_context = f"""
            BRAND DNA:
            - Tone of Voice: {brand_dna.get('tone', 'Not specified')}
            - Primary Color: {brand_dna.get('primaryColor', 'Not specified')}
            - Accent Color: {brand_dna.get('accentColor', 'Not specified')}
            - Core Purpose: {brand_dna.get('purpose', 'Not specified')}
            """
        refinement_context = f"PREVIOUS FEEDBACK TO INCORPORATE: '{feedback}'" if feedback else ""

        try:
            prompt = f"""
            You are a World-Class Creative Director at a top ad agency.
            
            CLIENT CONTEXT: "{context}"
            TARGET AUDIENCE: "Detect based on context"
            {dna_context}
            {refinement_context}
            
            Your task is to:
            1. Define a unique Visual Style (e.g., 'Cyberpunk', 'Minimalist', 'Bauhaus', 'Vaporwave', 'Corporate Memphis', 'Noir', etc.). BE CREATIVE.
            2. Explain WHY you chose this style for this client (Strategy Reasoning). If Brand DNA is provided, explain how the style aligns with the Brand Tone and Colors.
            3. Propose 3 distinct image assets to generate (Type and detailed Stable Diffusion Prompt). 
               IMPORTANT: In the prompts, include the brand colors ({brand_dna.get('primaryColor') if brand_dna else ''}) if relevant to the aesthetic.
            4. Provide a "Financial Projection" - a percentage of expected growth in conversion or reach (e.g. "+124%") and a brief justification.
            5. Generate a "ROI Series" for the next 6 months to be plotted in a chart.
            
            Return JSON only:
            {{
                "style": "string",
                "reasoning": "string",
                "financial_projection": {{
                    "lift": "+124%",
                    "justification": "string"
                }},
                "roi_series": [
                    {{ "month": "Jan", "revenue": 12000, "spend": 4000 }},
                    {{ "month": "Feb", "revenue": 15000, "spend": 4200 }},
                    {{ "month": "Mar", "revenue": 18000, "spend": 4500 }},
                    {{ "month": "Apr", "revenue": 22000, "spend": 4800 }},
                    {{ "month": "May", "revenue": 27000, "spend": 5200 }},
                    {{ "month": "Jun", "revenue": 33000, "spend": 5500 }}
                ],
                "assets": [
                    {{ "type": "Instagram Story", "prompt": "detailed visual prompt..." }},
                    {{ "type": "Hero Banner", "prompt": "detailed visual prompt..." }},
                    {{ "type": "Product Shot", "prompt": "detailed visual prompt..." }}
                ]
            }}

            IMPORTANT: If feedback is provided, significantly adjust the style or reasoning to match the user's request.
            """
            
            completion = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            content = completion.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"AI Error: {e}")
            return {
                "style": "modern", 
                "reasoning": "AI Service unavailable, defaulting to modern.", 
                "financial_projection": {"lift": "+15%", "justification": "Estimated baseline growth based on modern aesthetic trends."},
                "roi_series": [
                    {"month": "M1", "revenue": 10000, "spend": 5000},
                    {"month": "M2", "revenue": 12000, "spend": 5000},
                    {"month": "M3", "revenue": 11500, "spend": 6000},
                    {"month": "M4", "revenue": 16000, "spend": 5500},
                    {"month": "M5", "revenue": 19000, "spend": 6500},
                    {"month": "M6", "revenue": 24000, "spend": 6000},
                ],
                "assets": []
            }

    def _analyze_with_rules(self, context: str, brand_dna: Dict[str, Any] = None, feedback: str = None) -> Tuple[str, str, Dict[str, Any], List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Deterministic fallback logic.
        """
        context_lower = context.lower()
        style = "realistic"
        strategy_reasoning = "General brand strategy focused on quality and reach."
        financial_projection = {"lift": "+15%", "justification": "Baseline growth focus."}
        
        # Default ROI Series
        roi_series = [
            {"month": "M1", "revenue": 10000, "spend": 5000},
            {"month": "M2", "revenue": 12000, "spend": 5000},
            {"month": "M3", "revenue": 11500, "spend": 6000},
            {"month": "M4", "revenue": 16000, "spend": 5500},
            {"month": "M5", "revenue": 19000, "spend": 6500},
            {"month": "M6", "revenue": 24000, "spend": 6000},
        ]

        # Override with DNA tone if strong match
        if brand_dna and brand_dna.get("tone") == "Cyberpunk":
             context_lower += " tech cyber"
        
        # CASE: TECH
        if any(x in context_lower for x in ["tech", "cyber", "dev", "software", "ai", "crypto"]):
            style = "cyberpunk"
            strategy_reasoning = "Detected tech-forward/innovation keywords. Selecting 'Cyberpunk' aesthetic (Neon + Dark Mode) to emphasize future-readiness and digital sovereignty."
            financial_projection = {"lift": "+142%", "justification": "High-tech aesthetics correlate with increased user engagement in digital product markets."}
            roi_series = [
                {"month": "M1", "revenue": 10000, "spend": 8000},
                {"month": "M2", "revenue": 18000, "spend": 8500},
                {"month": "M3", "revenue": 25000, "spend": 9000},
                {"month": "M4", "revenue": 42000, "spend": 10000},
                {"month": "M5", "revenue": 68000, "spend": 12000},
                {"month": "M6", "revenue": 95000, "spend": 15000},
            ]

        # CASE: WELLNESS / NATURE
        elif any(x in context_lower for x in ["eco", "nature", "health", "organic", "plant", "garden"]):
            style = "minimalist"
            strategy_reasoning = "Detected organic/wellness values. Selecting 'Minimalist' aesthetic (Soft Greens + Whites) to convey purity, calm, and sustainability."
            financial_projection = {"lift": "+88%", "justification": "Minimalism reduces cognitive load, increasing trust and conversion for wellness brands."}
            roi_series = [
                {"month": "M1", "revenue": 5000, "spend": 3000},
                {"month": "M2", "revenue": 7500, "spend": 3200},
                {"month": "M3", "revenue": 11000, "spend": 3500},
                {"month": "M4", "revenue": 15000, "spend": 3800},
                {"month": "M5", "revenue": 22000, "spend": 4000},
                {"month": "M6", "revenue": 31000, "spend": 4500},
            ]

        # CASE: FASHION / LUXURY
        elif any(x in context_lower for x in ["fashion", "luxury", "style", "jewelry", "gold"]):
            style = "editorial" 
            strategy_reasoning = "Detected lifestyle/luxury appeal. Using 'High Editorial' style (Serif Fonts + Gold Accents) to invoke exclusivity and premium status."
            financial_projection = {"lift": "+210%", "justification": "Premium positioning allows for higher price elasticity and brand loyalty."}
            roi_series = [
                {"month": "M1", "revenue": 15000, "spend": 7000},
                {"month": "M2", "revenue": 25000, "spend": 7500},
                {"month": "M3", "revenue": 40000, "spend": 8000},
                {"month": "M4", "revenue": 60000, "spend": 8500},
                {"month": "M5", "revenue": 90000, "spend": 9000},
                {"month": "M6", "revenue": 130000, "spend": 9500},
            ]

        # CASE: GYM / FITNESS
        elif any(x in context_lower for x in ["gym", "fitness", "workout", "crossfit", "sport", "muscle"]):
            style = "dynamic" 
            strategy_reasoning = "Detected high-energy/fitness context. Selecting 'Dynamic Industrial' style (Bold Typography + High Contrast) to motivate action and power."
            financial_projection = {"lift": "+124%", "justification": "High-contrast visuals drive urgency and trial sign-ups in fitness niches."}
            roi_series = [
                {"month": "M1", "revenue": 8000, "spend": 4000},
                {"month": "M2", "revenue": 13000, "spend": 4200},
                {"month": "M3", "revenue": 20000, "spend": 4500},
                {"month": "M4", "revenue": 30000, "spend": 4800},
                {"month": "M5", "revenue": 45000, "spend": 5000},
                {"month": "M6", "revenue": 65000, "spend": 5200},
            ]

        # CASE: REAL ESTATE
        elif any(x in context_lower for x in ["estate", "home", "house", "realty", "property"]):
            style = "corporate"
            strategy_reasoning = "Detected Real Estate context. Selecting 'Modern Corporate' style (clean lines + blue tones) to build trust, stability, and professional authority."
            financial_projection = {"lift": "+65%", "justification": "Professional blue tones increase trust indices for high-ticket real estate transactions."}
            
        # CASE: CAFE / FOOD
        elif any(x in context_lower for x in ["cafe", "coffee", "food", "restaurant", "bakery"]):
            style = "warm"
            strategy_reasoning = "Detected Hospitality context. Selecting 'Warm Cozy' aesthetic (Earth tones + Soft lighting) to stimulate appetite and comfort."
            financial_projection = {"lift": "+95%", "justification": "Warm color palettes are psychologically linked to appetite stimulation and dwell time."}

        # Assets generated in main wrapper for mock
        assets_to_generate = [
            {"type": "Instagram Story", "prompt": f"A beautiful {style} advertisement for {context}, 8k, professional photography."},
            {"type": "Hero Banner", "prompt": f"A cinematic {style} banner showcasing {context} values, epic lighting."},
            {"type": "Mobile Ad", "prompt": f"Modern {style} social media graphic for {context}, vibrant composition."}
        ]

        return style, strategy_reasoning, financial_projection, roi_series, assets_to_generate


creative_director = CreativeDirectorService()
