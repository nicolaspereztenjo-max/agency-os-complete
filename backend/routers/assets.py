from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, database

router = APIRouter()

@router.post("/", response_model=schemas.AssetResponse)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(database.get_db)):
    return crud.create_asset(db=db, asset=asset)

@router.get("/", response_model=List[schemas.AssetResponse])
def read_assets(client_id: str = None, asset_type: str = None, db: Session = Depends(database.get_db)):
    assets = crud.get_assets(db, client_id=client_id, asset_type=asset_type)
    return assets
