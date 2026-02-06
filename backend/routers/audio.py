from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.audio_studio import audio_studio

router = APIRouter(prefix="/api/v1/audio", tags=["audio"])

class SpeechRequest(BaseModel):
    text: str
    voice: str = "alloy"

@router.post("/generate")
async def generate_speech(request: SpeechRequest):
    try:
        url = await audio_studio.generate_speech(request.text, request.voice)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
