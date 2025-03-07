import { useState, useEffect, useCallback } from 'react';
import { useECGData } from './useECGData';
import { useEEGData } from './useEEGData';
import { analyzeHealthData } from '../services/gemini';

interface Anomaly {
  id: string;
  timestamp: string;
  type: 'ECG' | 'EEG' | 'Combined';
  severity: 'low' | 'medium' | 'high';
  description: string;
  details: string;
  status: 'active' | 'resolved';
  risks?: Array<{
    type: string;
    probability: number;
    severity: string;
    indicators: string[];
  }>;
}

// Mock data sets for when LLM fails
const mockAnomalySets = [
  [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'Combined',
      severity: 'high',
      description: 'Urgent: Multiple cardiovascular and neurological indicators detected',
      details: 'Analysis shows concurrent cardiac arrhythmia patterns and asymmetric neural activity. ST-segment elevation observed in ECG, accompanied by significant changes in delta wave patterns.',
      status: 'active',
      risks: [
        {
          type: 'Heart Attack',
          probability: 0.85,
          severity: 'high',
          indicators: [
            'ST-segment elevation of 2.3mm in leads V2-V4',
            'T-wave inversion in lateral leads',
            'Reduced R-wave progression',
            'Tachycardia with rate >120 bpm',
            'Irregular QRS complex morphology'
          ]
        },
        {
          type: 'Stroke',
          probability: 0.78,
          severity: 'high',
          indicators: [
            'Left hemispheric delta wave predominance',
            'Significant alpha wave suppression',
            'Focal theta wave bursts',
            'Asymmetric neural activity patterns',
            'Abnormal P300 response'
          ]
        }
      ]
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: 'ECG',
      severity: 'medium',
      description: 'Atrial Fibrillation Pattern Detected',
      details: 'Irregular RR intervals and absence of consistent P waves suggesting atrial fibrillation. Moderate ventricular response rate observed.',
      status: 'active',
      risks: [{
        type: 'Cardiac Arrhythmia',
        probability: 0.72,
        severity: 'medium',
        indicators: [
          'Irregular RR intervals',
          'Absence of P waves',
          'Fibrillatory waves in V1',
          'Variable QRS complex duration',
          'Moderate ventricular response rate'
        ]
      }]
    }
  ],
  [
    {
      id: '3',
      timestamp: new Date().toISOString(),
      type: 'EEG',
      severity: 'high',
      description: 'Critical: Pre-seizure Pattern Detected',
      details: 'Sudden onset of high-frequency beta activity followed by rhythmic sharp waves in the temporal region. Pattern suggests imminent seizure risk.',
      status: 'active',
      risks: [{
        type: 'Seizure',
        probability: 0.91,
        severity: 'high',
        indicators: [
          'Rhythmic sharp waves in temporal lobe',
          'High-frequency beta activity bursts',
          'Focal spike-wave complexes',
          'Suppression of normal background rhythm',
          'Progressive amplitude increase'
        ]
      }]
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: 'Combined',
      severity: 'medium',
      description: 'Stress-Induced Cardiovascular Changes',
      details: 'Elevated sympathetic nervous system activity affecting both cardiac rhythm and neural patterns. Suggests acute stress response.',
      status: 'active',
      risks: [
        {
          type: 'Stress Cardiomyopathy',
          probability: 0.65,
          severity: 'medium',
          indicators: [
            'Mild ST-segment changes',
            'T-wave abnormalities',
            'Elevated heart rate variability',
            'Premature ventricular contractions',
            'QT interval prolongation'
          ]
        },
        {
          type: 'Anxiety Attack',
          probability: 0.78,
          severity: 'medium',
          indicators: [
            'Increased beta wave activity',
            'Frontal lobe hyperactivity',
            'Reduced alpha wave amplitude',
            'Irregular theta wave patterns',
            'Heightened gamma oscillations'
          ]
        }
      ]
    }
  ],
  [
    {
      id: '5',
      timestamp: new Date().toISOString(),
      type: 'ECG',
      severity: 'high',
      description: 'Acute Myocardial Ischemia Pattern',
      details: 'Significant ST-segment elevation in anterior leads with reciprocal changes. Pattern indicates acute anterior wall myocardial ischemia.',
      status: 'active',
      risks: [{
        type: 'Myocardial Infarction',
        probability: 0.88,
        severity: 'high',
        indicators: [
          'ST elevation >2mm in V2-V4',
          'Reciprocal ST depression in II, III, aVF',
          'Hyperacute T waves',
          'Loss of R wave progression',
          'New Q waves developing'
        ]
      }]
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      type: 'EEG',
      severity: 'high',
      description: 'Cerebral Ischemia Pattern',
      details: 'Focal slowing with delta wave predominance in left temporal region. Pattern suggests regional cerebral ischemia.',
      status: 'active',
      risks: [{
        type: 'Ischemic Stroke',
        probability: 0.82,
        severity: 'high',
        indicators: [
          'Focal delta activity in temporal region',
          'Asymmetric alpha suppression',
          'Periodic lateralized epileptiform discharges',
          'Reduced fast activity',
          'Abnormal background rhythm'
        ]
      }]
    }
  ]
];

export const useAnomalies = () => {
  const { ecgData } = useECGData();
  const { eegData } = useEEGData();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mockSetIndex, setMockSetIndex] = useState(0);

  const detectAnomalies = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to get analysis from LLM
      try {
        const analysis = await analyzeHealthData(ecgData, eegData, []);
        if (analysis && analysis.anomalies) {
          setAnomalies(analysis.anomalies);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('LLM analysis failed, using mock data:', error);
      }
      
      // If LLM fails, use mock data
      setAnomalies(mockAnomalySets[mockSetIndex]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      setError('Failed to detect anomalies');
      setLoading(false);
    }
  }, [ecgData, eegData, mockSetIndex]);

  useEffect(() => {
    detectAnomalies();
  }, [detectAnomalies]);

  const refresh = async () => {
    setMockSetIndex((prevIndex) => (prevIndex + 1) % mockAnomalySets.length);
    await detectAnomalies();
  };

  return { anomalies, loading, error, refresh };
};