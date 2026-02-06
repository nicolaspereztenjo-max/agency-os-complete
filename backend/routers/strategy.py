from fastapi import APIRouter, HTTPException, Response
from ..services.creative_director import creative_director
from ..services.export_service import export_service
from .. import schemas

router = APIRouter(
    prefix="/strategy",
    tags=["strategy"]
)

@router.post("/generate", response_model=schemas.StrategyResponse)
async def generate_strategy(request: schemas.StrategyRequest):
    """
    Generates a creative strategy and assets based on brand context.
    """
    try:
        # compatibility check for pydantic v1/v2
        brand_dna_dict = None
        if request.brand_dna:
            if hasattr(request.brand_dna, 'model_dump'):
                brand_dna_dict = request.brand_dna.model_dump()
            else:
                brand_dna_dict = request.brand_dna.dict()

        result = await creative_director.generate_campaign_assets(
            brand_context=request.brand_context,
            brand_dna=brand_dna_dict,
            feedback=request.feedback
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export")
async def export_strategy_pdf(data: schemas.StrategyResponse):
    """
    Generates a PDF report for the provided strategy data.
    """
    try:
        # data.dict() is deprecated in v2, but checking if we are on v1 or v2 (assuming v2 or compatible)
        # Using model_dump() for v2 if available, else dict()
        if hasattr(data, 'model_dump'):
            strategy_dict = data.model_dump()
        else:
            strategy_dict = data.dict()
            
        pdf_bytes = export_service.generate_strategy_pdf(strategy_dict)
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=strategy_report.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
