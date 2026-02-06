from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Client Schemas
class ClientCreate(BaseModel):
    brand_name: str
    current_objective: str # Venta, Autoridad, Trafico
    tone_of_voice: str
    description: Optional[str] = None

class ClientResponse(ClientCreate):
    id: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Content Audit Schemas
class AuditRequest(BaseModel):
    client_id: str
    content: str
    content_pillar: str

class AuditResponse(BaseModel):
    approved: bool
    score: int
    feedback: str
    suggested_edits: str
    pivot_suggestion: Optional[str] = None

# Editorial Post Schemas
class PostBase(BaseModel):
    topic: str
    content_pillar: Optional[str] = None
    content: Optional[str] = None
    date_scheduled: Optional[datetime] = None
    status: Optional[str] = "Idea"
    ai_audit_score: Optional[int] = None
    ai_feedback: Optional[str] = None

class PostCreate(PostBase):
    client_id: str

class PostUpdate(PostBase):
    pass

class PostResponse(PostBase):
    id: str
    client_id: str
    
    class Config:
        from_attributes = True

# Copy Asset Schemas
class AssetBase(BaseModel):
    asset_type: str
    content: str
    tags: Optional[str] = None
    is_favorite: Optional[int] = 0

class AssetCreate(AssetBase):
    client_id: str

class AssetResponse(AssetBase):
    id: str
    client_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Strategy & Creative Director Schemas
class BrandDNA(BaseModel):
    purpose: Optional[str] = None
    tone: Optional[str] = None
    primaryColor: Optional[str] = None
    accentColor: Optional[str] = None
    fontHeading: Optional[str] = None
    logo: Optional[str] = None

class StrategyRequest(BaseModel):
    brand_context: str
    audience: Optional[str] = "General"
    brand_dna: Optional[BrandDNA] = None
    feedback: Optional[str] = None

class StrategyAsset(BaseModel):
    type: str
    url: Optional[str] = None
    prompt_used: Optional[str] = None

class ROIData(BaseModel):
    month: str
    revenue: float
    spend: float

class StrategyResponse(BaseModel):
    brand_context: str
    selected_style: str
    strategy_reasoning: str
    financial_projection: Optional[dict] = None
    roi_series: Optional[List[ROIData]] = None
    brand_dna: Optional[BrandDNA] = None
    assets: List[StrategyAsset]
    
    class Config:
        from_attributes = True
