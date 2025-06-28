from pydantic import BaseModel
from typing import List, Optional, Dict

class Resume(BaseModel):
    name: str
    summary: Optional[str] = None
    experience: List[Dict] = []
    education: List[Dict] = []
    skills: List[str] = []