"""
Voice Stress Detection AI Microservice
Detects panic, stress, and distress in voice:
- Keyword-based detection (help, stop, save me, etc.)
- Stress indicators analysis
- Multi-language support (English, Hindi, Tamil)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from feature_extraction import extract_audio_features
import logging
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configure file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'm4a'}
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Distress keywords in multiple languages
DISTRESS_KEYWORDS = {
    'english': ['help', 'stop', 'save me', 'rape', 'assaults', 'police', 'emergency', 'danger', 'attack'],
    'hindi': ['madad', 'bach', 'bacha', 'bajao', 'roako', 'police', 'khatra', 'hamla'],
    'tamil': ['sollren', 'nirkanum', 'savlinum', 'police', 'kattruppu', 'okkam']
}

# Stress indicators
STRESS_INDICATORS = {
    'high_pitch': 1.5,      # Stress increases pitch
    'fast_speech': 1.8,     # Speech rate increases
    'irregular_rhythm': 1.6 # Irregular breathing patterns
}

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'voice-distress'}), 200

@app.route('/detect-distress', methods=['POST'])
def detect_distress():
    """
    Detect distress in voice audio.
    
    Request:
    - Multipart form with 'audio' file
    - Optional: 'language' (english, hindi, tamil)
    - Optional: 'transcript' (text of what was said)
    """
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({'error': 'No audio file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        language = request.form.get('language', 'english').lower()
        transcript = request.form.get('transcript', '').lower()
        
        # Extract features from audio
        features = extract_audio_features(filepath)
        
        # Keyword-based detection
        keyword_score = check_distress_keywords(transcript, language)
        
        # Acoustic analysis
        acoustic_score = analyze_stress_indicators(features)
        
        # Combine scores (weighted average)
        distress_score = (keyword_score * 0.6) + (acoustic_score * 0.4)
        distress_score = min(1.0, distress_score)  # Cap at 1.0
        
        # Determine alert level
        if distress_score >= 0.8:
            alert_level = "CRITICAL"
            action = "TRIGGER_SOS_IMMEDIATELY"
        elif distress_score >= 0.6:
            alert_level = "HIGH"
            action = "NOTIFY_EMERGENCY_CONTACTS"
        elif distress_score >= 0.4:
            alert_level = "MEDIUM"
            action = "SEND_CHECK_IN_ALERT"
        else:
            alert_level = "LOW"
            action = "MONITOR"
        
        logger.info(f"Distress detected: {alert_level} (score: {distress_score:.2f})")
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'distress_score': float(distress_score),
            'alert_level': alert_level,
            'action': action,
            'analysis': {
                'keyword_score': float(keyword_score),
                'acoustic_score': float(acoustic_score),
                'language': language,
                'transcript': transcript
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error detecting distress: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/analyze-speech', methods=['POST'])
def analyze_speech():
    """
    Detailed speech analysis for stress patterns.
    """
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract features
        features = extract_audio_features(filepath)
        
        analysis = {
            'pitch_variation': float(features.get('pitch_variation', 0)),
            'speech_rate': float(features.get('speech_rate', 0)),
            'volume_variation': float(features.get('volume_variation', 0)),
            'is_stressed': bool(features.get('is_stressed', False)),
            'confidence': float(features.get('confidence', 0))
        }
        
        os.remove(filepath)
        
        return jsonify({
            'analysis': analysis,
            'timestamp': request.form.get('timestamp')
        }), 200
        
    except Exception as e:
        logger.error(f"Error analyzing speech: {str(e)}")
        return jsonify({'error': str(e)}), 500

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_distress_keywords(transcript, language='english'):
    """Check for distress keywords in transcript"""
    if not transcript:
        return 0.0
    
    keywords = DISTRESS_KEYWORDS.get(language, DISTRESS_KEYWORDS['english'])
    
    keyword_count = 0
    for keyword in keywords:
        if keyword in transcript:
            keyword_count += 1
    
    # Score based on keyword density
    score = min(1.0, keyword_count / max(1, len(keywords)))
    return score

def analyze_stress_indicators(features):
    """Analyze acoustic features for stress indicators"""
    stress_score = 0.0
    
    # Check pitch (higher pitch indicates stress)
    if features.get('pitch_variation', 0) > 1.2:
        stress_score += 0.3
    
    # Check speech rate (faster speech indicates stress)
    if features.get('speech_rate', 0) > 180:  # words per minute
        stress_score += 0.3
    
    # Check volume variation (indicates emotional fluctuation)
    if features.get('volume_variation', 0) > 0.7:
        stress_score += 0.2
    
    # Check irregular rhythm (indicates panic)
    if features.get('is_stressed', False):
        stress_score += 0.2
    
    return min(1.0, stress_score)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
