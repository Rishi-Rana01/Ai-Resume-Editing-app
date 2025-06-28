from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class AIEnhanceRequest(BaseModel):
    section: str
    content: str

@router.post("/ai-enhance")
async def ai_enhance(req: AIEnhanceRequest):
    try:
        improved = f"[Enhanced] {req.content}"
        return {"section": req.section, "improved_content": improved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))