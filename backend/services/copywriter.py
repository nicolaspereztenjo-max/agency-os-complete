from typing import List, Dict, Any
import random
import datetime
import json

class CopywriterService:
    """
    Generates social media copy based on brand context.
    """
    
    def __init__(self):
        import os
        from openai import OpenAI
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def generate_post_batch(self, brand_context: str, mode: str = "Standard") -> List[Dict[str, Any]]:
        """
        Generates a batch of posts for the current month.
        """
        today = datetime.date.today()
        posts = []
        
        # Determine themes based on context (Basic keyword detection)
        context_lower = brand_context.lower()
        themes = ["Product Spotlight", "Behind the Scenes", "Industry Tip", "Customer Story"]
        
        if "tech" in context_lower:
            themes = ["Tech Deep Dive", "Future Trends", "Dev Humor", "Case Study"]
        elif "fashion" in context_lower:
            themes = ["OOTD", "Style Guide", "Fabric Close-up", "Collection Drop"]
        elif "food" in context_lower:
            themes = ["Recipe Idea", "Ingredient Focus", "Kitchen Hack", "Menu Highlight"]
        # Added specific fallback for PLANTS
        elif any(x in context_lower for x in ["plant", "plantas", "jardin", "garden", "botanica"]):
            themes = ["Plant Care Tip", "Rare Species", "Watering Schedule", "Green Corner"]
            
        # Generate 5-8 random posts for the month
        num_posts = random.randint(5, 8)
        used_days = set()

        for _ in range(num_posts):
            for attempt in range(10): 
                day_offset = random.randint(1, 28)
                if day_offset not in used_days:
                    used_days.add(day_offset)
                    break
            
            post_date = today + datetime.timedelta(days=day_offset)
            theme = random.choice(themes)
            
            if self.client:
                # Use Real AI
                post = self._create_post_with_ai(theme, context_lower, post_date, mode)
            else:
                # Use Fallback
                post = self._create_post(theme, context_lower, post_date, mode)
                
            posts.append(post)

        return posts

    def _create_post_with_ai(self, theme: str, context: str, date: datetime.date, mode: str) -> Dict[str, Any]:
        """
        Real AI Generation
        """
        try:
            prompt = f"""
            Write a social media post for a brand described as: "{context}".
            Theme: {theme}
            Tone: {mode}
            
            Return JSON: {{ "title": "{theme}", "content": "post caption with emojis", "hashtags": "#tags" }}
            """
            
            completion = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(completion.choices[0].message.content)
            
            return {
                "title": data.get("title", theme),
                "date": date.strftime("%Y-%m-%d"),
                "day": date.day,
                "content": data.get("content", "Content generation failed."),
                "hashtags": data.get("hashtags", "#AgencyOS"),
                "type": random.choice(["carousel", "reel", "story", "static"]),
                "status": "draft",
                "platform": random.choice(["instagram", "linkedin", "twitter"])
            }
        except Exception:
            return self._create_post(theme, context, date, mode)

    def _create_post(self, theme: str, context: str, date: datetime.date, mode: str) -> Dict[str, Any]:
        """
        Creates a single post object with copy.
        """
        # Mock Copy Generation
        hooks = [
            f"Ready to revolutionize your {theme}?",
            f"You won't believe this {theme} secret.",
            f"The ultimate guide to {theme}.",
            f"Why everyone is talking about {theme}."
        ]
        
        call_to_actions = [
            "Link in bio!",
            "Drop a 🔥 if you agree.",
            "Save this for later.",
            "DM for details."
        ]
        
        platforms = ["instagram", "linkedin", "twitter"]
        platform = random.choice(platforms)
        
        copy_body = f"We are diving deep into {theme} today. It is essential for {context[:20]}... [AI Generated Content Block]. "
        
        if "plant" in context or "jardin" in context:
             hooks = ["🌿 Don't kill your plants!", "🌵 New succulent alert!", "🌸 Blooming season is here."]
             copy_body = f"Bring life to your space with our new {theme}. Nature is the best designer."
        
        return {
            "title": theme,
            "date": date.strftime("%Y-%m-%d"),
            "day": date.day, # Easy access for frontend mapping
            "content": f"{random.choice(hooks)}\n\n{copy_body}\n\n{random.choice(call_to_actions)}",
            "hashtags": f"#{theme.replace(' ', '')} #AgencyOS #{context.split(' ')[0]}",
            "type": random.choice(["carousel", "reel", "story", "static"]),
            "status": "draft",
            "platform": platform
        }

copywriter = CopywriterService()
