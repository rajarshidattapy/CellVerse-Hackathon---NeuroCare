import numpy as np
import pickle
import os
from datetime import datetime
import uuid

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models')

def load_models():
    """Load all trained models"""
    try:
        with open(os.path.join(MODEL_PATH, 'stroke_predictor.pkl'), 'rb') as f:
            stroke_model = pickle.load(f)
        with open(os.path.join(MODEL_PATH, 'heart_predictor.pkl'), 'rb') as f:
            heart_model = pickle.load(f)
        with open(os.path.join(MODEL_PATH, 'anomaly_detector.pkl'), 'rb') as f:
            anomaly_model = pickle.load(f)
        with open(os.path.join(MODEL_PATH, 'scaler.pkl'), 'rb') as f:
            scaler = pickle.load(f)
        return stroke_model, heart_model, anomaly_model, scaler
    except Exception as e:
        print(f"Error loading models: {e}")
        return None, None, None, None

def detect_anomalies(ecg_data, eeg_data):
    """Detect anomalies and predict stroke/heart attack risks"""
    stroke_model, heart_model, anomaly_model, scaler = load_models()
    anomalies = []
    
    if not all([stroke_model, heart_model, anomaly_model, scaler]):
        print("No models found, falling back to threshold-based detection")
        return detect_anomalies_threshold(ecg_data, eeg_data)
    
    # Prepare data for models
    features = []
    timestamps = []
    
    for i in range(min(len(ecg_data), len(eeg_data))):
        features.append([
            ecg_data[i]['value'],
            eeg_data[i]['alpha'],
            eeg_data[i]['beta'],
            eeg_data[i]['theta'],
            eeg_data[i]['delta']
        ])
        timestamps.append(ecg_data[i]['timestamp'])
    
    # Scale features
    features_scaled = scaler.transform(features)
    
    # Make predictions
    anomaly_preds = anomaly_model.predict(features_scaled)
    stroke_probs = stroke_model.predict_proba(features_scaled)[:, 1]
    heart_probs = heart_model.predict_proba(features_scaled)[:, 1]
    
    # Process predictions
    for i, (anomaly_pred, stroke_prob, heart_prob) in enumerate(zip(anomaly_preds, stroke_probs, heart_probs)):
        risks = []
        
        # Check for stroke risk
        if stroke_prob > 0.7:  # High risk
            risks.append({
                'type': 'Stroke',
                'probability': stroke_prob,
                'severity': 'high',
                'indicators': analyze_stroke_indicators(features[i])
            })
        elif stroke_prob > 0.4:  # Medium risk
            risks.append({
                'type': 'Stroke',
                'probability': stroke_prob,
                'severity': 'medium',
                'indicators': analyze_stroke_indicators(features[i])
            })
        
        # Check for heart attack risk
        if heart_prob > 0.7:  # High risk
            risks.append({
                'type': 'Heart Attack',
                'probability': heart_prob,
                'severity': 'high',
                'indicators': analyze_heart_indicators(features[i])
            })
        elif heart_prob > 0.4:  # Medium risk
            risks.append({
                'type': 'Heart Attack',
                'probability': heart_prob,
                'severity': 'medium',
                'indicators': analyze_heart_indicators(features[i])
            })
        
        # If any risks detected or general anomaly detected
        if risks or anomaly_pred == -1:
            anomaly = {
                'id': str(uuid.uuid4()),
                'timestamp': datetime.fromtimestamp(timestamps[i] / 1000).isoformat(),
                'type': 'Combined' if len(risks) > 1 else (risks[0]['type'] if risks else 'General'),
                'severity': max([risk['severity'] for risk in risks], key=lambda x: {'low': 0, 'medium': 1, 'high': 2}[x]) if risks else 'low',
                'description': generate_risk_description(risks) if risks else 'Unusual signal pattern detected',
                'details': generate_risk_details(risks, features[i]) if risks else 'General anomaly in signal patterns detected',
                'risks': risks,
                'status': 'active'
            }
            anomalies.append(anomaly)
    
    return anomalies

def analyze_stroke_indicators(feature_vector):
    """Analyze specific indicators for stroke risk"""
    ecg_value, alpha, beta, theta, delta = feature_vector
    
    indicators = []
    
    # Check for specific EEG patterns
    if alpha < 0.3:  # Reduced alpha activity
        indicators.append('Reduced alpha wave activity')
    if delta > 1.5:  # Increased delta activity
        indicators.append('Elevated delta wave activity')
    if beta > 1.2:  # Increased beta activity
        indicators.append('Elevated beta wave activity')
    
    # Check for ECG patterns
    if abs(ecg_value) > 2.0:
        indicators.append('Significant ECG amplitude variation')
    
    return indicators

