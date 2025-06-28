# Resume Editor Web App

A full-stack web-based Resume Editor with AI enhancement (mocked), built with React (frontend) and FastAPI (backend).

## Features
- Upload and edit resumes (mock parse for .pdf/.docx)
- Edit fields: name, summary, experience, education, skills
- Enhance any section with a mock AI backend
- Save and retrieve resume data via FastAPI
- Download the final resume as a .json file
- Beautiful dark theme with Tailwind CSS, transitions, and hover effects

---

## Setup Instructions

### Backend (FastAPI)

1. **Install dependencies:**
   ```sh
   cd backend
   pip install -r requirements.txt
   ```
2. **Run the server:**
   ```sh
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

---

### Frontend (React + Tailwind CSS)

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## Usage
- Upload a resume file (mocked, loads dummy data)
- Edit any section
- Click "Enhance with AI" to improve a section (mocked)
- Save to backend or download as JSON

---

## Folder Structure
```
/frontend   # React app (Tailwind, dark theme)
/backend    # FastAPI app (AI mock, save/load endpoints)
```

---

## Notes
- No real AI or PDF/DOCX parsing is performed; all enhancements and parsing are mocked.
- Resume data is saved as `resume.json` in the backend folder.
