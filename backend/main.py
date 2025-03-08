from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from routes.health_data import health_data_bp
from routes.llm_analysis import llm_analysis_bp
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure CORS to allow requests from the frontend
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            os.environ.get('FRONTEND_URL', 'http://localhost:5173')
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Register blueprints
app.register_blueprint(health_data_bp, url_prefix='/api')
app.register_blueprint(llm_analysis_bp, url_prefix='/api')

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'operational',
        'version': '1.0.0',
        'environment': os.environ.get('FLASK_ENV', 'development')
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)