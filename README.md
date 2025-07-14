# CV Analyzer for QA Engineers

A web application that uses AI to analyze CVs/resumes of QA Engineer candidates against defined criteria, providing pass/fail determinations with confidence levels.

## Features

- Upload CVs in PDF, DOCX, or TXT formats
- Define custom evaluation criteria for QA Engineers
- AI-powered analysis of candidate qualifications
- Detailed results with pass/fail determination, confidence score, strengths, and areas for improvement

## Project Structure

```
cv-analyzer/
├── frontend/       # React frontend
├── backend/        # Python Flask backend
├── models/         # AI model files
└── data/           # Storage for CVs and results
```

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.8+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   FLASK_ENV=development
   ```

5. Start the backend server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install npm dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage Guide

1. **Set Evaluation Criteria**:
   - Navigate to the "Criteria" page
   - Define what makes a good QA Engineer candidate
   - Save your criteria for future use

2. **Upload CVs**:
   - Navigate to the "Upload CV" page
   - Drag and drop a CV file or click to browse
   - Click "Upload and Analyze"

3. **View Results**:
   - After processing, you'll be redirected to the results page
   - Review the pass/fail determination and confidence score
   - Examine candidate strengths and areas for improvement
   - Use the justification to understand the AI's reasoning

## Technologies Used

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Python, Flask
- **AI/ML**: OpenAI API, LangChain
- **Document Processing**: pdfminer.six, docx2txt

## License

MIT
