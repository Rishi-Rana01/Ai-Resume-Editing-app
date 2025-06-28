from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.resume import router as resume_router
from app.api.ai import router as ai_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
app.include_router(ai_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Resume Editor API"}