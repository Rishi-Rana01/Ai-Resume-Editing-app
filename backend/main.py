
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

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import LETTER

PDF_PATH = "resume.pdf"

from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

PDF_PATH = "resume.pdf"

@app.post("/save-resume")
def save_resume(req: SaveResumeRequest):
    try:
        # Save as JSON (optional - keeps last resume data)
        with open(RESUME_PATH, "w", encoding="utf-8") as f:
            json.dump(req.dict(), f, ensure_ascii=False, indent=2)

        # Create PDF
        c = canvas.Canvas(PDF_PATH, pagesize=LETTER)
        width, height = LETTER
        x_margin = 50
        y = height - 50

        def write_line(text, font="Helvetica", size=11, bold=False, gap=18):
            nonlocal y
            c.setFont("Helvetica-Bold" if bold else font, size)
            c.drawString(x_margin, y, text)
            y -= gap

        # Write content
        write_line(f"Name: {req.name}", bold=True, size=14)
        write_line(f"Summary: {req.summary}", size=12, gap=22)

        # Experience Section
        write_line("Experience:", bold=True, size=13)
        for exp in req.experience:
            write_line(f"{exp['role']} at {exp['company']} ({exp['years']})", size=11)
            write_line(f"- {exp['description']}", size=10, gap=16)

        y -= 12

        # Education Section
        write_line("Education:", bold=True, size=13)
        for edu in req.education:
            write_line(f"{edu['degree']} at {edu['school']} ({edu['years']})", size=11)

        y -= 12

        # Skills
        write_line("Skills:", bold=True, size=13)
        write_line(", ".join(req.skills), size=11)

        c.save()

        # Return the generated PDF
        return FileResponse(
            PDF_PATH,
            media_type='application/pdf',
            filename='resume.pdf'
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/save-resume-raw")
async def save_resume_raw(request: Request):
    body = await request.body()
    print("Raw /save-resume body:", body.decode())
    return {"status": "logged"}

@app.get("/resume")
def get_resume():
    if not os.path.exists(RESUME_PATH):
        # Create an empty default resume
        with open(RESUME_PATH, "w", encoding="utf-8") as f:
            json.dump({
                "name": "",
                "summary": "",
                "experience": [],
                "education": [],
                "skills": []
            }, f, ensure_ascii=False, indent=2)

    with open(RESUME_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


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
