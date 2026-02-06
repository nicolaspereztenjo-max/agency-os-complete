import os
from openai import OpenAI
from pathlib import Path
import uuid

class AudioStudioService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        
        # Ensure static/audio directory exists
        self.output_dir = Path("static/audio")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    async def generate_speech(self, text: str, voice: str = "alloy") -> str:
        """
        Generates TTS audio from text using OpenAI.
        Returns the relative URL to the file.
        """
        if not self.client:
            raise Exception("OpenAI API Key not found")

        try:
            filename = f"speech_{uuid.uuid4()}.mp3"
            filepath = self.output_dir / filename
            
            response = self.client.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text
            )
            
            response.stream_to_file(filepath)
            
            # Return relative path for frontend access (assuming static mount)
            return f"/static/audio/{filename}"

        except Exception as e:
            print(f"❌ TTS Generation failed: {e}")
            raise e

audio_studio = AudioStudioService()
