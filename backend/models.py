from sqlalchemy import Column, String, Enum, ForeignKey, Text, Integer, DateTime
from sqlalchemy.orm import relationship
import uuid
import datetime
from .database import Base

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_name = Column(String, nullable=False)
    current_objective = Column(String, nullable=True) # Venta, Autoridad, Trafico
    tone_of_voice = Column(Text, nullable=True) # Context for AI System Prompt
    description = Column(Text, nullable=True)
    status = Column(String, default="Active") # Onboarding, Active, Risk
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    posts = relationship("EditorialPost", back_populates="client")
    assets = relationship("CopyAsset", back_populates="client")

class EditorialPost(Base):
    __tablename__ = "editorial_posts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("clients.id"))
    
    content_pillar = Column(String, nullable=True) 
    topic = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    
    date_scheduled = Column(DateTime, nullable=True)
    status = Column(String, default="Idea") # Idea, Copy, Design, Approved, Posted
    
    ai_audit_score = Column(Integer, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    
    # Relationships
    client = relationship("Client", back_populates="posts")

class CopyAsset(Base):
    __tablename__ = "copy_assets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("clients.id"))
    
    asset_type = Column(String, nullable=False) # Hook, Thread, CTA, Bio, Script
    content = Column(Text, nullable=False)
    tags = Column(String, nullable=True) # Comma-separated tags
    
    is_favorite = Column(Integer, default=0) # 0 or 1 (Boolean-ish for SQLite ease)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="assets")
