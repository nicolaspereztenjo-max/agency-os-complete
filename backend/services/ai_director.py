from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Client
from ..schemas import AuditRequest, AuditResponse
from openai import OpenAI
import os
import json

strategic_router = APIRouter()

# Initialize OpenAI Client (Ensure OPENAI_API_KEY is set in env)
client = OpenAI()

@strategic_router.post("/audit", response_model=AuditResponse)
def audit_content(request: AuditRequest, db: Session = Depends(get_db)):
    # 1. Fetch Client Context
    db_client = db.query(Client).filter(Client.id == request.client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")

    # 2. Construct System Prompt
    system_prompt = f"""
    Eres el Director Estratégico de 'Agency OS'.
    
    PERFIL DEL CLIENTE:
    - Marca: {db_client.brand_name}
    - Objetivo Actual: {db_client.current_objective}
    - Tono de Voz: {db_client.tone_of_voice}
    
    TU TAREA:
    Audita el siguiente contenido propuesto. Tu trabajo es asegurar que se alinie con el OBJETIVO.
    Si el objetivo es VENTA, el contenido debe convertir.
    Si es AUTORIDAD, debe educar/posicionar.
    
    Retorna un JSON estricto.
    """

    # 3. Call OpenAI with Structured Outputs
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Pilar: {request.content_pillar}\nContenido: {request.content}"},
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "audit_response",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "approved": {"type": "boolean"},
                            "score": {"type": "integer", "description": "Score from 1-100"},
                            "feedback": {"type": "string"},
                            "suggested_edits": {"type": "string"},
                            "pivot_suggestion": {"type": "string"}
                        },
                        "required": ["approved", "score", "feedback", "suggested_edits", "pivot_suggestion"],
                        "additionalProperties": False
                    }
                }
            }
        )
        
        # Parse response
        response_content = completion.choices[0].message.content
        parsed_data = json.loads(response_content)
        
        return AuditResponse(**parsed_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
