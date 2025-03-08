import os
import json
from google.generativeai import GenerativeModel, configure
from typing import Dict, Any, List, Optional

class LLMService:
    """
    Service for interacting with LLM APIs for health data analysis
    """
    
    def __init__(self):
        # Configure Gemini API
        self.api_key = 'AIzaSyAR5VNhCHL2nKQ72Q7VXsCA_GblLhcpGeI'
        configure(api_key=self.api_key)
        self.model = GenerativeModel('gemini-pro')
    
    def set_api_key(self, api_key: str) -> None:
        """
        Set the API key for the LLM service
        
        Args:
            api_key (str): The API key to use
        """
        self.api_key = api_key
        configure(api_key=api_key)
    
    def set_model(self, model: str) -> None:
        """
        Set the model to use for the LLM service
        
        Args:
            model (str): The model to use
        """
        self.model = GenerativeModel(model)
    
    async def generate_health_recommendations(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate health recommendations based on health data
        
        Args:
            data (Dict[str, Any]): The health data to analyze
        
        Returns:
            Dict[str, Any]: The generated recommendations
        """
        try:
            # Extract relevant data
            ecg_data = data.get('ecgData', [])
            eeg_data = data.get('eegData', [])
            anomalies = data.get('anomalies', [])
            user_profile = data.get('userProfile', {})
            
            # Create prompt for analysis
            prompt = self._create_health_recommendations_prompt(ecg_data, eeg_data, anomalies, user_profile)
            
            # Generate response
            response = await self.model.generate_content(prompt)
            text = response.text
            
            # Parse sections
            sections = text.split('\n\n')
            
            return {
                'analysis': self._extract_section(sections, 'Analysis'),
                'recommendations': [
                    {
                        'category': 'Cardiac',
                        'title': 'Heart Health Recommendations',
                        'description': self._extract_section(sections, 'Cardiac Recommendations'),
                        'actions': self._extract_list(sections, 'Cardiac Actions'),
                        'urgency': self._determine_urgency(anomalies, 'ECG')
                    },
                    {
                        'category': 'Neurological',
                        'title': 'Brain Health Recommendations',
                        'description': self._extract_section(sections, 'Neurological Recommendations'),
                        'actions': self._extract_list(sections, 'Neurological Actions'),
                        'urgency': self._determine_urgency(anomalies, 'EEG')
                    }
                ],
                'warningSigns': self._extract_list(sections, 'Warning Signs')
            }
        except Exception as e:
            print(f"Error generating health recommendations: {e}")
            return self._get_mock_recommendations(anomalies)
    
    async def analyze_anomaly(self, anomaly: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze a specific anomaly and provide detailed information
        
        Args:
            anomaly (Dict[str, Any]): The anomaly to analyze
        
        Returns:
            Dict[str, Any]: The analysis of the anomaly
        """
        try:
            # Create prompt for analysis
            prompt = self._create_anomaly_analysis_prompt(anomaly)
            
            # Generate response
            response = await self.model.generate_content(prompt)
            text = response.text
            
            # Parse sections
            sections = text.split('\n\n')
            
            return {
                'explanation': self._extract_section(sections, 'Explanation'),
                'possibleCauses': self._extract_list(sections, 'Possible Causes'),
                'riskFactors': self._extract_list(sections, 'Risk Factors'),
                'recommendations': self._extract_list(sections, 'Recommendations'),
                'medicalAttention': self._extract_section(sections, 'Medical Attention')
            }
        except Exception as e:
            print(f"Error analyzing anomaly: {e}")
            return self._get_mock_anomaly_analysis(anomaly)
    
    def _create_health_recommendations_prompt(
        self, 
        ecg_data: List[Dict[str, Any]], 
        eeg_data: List[Dict[str, Any]], 
        anomalies: List[Dict[str, Any]], 
        user_profile: Dict[str, Any]
    ) -> str:
        """Create a detailed prompt for health recommendations"""
        return f"""As a medical AI assistant specializing in cardiology and neurology, analyze this health data and provide recommendations:

Patient Profile:
Age: {user_profile.get('age', 'Unknown')}
Gender: {user_profile.get('gender', 'Unknown')}
Medical Conditions: {', '.join(user_profile.get('medicalConditions', ['None reported']))}
Medications: {', '.join(user_profile.get('medications', ['None reported']))}

Anomalies Detected:
ECG Anomalies: {len([a for a in anomalies if a['type'] == 'ECG'])}
EEG Anomalies: {len([a for a in anomalies if a['type'] == 'EEG'])}

Please provide a comprehensive analysis with the following sections:

1. Analysis
2. Cardiac Recommendations
3. Cardiac Actions
4. Neurological Recommendations
5. Neurological Actions
6. Warning Signs
7. Medical Attention Criteria

Focus on actionable recommendations and clear warning signs."""
    
    def _create_anomaly_analysis_prompt(self, anomaly: Dict[str, Any]) -> str:
        """Create a detailed prompt for anomaly analysis"""
        return f"""Analyze the following health anomaly in detail:

Type: {anomaly.get('type')}
Description: {anomaly.get('description')}
Severity: {anomaly.get('severity')}
Details: {anomaly.get('details', 'No additional details provided')}

Please provide a detailed analysis with the following sections:

1. Explanation
2. Possible Causes
3. Risk Factors
4. Recommendations
5. Medical Attention Criteria

Focus on clear, actionable insights and specific warning signs."""
    
    def _extract_section(self, sections: List[str], section_name: str) -> str:
        """Extract a specific section from the response"""
        for section in sections:
            if section.lower().startswith(section_name.lower()):
                return section.split(':', 1)[1].strip()
        return ''
    
    def _extract_list(self, sections: List[str], section_name: str) -> List[str]:
        """Extract a list from a specific section"""
        section = self._extract_section(sections, section_name)
        if not section:
            return []
        return [item.strip('- ') for item in section.split('\n') if item.strip()]
    
    def _determine_urgency(self, anomalies: List[Dict[str, Any]], anomaly_type: str) -> str:
        """Determine the urgency level based on anomalies"""
        relevant_anomalies = [a for a in anomalies if a['type'] == anomaly_type]
        if any(a['severity'] == 'high' for a in relevant_anomalies):
            return 'high'
        if any(a['severity'] == 'medium' for a in relevant_anomalies):
            return 'medium'
        return 'low'
    
    def _get_mock_recommendations(self, anomalies: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate mock recommendations when API fails"""
        return {
            'analysis': 'Based on the detected anomalies, several patterns require attention.',
            'recommendations': [
                {
                    'category': 'Cardiac',
                    'title': 'Monitor Heart Health',
                    'description': 'Your heart rhythm shows some variations that should be monitored.',
                    'actions': [
                        'Track your heart rate during different activities',
                        'Practice deep breathing exercises',
                        'Maintain regular physical activity',
                        'Stay hydrated'
                    ],
                    'urgency': self._determine_urgency(anomalies, 'ECG')
                },
                {
                    'category': 'Neurological',
                    'title': 'Brain Health Management',
                    'description': 'Your brain wave patterns suggest opportunities for improved cognitive health.',
                    'actions': [
                        'Establish a consistent sleep schedule',
                        'Practice mindfulness meditation',
                        'Take regular breaks during focused work',
                        'Ensure adequate mental stimulation'
                    ],
                    'urgency': self._determine_urgency(anomalies, 'EEG')
                }
            ],
            'warningSigns': [
                'Severe chest pain or pressure',
                'Difficulty breathing',
                'Sudden confusion or severe headache',
                'Irregular heartbeat or palpitations',
                'Extreme fatigue or weakness'
            ]
        }
    
    def _get_mock_anomaly_analysis(self, anomaly: Dict[str, Any]) -> Dict[str, Any]:
        """Generate mock anomaly analysis when API fails"""
        is_ecg = anomaly['type'] == 'ECG'
        
        return {
            'explanation': (
                'This anomaly represents an irregular heart rhythm pattern that may indicate early signs of arrhythmia.'
                if is_ecg else
                'This anomaly shows unusual brain wave patterns that could indicate elevated stress levels.'
            ),
            'possibleCauses': [
                'Stress or anxiety',
                'Physical exertion',
                'Dehydration',
                'Sleep deprivation',
                'Medication effects'
            ],
            'riskFactors': [
                'Age over 60',
                'High blood pressure',
                'Obesity',
                'Smoking',
                'Family history of heart disease' if is_ecg else 'Family history of neurological conditions'
            ],
            'recommendations': [
                'Monitor your vital signs regularly',
                'Maintain a healthy lifestyle',
                'Practice stress management techniques',
                'Ensure adequate sleep',
                'Stay hydrated'
            ],
            'medicalAttention': (
                'Seek immediate medical attention if you experience chest pain, shortness of breath, or fainting.'
                if is_ecg else
                'Seek immediate medical attention if you experience severe headache, confusion, or loss of consciousness.'
            )
        }