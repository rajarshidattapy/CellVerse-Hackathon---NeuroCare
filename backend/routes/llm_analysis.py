from flask import Blueprint, jsonify, request
import os
from services.llm_service import LLMService

llm_analysis_bp = Blueprint('llm_analysis', __name__)

# Initialize LLM service
llm_service = LLMService()

@llm_analysis_bp.route('/llm/recommendations', methods=['POST'])
def get_health_recommendations():
    """
    Get health recommendations based on health data
    Request body:
    {
        "ecgData": [...],
        "eegData": [...],
        "anomalies": [...],
        "userProfile": {
            "age": number,
            "gender": string,
            "medicalConditions": string[],
            "medications": string[]
        }
    }
    """
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        # Get recommendations from LLM
        recommendations = llm_service.generate_health_recommendations(data)
        
        return jsonify({
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@llm_analysis_bp.route('/llm/analysis/<anomaly_id>', methods=['GET'])
def get_anomaly_analysis(anomaly_id):
    """
    Get detailed analysis of a specific anomaly
    Path parameters:
    - anomaly_id: ID of the anomaly to analyze
    """
    # In a real application, this would fetch the anomaly from a database
    # For now, we'll generate a mock anomaly
    from utils.signal_processing import generate_mock_anomaly
    
    anomaly = generate_mock_anomaly(anomaly_id)
    
    if not anomaly:
        return jsonify({'error': 'Anomaly not found'}), 404
    
    try:
        # Get analysis from LLM
        analysis = llm_service.analyze_anomaly(anomaly)
        
        return jsonify({
            'anomaly': anomaly,
            'analysis': analysis
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@llm_analysis_bp.route('/llm/config', methods=['POST'])
def set_llm_config():
    """
    Set LLM API key and configuration
    Request body:
    {
        "apiKey": string,
        "model": string (optional)
    }
    """
    data = request.json
    
    if not data or 'apiKey' not in data:
        return jsonify({'error': 'API key is required'}), 400
    
    try:
        # Set API key
        llm_service.set_api_key(data['apiKey'])
        
        # Set model if provided
        if 'model' in data:
            llm_service.set_model(data['model'])
        
        return jsonify({
            'status': 'success',
            'message': 'LLM configuration updated'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500