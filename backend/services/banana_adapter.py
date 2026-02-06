import asyncio
import os
from openai import OpenAI

class BananaAdapter:
    """
    Adapter for Banana AI / Image Generation.
    Uses OpenAI DALL-E 3 if API key is present, otherwise falls back to placeholders.
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            print(f"🍌 BananaAdapter: API Key detected! (Starts with {self.api_key[:8]}...)")
            self.client = OpenAI(api_key=self.api_key)
        else:
            print("🍌 BananaAdapter: ⚠️ NO API KEY found in environment variables.")
            self.client = None

    async def generate_image(self, prompt: str, style: str = "realistic"):
        """
        Generates an image using DALL-E 3 or returns a placeholder.
        """
        if self.client:
            try:
                print(f"🎨 Banana Adapter: Requesting DALL-E 3 for: {prompt[:30]}...")
                # Run sync OpenAI call in a separate thread to not block async loop
                response = await asyncio.to_thread(
                    self.client.images.generate,
                    model="dall-e-3",
                    prompt=f"{style} style. {prompt}",
                    size="1024x1024",
                    quality="standard",
                    n=1,
                )
                url = response.data[0].url
                print(f"✅ DALL-E Success: {url[:50]}...")
                return url
            except Exception as e:
                print(f"❌ DALL-E CRITICAL FAILURE: {str(e)}")
                # Fallback to placeholder on error
        
        # Fallback / Mock
        await asyncio.sleep(0.5)
        encoded_prompt = prompt.replace(" ", "+")
        # Use placehold.co as reliable fallback - using dark theme to differentiate from previous white box
        return f"https://placehold.co/600x600/1a1a1a/FFF?text={encoded_prompt[:50]}..."

banana_adapter = BananaAdapter()