def analyze_heart_indicators(feature_vector):
    """Analyze specific indicators for heart attack risk"""
    ecg_value, alpha, beta, theta, delta = feature_vector
    
    indicators = []
    
    # Check for specific ECG patterns
    if ecg_value < -0.5:  # T wave inversion
        indicators.append('T wave inversion')
    if abs(ecg_value) > 1.8:  # ST segment deviation
        indicators.append('ST segment deviation')
    if abs(ecg_value) < 0.2:  # Low voltage
        indicators.append('Low QRS voltage')
    
    # Check for stress indicators in EEG
    if beta > 1.0:
        indicators.append('Elevated stress levels (high beta activity)')
    
    return indicators

def generate_risk_description(risks):
    """Generate a human-readable description of detected risks"""
    if not risks:
        return "No specific risks detected"
    
    descriptions = []
    for risk in risks:
        prob_percent = int(risk['probability'] * 100)
        if risk['severity'] == 'high':
            descriptions.append(f"High risk of {risk['type']} detected ({prob_percent}% probability)")
        else:
            descriptions.append(f"Moderate risk of {risk['type']} detected ({prob_percent}% probability)")
    
    return '. '.join(descriptions)

def generate_risk_details(risks, feature_vector):
    """Generate detailed analysis of detected risks"""
    if not risks:
        return "No specific risk details available"
    
    details = []
    for risk in risks:
        indicators = risk['indicators']
        if indicators:
            details.append(f"{risk['type']} risk indicators:")
            details.extend([f"- {indicator}" for indicator in indicators])
    
    return '\n'.join(details)

def detect_anomalies_threshold(ecg_data, eeg_data):
    """Fallback threshold-based anomaly detection"""
    anomalies = []
    
    # Process data in windows
    window_size = 10
    for i in range(0, len(ecg_data) - window_size, window_size):
        ecg_window = ecg_data[i:i+window_size]
        eeg_window = eeg_data[i:i+window_size]
        
        # Analyze ECG patterns
        ecg_values = [point['value'] for point in ecg_window]
        ecg_mean = np.mean(ecg_values)
        ecg_std = np.std(ecg_values)
        
        # Analyze EEG patterns
        eeg_features = ['alpha', 'beta', 'theta', 'delta']
        eeg_anomalies = []
        
        for feature in eeg_features:
            values = [point[feature] for point in eeg_window]
            mean = np.mean(values)
            std = np.std(values)
            
            if any(abs(v - mean) > 2.5 * std for v in values):
                eeg_anomalies.append(feature)
        
        # Check for stroke risk patterns
        stroke_risk = (
            len(eeg_anomalies) >= 2 and
            'alpha' in eeg_anomalies and
            'delta' in eeg_anomalies
        )
        
        # Check for heart attack risk patterns
        heart_risk = (
            any(abs(v - ecg_mean) > 2.5 * ecg_std for v in ecg_values) and
            any(v < 0 for v in ecg_values)  # T wave inversion
        )
        
        if stroke_risk or heart_risk:
            risks = []
            
            if stroke_risk:
                risks.append({
                    'type': 'Stroke',
                    'probability': 0.6,
                    'severity': 'medium',
                    'indicators': [
                        'Irregular EEG patterns',
                        'Reduced alpha activity',
                        'Elevated delta activity'
                    ]
                })
            
            if heart_risk:
                risks.append({
                    'type': 'Heart Attack',
                    'probability': 0.6,
                    'severity': 'medium',
                    'indicators': [
                        'ECG irregularities',
                        'T wave abnormalities',
                        'Rhythm disturbances'
                    ]
                })
            
            anomaly = {
                'id': str(uuid.uuid4()),
                'timestamp': datetime.fromtimestamp(ecg_window[0]['timestamp'] / 1000).isoformat(),
                'type': 'Combined' if stroke_risk and heart_risk else ('Stroke' if stroke_risk else 'Heart Attack'),
                'severity': 'high' if len(risks) > 1 else 'medium',
                'description': generate_risk_description(risks),
                'details': generate_risk_details(risks, [ecg_mean] + [np.mean([point[f] for point in eeg_window]) for f in eeg_features]),
                'risks': risks,
                'status': 'active'
            }
            
            anomalies.append(anomaly)
    
    return anomalies