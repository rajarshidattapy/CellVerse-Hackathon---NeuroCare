import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pickle
import os

def generate_training_data(n_samples=10000):
    # Generate normal ECG patterns
    t = np.linspace(0, 100, n_samples)
    ecg_normal = np.sin(t * 0.2) * 0.5 + np.random.normal(0, 0.1, n_samples)
    
    # Add QRS complexes
    for i in range(0, n_samples, 10):
        if i+1 < n_samples:
            ecg_normal[i] += 1.5  # R wave
            ecg_normal[i+1] -= 0.5  # S wave
    
    # Generate normal EEG patterns
    eeg_alpha = np.sin(t * 0.8) * 0.5 + np.random.normal(0, 0.1, n_samples)
    eeg_beta = np.sin(t * 1.5) * 0.3 + np.random.normal(0, 0.1, n_samples)
    eeg_theta = np.sin(t * 0.4) * 0.4 + np.random.normal(0, 0.1, n_samples)
    eeg_delta = np.sin(t * 0.2) * 0.6 + np.random.normal(0, 0.1, n_samples)
    
    # Generate stroke risk patterns (10% of data)
    n_stroke_risk = n_samples // 10
    stroke_indices = np.random.choice(n_samples, n_stroke_risk, replace=False)
    
    # Generate heart attack risk patterns (10% of data)
    n_heart_risk = n_samples // 10
    heart_indices = np.random.choice(
        [i for i in range(n_samples) if i not in stroke_indices],
        n_heart_risk,
        replace=False
    )
    
    # Create features array
    X = np.column_stack([
        ecg_normal,
        eeg_alpha,
        eeg_beta,
        eeg_theta,
        eeg_delta
    ])
    
    # Create labels
    y_stroke = np.zeros(n_samples)
    y_heart = np.zeros(n_samples)
    
    # Add stroke risk patterns
    for idx in stroke_indices:
        # Simulate stroke risk patterns:
        # - Irregular alpha waves
        # - Increased delta activity
        # - Asymmetric patterns
        X[idx, 1] *= 0.3  # Reduced alpha
        X[idx, 4] *= 2.0  # Increased delta
        if idx % 2 == 0:  # Asymmetric patterns
            X[idx, 1:] *= 1.5
        y_stroke[idx] = 1
    
    # Add heart attack risk patterns
    for idx in heart_indices:
        # Simulate heart attack risk patterns:
        # - ST segment elevation/depression
        # - T wave inversion
        # - QRS complex changes
        X[idx, 0] *= -0.5  # T wave inversion
        if idx % 2 == 0:
            X[idx, 0] += 0.3  # ST elevation
        else:
            X[idx, 0] -= 0.3  # ST depression
        y_heart[idx] = 1
    
    return X, y_stroke, y_heart

def train_prediction_models():
    print("Generating training data...")
    X, y_stroke, y_heart = generate_training_data()
    
    # Split data
    X_train, X_test, y_stroke_train, y_stroke_test, y_heart_train, y_heart_test = train_test_split(
        X, y_stroke, y_heart, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train stroke prediction model
    print("Training stroke prediction model...")
    stroke_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    stroke_model.fit(X_train_scaled, y_stroke_train)
    
    # Train heart attack prediction model
    print("Training heart attack prediction model...")
    heart_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    heart_model.fit(X_train_scaled, y_heart_train)
    
    # Train anomaly detection model
    print("Training anomaly detection model...")
    anomaly_model = IsolationForest(
        n_estimators=100,
        contamination=0.1,
        random_state=42
    )
    anomaly_model.fit(X_train_scaled)
    
    # Save models
    models_dir = os.path.dirname(__file__)
    
    with open(os.path.join(models_dir, 'stroke_predictor.pkl'), 'wb') as f:
        pickle.dump(stroke_model, f)
    
    with open(os.path.join(models_dir, 'heart_predictor.pkl'), 'wb') as f:
        pickle.dump(heart_model, f)
    
    with open(os.path.join(models_dir, 'anomaly_detector.pkl'), 'wb') as f:
        pickle.dump(anomaly_model, f)
    
    with open(os.path.join(models_dir, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    
    # Evaluate models
    stroke_score = stroke_model.score(X_test_scaled, y_stroke_test)
    heart_score = heart_model.score(X_test_scaled, y_heart_test)
    
    print(f"Stroke prediction accuracy: {stroke_score:.2f}")
    print(f"Heart attack prediction accuracy: {heart_score:.2f}")
    
    return stroke_model, heart_model, anomaly_model, scaler

if __name__ == "__main__":
    train_prediction_models()