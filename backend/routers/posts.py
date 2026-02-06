from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

@router.post("/", response_model=schemas.PostResponse)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    # Verify client exists
    client = db.query(models.Client).filter(models.Client.id == post.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
        
    db_post = models.EditorialPost(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/client/{client_id}", response_model=List[schemas.PostResponse])
def read_posts_by_client(client_id: str, db: Session = Depends(get_db)):
    posts = db.query(models.EditorialPost).filter(models.EditorialPost.client_id == client_id).all()
    return posts

@router.get("/{post_id}", response_model=schemas.PostResponse)
def read_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(models.EditorialPost).filter(models.EditorialPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}", response_model=schemas.PostResponse)
def update_post(post_id: str, post_update: schemas.PostUpdate, db: Session = Depends(get_db)):
    db_post = db.query(models.EditorialPost).filter(models.EditorialPost.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_data = post_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_post, key, value)
    
    db.commit()
    db.refresh(db_post)
    return db_post

from ..services.copywriter import copywriter
from pydantic import BaseModel

class BatchGenerateRequest(BaseModel):
    brand_context: str
    mode: str = "Standard"

@router.post("/generate-batch")
def generate_batch(request: BatchGenerateRequest):
    """
    Generates a batch of posts not persisted to DB yet.
    Frontend can preview them.
    """
    return copywriter.generate_post_batch(request.brand_context, request.mode)
