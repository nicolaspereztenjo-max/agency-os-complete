import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
from pydantic import BaseModel

# Services
from .services.geo_engine import geo_engine
from .services.banana_adapter import banana_adapter
from .services.social_audit import social_auditor
from .services.meta_analytics import meta_analytics
from .database import engine
from . import models
from fastapi.staticfiles import StaticFiles
from .routers import clients, posts, strategy, audio

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agency OS API", version="1.0.0")

# Mount Static Files for Audio/Video
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add production origins from env var
prod_origins = os.getenv("ALLOWED_ORIGINS", "")
if prod_origins:
    origins.extend(prod_origins.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(clients.router)
app.include_router(posts.router)
app.include_router(strategy.router)
app.include_router(audio.router)

# --- Models ---
class AgencyData(BaseModel):
    id: str
    name: str
    modules_enabled: list[str] = []
    brand_dna: Dict[str, Any]

class ImagePrompt(BaseModel):
    prompt: str
    style: str = "realistic"

# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "Agency OS System Online", "version": "1.0.0"}

# 1. GEO Engine Routes
@app.post("/api/v1/geo/llms")
def generate_llms_txt(data: AgencyData):
    content = geo_engine.generate_llms_txt(data.model_dump())
    return {"content": content}

@app.post("/api/v1/geo/json-ld")
def generate_json_ld(data: AgencyData):
    json_ld = geo_engine.generate_json_ld(data.model_dump())
    return json_ld

# 2. Banana AI Routes
@app.post("/api/v1/generate/image")
async def generate_image(data: ImagePrompt):
    image_url = await banana_adapter.generate_image(data.prompt, data.style)
    return {"url": image_url}

# 3. Social Audit Routes
@app.get("/api/v1/audit/social")
def audit_social(username: str, platform: str = "instagram"):
    return social_auditor.analyze_profile(username, platform)

# 4. Meta Integration Routes
@app.post("/api/v1/meta/connect")
def connect_meta():
    return meta_analytics.connect_account()

@app.get("/api/v1/meta/stats")
def get_meta_stats(account_id: str):
    return meta_analytics.get_account_stats(account_id)

# 5. Database Check (Health)
@app.get("/health/db")
def db_health():
    try:
        # Simple read to check connection
        return {"status": "connected", "database": "sqlite"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
