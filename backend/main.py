
print("RUNNING BACKEND FROM:", __file__)
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RESUME_PATH = "resume.json"

class AIEnhanceRequest(BaseModel):
    section: str
    content: str

class SaveResumeRequest(BaseModel):
    name: str
    summary: str
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    skills: List[str]

@app.get("/")
def root():
    return {"message": "Resume API is running"}

@app.post("/ai-enhance")
def ai_enhance(req: AIEnhanceRequest):
    try:
        improved = f"[Enhanced] {req.content}"
        return {"section": req.section, "improved_content": improved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-resume")
def save_resume(req: SaveResumeRequest):
    print("SaveResumeRequest fields:", SaveResumeRequest.__annotations__)
    
    try:
        with open(RESUME_PATH, "w", encoding="utf-8") as f:
            json.dump(req.dict(), f, ensure_ascii=False, indent=2)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-resume-raw")
async def save_resume_raw(request: Request):
    body = await request.body()
    print("Raw /save-resume body:", body.decode())
    return {"status": "logged"}

@app.get("/resume")
def get_resume():
    try:
        if os.path.exists(RESUME_PATH):
            with open(RESUME_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data
        return {"resume": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download-resume")
def download_resume():
    if os.path.exists(RESUME_PATH):
        return FileResponse(RESUME_PATH, media_type='application/json', filename='resume.json')
    raise HTTPException(status_code=404, detail="Resume not found")

@app.delete("/reset-resume")
def reset_resume():
    try:
        if os.path.exists(RESUME_PATH):
            os.remove(RESUME_PATH)
        return {"status": "reset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))