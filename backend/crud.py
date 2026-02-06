from sqlalchemy.orm import Session
from . import models, schemas
import uuid

# --- CLIENTS ---
def get_client(db: Session, client_id: str):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Client).offset(skip).limit(limit).all()

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(
        brand_name=client.brand_name,
        current_objective=client.current_objective,
        tone_of_voice=client.tone_of_voice,
        description=client.description
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

# --- POSTS ---
def get_posts(db: Session, client_id: str = None, skip: int = 0, limit: int = 100):
    query = db.query(models.EditorialPost)
    if client_id:
        query = query.filter(models.EditorialPost.client_id == client_id)
    return query.offset(skip).limit(limit).all()

def create_post(db: Session, post: schemas.PostCreate):
    db_post = models.EditorialPost(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def update_post(db: Session, post_id: str, post_update: schemas.PostUpdate):
    db_post = db.query(models.EditorialPost).filter(models.EditorialPost.id == post_id).first()
    if db_post:
        update_data = post_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_post, key, value)
        db.commit()
        db.refresh(db_post)
    return db_post

def delete_post(db: Session, post_id: str):
    db_post = db.query(models.EditorialPost).filter(models.EditorialPost.id == post_id).first()
    if db_post:
        db.delete(db_post)
        db.commit()
    return db_post

# --- ASSETS (CopyBank) ---
def get_assets(db: Session, client_id: str = None, asset_type: str = None):
    query = db.query(models.CopyAsset)
    if client_id:
        query = query.filter(models.CopyAsset.client_id == client_id)
    if asset_type:
        query = query.filter(models.CopyAsset.asset_type == asset_type)
    return query.all()

def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.CopyAsset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset
