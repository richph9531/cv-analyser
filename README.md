# CV Analyzer for QA Engineers

A web application that uses AI to analyze CVs/resumes of QA Engineer candidates against defined criteria, providing pass/fail determinations with confidence levels.

## Project Structure

```
cv-analyzer/
├── frontend/       # React TypeScript frontend with Material-UI
│   ├── src/        # Source code
│   │   ├── pages/  # React components for each page
│   │   └── config.ts # Environment configuration
│   └── public/     # Static assets
├── backend/        # Python Flask backend
│   ├── app.py      # Main Flask application
│   ├── analyzer.py # CV analysis using LangChain and OpenAI
│   ├── extractors.py # Text extraction from PDF/DOCX/TXT
│   └── requirements.txt # Python dependencies
└── data/           # Storage for CVs, results, and criteria
```

## How the App Works

1. **Frontend (React/TypeScript)**
   - Single-page application with three main views:
     - **Upload Page**: Users upload CV files (PDF, DOCX, TXT)
     - **Criteria Page**: Users define and save evaluation criteria
     - **Results Page**: Displays analysis results with pass/fail determination
   - Uses Material-UI for responsive design
   - Communicates with backend via REST API

2. **Backend (Python/Flask)**
   - RESTful API endpoints:
     - `/api/upload`: Receives and processes CV files
     - `/api/criteria`: Manages evaluation criteria
     - `/api/results/:id`: Retrieves analysis results
   - Text extraction from various file formats
   - Integration with OpenAI via LangChain for CV analysis
   - Stores results as JSON files

3. **AI Analysis**
   - Uses OpenAI's GPT-3.5-turbo model via LangChain
   - Evaluates CV text against defined criteria
   - Provides structured output with:
     - Overall pass/fail determination
     - Confidence score
     - Candidate strengths
     - Areas for improvement
     - Detailed justification

## Deployment Guide

### Prerequisites

- GitHub account
- Render.com account
- OpenAI API key

### Step 1: Set Up GitHub Repository

1. Initialize Git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a GitHub repository at github.com/new

3. Connect local repository to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/cv-analyser.git
   git push -u origin main
   ```

### Step 2: Deploy Backend to Render.com

1. Prepare backend for deployment:
   - Add `Procfile` to backend directory:
     ```
     web: cd backend && gunicorn app:app
     ```
   - Add `gunicorn` to requirements.txt
   - Add `runtime.txt` with Python version:
     ```
     python-3.9.18
     ```

2. Deploy on Render.com:
   - Sign in to Render.com
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: cv-analyser
     - **Environment**: Python
     - **Build Command**: `pip install -r backend/requirements.txt`
     - **Start Command**: `cd backend && gunicorn app:app`
   - Add environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `FLASK_ENV`: production
   - Click "Create Web Service"

3. Note your backend URL (e.g., https://cv-analyser-f1yn.onrender.com)

### Step 3: Configure Frontend for GitHub Pages

1. Install GitHub Pages package:
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. Update `package.json`:
   - Add homepage field:
     ```json
     "homepage": "https://yourusername.github.io/cv-analyser",
     ```
   - Add deploy scripts:
     ```json
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build",
       // other scripts...
     }
     ```

3. Create `config.ts` for environment configuration:
   ```typescript
   // Configuration for different environments
   const config = {
     development: {
       apiUrl: 'http://localhost:5001'
     },
     production: {
       apiUrl: 'https://cv-analyser-f1yn.onrender.com'
     }
   };

   const env = process.env.NODE_ENV || 'development';
   export default config[env as keyof typeof config];
   ```

4. Update API calls in components to use the config:
   ```typescript
   import config from '../config';
   // Replace http://localhost:5001 with ${config.apiUrl}
   ```

### Step 4: Deploy Frontend to GitHub Pages

1. Commit and push all changes:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. Deploy to GitHub Pages:
   ```bash
   cd frontend
   npm run deploy
   ```

3. Configure GitHub Pages:
   - Go to your GitHub repository
   - Navigate to Settings > Pages
   - Ensure source is set to "gh-pages" branch

4. Access your deployed application at:
   ```
   https://yourusername.github.io/cv-analyser
   ```

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   FLASK_ENV=development
   ```

5. Start the backend server:
   ```bash
   python app.py
   ```
   The server will run on port 5001 (http://localhost:5001)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Technologies Used

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Python, Flask, Flask-CORS
- **AI/ML**: OpenAI API (GPT-3.5-turbo), LangChain
- **Document Processing**: pdfminer.six, docx2txt
- **Deployment**: GitHub Pages (frontend), Render.com (backend)

## License

MIT
