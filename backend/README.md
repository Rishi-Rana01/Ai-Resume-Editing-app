# Resume Editor Backend

This is the backend for the Resume Editor application, built using FastAPI. The backend provides endpoints for saving and enhancing resumes.

## Project Structure

- `app/`: Contains the main application code.
  - `main.py`: Entry point of the FastAPI application.
  - `api/`: Contains API route definitions.
    - `resume.py`: Endpoint for saving resumes.
    - `ai.py`: Endpoint for enhancing resume sections.
  - `models/`: Contains data models.
    - `resume.py`: Defines the structure of the resume data.
  - `utils/`: Contains utility functions.
    - `file_handler.py`: Functions for handling file operations.

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd resume-editor-app/backend
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```
   uvicorn app.main:app --reload
   ```

   The application will be available at `http://127.0.0.1:8000`.

## API Endpoints

- **POST /save-resume**: Saves the uploaded resume data.
- **POST /ai-enhance**: Enhances specific sections of the resume using AI.

## License

This project is licensed under the MIT License.