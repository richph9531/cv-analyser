from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import json
from datetime import datetime
from werkzeug.utils import secure_filename
import extractors
from analyzer import analyze_cv

app = Flask(__name__)
CORS(app, origins=["https://richph9531.github.io", "http://localhost:3000"], supports_credentials=True)

# Configure upload folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'data', 'uploads')
RESULTS_FOLDER = os.path.join(BASE_DIR, 'data', 'results')
CRITERIA_FILE = os.path.join(BASE_DIR, 'data', 'criteria.json')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_cv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Generate unique filename
        file_id = str(uuid.uuid4())
        original_filename = secure_filename(file.filename)
        extension = original_filename.rsplit('.', 1)[1].lower()
        filename = f"{file_id}.{extension}"
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract text from CV
        cv_text = extractors.extract_text(filepath, extension)
        
        # Get criteria from request
        criteria = request.form.get('criteria', '')
        
        # Analyze CV against criteria
        try:
            result = analyze_cv(cv_text, criteria)
        except ValueError as e:
            if "OpenAI API key" in str(e):
                return jsonify({
                    'error': 'OpenAI API key is not properly configured. Please add a valid API key to the .env file.'
                }), 500
            raise
        
        # Save result
        result_data = {
            'id': file_id,
            'original_filename': original_filename,
            'timestamp': datetime.now().isoformat(),
            'result': result
        }
        
        result_path = os.path.join(RESULTS_FOLDER, f"{file_id}.json")
        with open(result_path, 'w') as f:
            json.dump(result_data, f)
        
        return jsonify({
            'id': file_id,
            'filename': original_filename,
            'result': result
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/results/<result_id>', methods=['GET'])
def get_result(result_id):
    result_path = os.path.join(RESULTS_FOLDER, f"{result_id}.json")
    
    if not os.path.exists(result_path):
        return jsonify({'error': 'Result not found'}), 404
    
    with open(result_path, 'r') as f:
        result_data = json.load(f)
    
    return jsonify(result_data)

@app.route('/api/criteria', methods=['POST'])
def save_criteria():
    # This endpoint has been disabled to prevent frontend modification of criteria
    return jsonify({
        'error': 'This feature has been disabled. Criteria can only be modified by administrators.'
    }), 403

@app.route('/api/criteria', methods=['GET'])
def get_criteria():
    try:
        # Check if criteria file exists, if not create it with default criteria
        if not os.path.exists(CRITERIA_FILE):
            # Create the directory if it doesn't exist
            os.makedirs(os.path.dirname(CRITERIA_FILE), exist_ok=True)
            
            # Default QA Engineer criteria from memory
            default_criteria = """QUALITY FOCUSED: Shift left mentality, risk mitigation, testability across SDLC, test methodology knowledge
TESTING KNOWLEDGE: Wide range of testing skills, non-functional testing concerns, requirements definition
COLLABORATIVE: Team-focused, sees testing as team activity, knowledge sharing, mediation
TEST ARCHITECTURE: Tool selection, architecture discussions, CI/CD appreciation, pipeline design
DEVELOPMENT SKILLS: Multiple languages, clean code, production/test code contributions, debugging
ADAPTABLE: Pragmatic, self-organizing, not a quality gateway, independent work
CLIENT FOCUSED: Empathy, value delivery, holistic awareness, diplomacy
ANALYTICAL: Inquisitive, detail-oriented, well-organized, continuous learning
COMMUNITY: Knowledge sharing, seeking advice, coaching/mentoring"""
            
            with open(CRITERIA_FILE, 'w') as f:
                json.dump({'criteria': default_criteria}, f)
        
        # Now read the file (either existing or newly created)
        with open(CRITERIA_FILE, 'r') as f:
            data = json.load(f)
            return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend server is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
