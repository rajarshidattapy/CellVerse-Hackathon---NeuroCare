import unittest
import numpy as np
from models.train_model import generate_training_data
from services.anomaly_detection import detect_anomalies, load_models

class TestRiskDetection(unittest.TestCase):
    def setUp(self):
        # Load models
        self.stroke_model, self.heart_model, self.anomaly_model, self.scaler = load_models()
        
        # Generate test data
        self.X, self.y_stroke, self.y_heart = generate_training_data(n_samples=1000)
    
    def test_stroke_early_detection(self):
        """Test early detection of stroke risk patterns"""
        # Create data with known stroke risk patterns
        test_data = []
        eeg_data = []
        
        # Simulate 10 minutes of data with increasing stroke risk patterns
        for i in range(600):  # 10 minutes * 60 seconds
            timestamp = 1000 * i  # milliseconds
            
            # Normal pattern for first 5 minutes
            if i < 300:
                ecg_value = np.sin(i * 0.1) * 0.5
                alpha = 0.5  # Normal alpha
                beta = 0.3   # Normal beta
                theta = 0.4  # Normal theta
                delta = 0.2  # Normal delta
            
            # Gradual deterioration in next 5 minutes
            else:
                progress = (i - 300) / 300  # 0 to 1 over 5 minutes
                ecg_value = np.sin(i * 0.1) * (0.5 + progress * 0.3)
                alpha = 0.5 * (1 - progress * 0.6)  # Decreasing alpha
                beta = 0.3 * (1 + progress * 0.5)   # Increasing beta
                theta = 0.4 * (1 + progress * 0.3)  # Slight increase
                delta = 0.2 * (1 + progress * 2.0)  # Significant delta increase
            
            test_data.append({
                'timestamp': timestamp,
                'value': ecg_value
            })
            
            eeg_data.append({
                'timestamp': timestamp,
                'alpha': alpha,
                'beta': beta,
                'theta': theta,
                'delta': delta
            })
        
        # Detect anomalies
        anomalies = detect_anomalies(test_data, eeg_data)
        
        # Verify early detection
        stroke_risks = [a for a in anomalies if any(r['type'] == 'Stroke' for r in a['risks'])]
        
        self.assertTrue(len(stroke_risks) > 0, "Should detect stroke risks")
        
        # Verify timing of first detection
        if stroke_risks:
            first_detection = min(int(a['timestamp'].split('T')[1].split(':')[1]) for a in stroke_risks)
            self.assertTrue(first_detection <= 7, "Should detect stroke risk within 7 minutes")
            
        # Verify risk progression
        if len(stroke_risks) >= 2:
            first_risk = next(r['probability'] for r in stroke_risks[0]['risks'] if r['type'] == 'Stroke')
            last_risk = next(r['probability'] for r in stroke_risks[-1]['risks'] if r['type'] == 'Stroke')
            self.assertTrue(last_risk > first_risk, "Risk probability should increase over time")
    
    def test_heart_attack_early_detection(self):
        """Test early detection of heart attack risk patterns"""
        test_data = []
        eeg_data = []
        
        # Simulate 10 minutes of data with increasing heart attack risk patterns
        for i in range(600):  # 10 minutes * 60 seconds
            timestamp = 1000 * i  # milliseconds
            
            # Normal pattern for first 5 minutes
            if i < 300:
                # Normal ECG pattern with QRS complex
                t = i * 0.1
                ecg_value = np.sin(t) * 0.5
                if i % 10 == 0:
                    ecg_value += 1.0  # Normal R wave
            
            # Gradual deterioration in next 5 minutes
            else:
                progress = (i - 300) / 300  # 0 to 1 over 5 minutes
                t = i * 0.1
                
                # Simulate ST elevation and T wave changes
                ecg_value = np.sin(t) * 0.5
                if i % 10 == 0:
                    ecg_value += 1.0 * (1 - progress * 0.3)  # Decreasing R wave amplitude
                ecg_value += progress * 0.3  # ST elevation
                
                # Add T wave inversion
                if (i % 10) >= 7:
                    ecg_value *= -0.5 * progress
            
            test_data.append({
                'timestamp': timestamp,
                'value': ecg_value
            })
            
            # Add corresponding EEG data (stress indicators)
            eeg_data.append({
                'timestamp': timestamp,
                'alpha': 0.5 * (1 - progress * 0.3),  # Decreasing alpha (increased stress)
                'beta': 0.3 * (1 + progress * 0.5),   # Increasing beta
                'theta': 0.4,
                'delta': 0.2
            })
        
        # Detect anomalies
        anomalies = detect_anomalies(test_data, eeg_data)
        
        # Verify early detection
        heart_risks = [a for a in anomalies if any(r['type'] == 'Heart Attack' for r in a['risks'])]
        
        self.assertTrue(len(heart_risks) > 0, "Should detect heart attack risks")
        
        # Verify timing of first detection
        if heart_risks:
            first_detection = min(int(a['timestamp'].split('T')[1].split(':')[1]) for a in heart_risks)
            self.assertTrue(first_detection <= 7, "Should detect heart attack risk within 7 minutes")
            
        # Verify risk progression
        if len(heart_risks) >= 2:
            first_risk = next(r['probability'] for r in heart_risks[0]['risks'] if r['type'] == 'Heart Attack')
            last_risk = next(r['probability'] for r in heart_risks[-1]['risks'] if r['type'] == 'Heart Attack')
            self.assertTrue(last_risk > first_risk, "Risk probability should increase over time")
    
    def test_combined_risk_detection(self):
        """Test detection of combined stroke and heart attack risks"""
        test_data = []
        eeg_data = []
        
        # Simulate 10 minutes of data with both stroke and heart attack patterns
        for i in range(600):
            timestamp = 1000 * i
            
            # Normal pattern for first 3 minutes
            if i < 180:
                ecg_value = np.sin(i * 0.1) * 0.5
                alpha = 0.5
                beta = 0.3
                theta = 0.4
                delta = 0.2
            
            # Deterioration in next 7 minutes
            else:
                progress = (i - 180) / 420  # 0 to 1 over 7 minutes
                
                # ECG changes (heart attack patterns)
                t = i * 0.1
                ecg_value = np.sin(t) * 0.5
                if i % 10 == 0:
                    ecg_value += 1.0 * (1 - progress * 0.3)
                ecg_value += progress * 0.3
                if (i % 10) >= 7:
                    ecg_value *= -0.5 * progress
                
                # EEG changes (stroke patterns)
                alpha = 0.5 * (1 - progress * 0.6)
                beta = 0.3 * (1 + progress * 0.5)
                theta = 0.4 * (1 + progress * 0.3)
                delta = 0.2 * (1 + progress * 2.0)
            
            test_data.append({
                'timestamp': timestamp,
                'value': ecg_value
            })
            
            eeg_data.append({
                'timestamp': timestamp,
                'alpha': alpha,
                'beta': beta,
                'theta': theta,
                'delta': delta
            })
        
        # Detect anomalies
        anomalies = detect_anomalies(test_data, eeg_data)
        
        # Verify detection of combined risks
        combined_risks = [a for a in anomalies if len(a['risks']) > 1]
        
        self.assertTrue(len(combined_risks) > 0, "Should detect combined risks")
        
        if combined_risks:
            # Verify that both risk types are present
            risk_types = set()
            for anomaly in combined_risks:
                risk_types.update(r['type'] for r in anomaly['risks'])
            
            self.assertTrue('Stroke' in risk_types, "Should detect stroke risk")
            self.assertTrue('Heart Attack' in risk_types, "Should detect heart attack risk")
            
            # Verify early detection
            first_detection = min(int(a['timestamp'].split('T')[1].split(':')[1]) for a in combined_risks)
            self.assertTrue(first_detection <= 5, "Should detect combined risks within 5 minutes")

if __name__ == '__main__':
    unittest.main()