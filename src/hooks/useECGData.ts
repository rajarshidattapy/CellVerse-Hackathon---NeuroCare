import { useState, useEffect } from 'react';

interface ECGDataPoint {
  timestamp: number;
  value: number;
  isAnomaly: boolean;
}

export const useECGData = () => {
  const [ecgData, setEcgData] = useState<ECGDataPoint[]>([]);
  const [ecgLoading, setEcgLoading] = useState<boolean>(true);
  const [ecgError, setEcgError] = useState<string | null>(null);

  useEffect(() => {
    const generateECGData = () => {
      const data: ECGDataPoint[] = [];
      const now = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const timestamp = now - (99 - i) * 1000;
        
        // Base ECG pattern (simplified QRS complex)
        const t = i / 10;
        let value = Math.sin(t * Math.PI * 2) * 0.5; // Basic sine wave
        
        // Add QRS complex
        if (i % 10 === 0) {
          value += 1.5; // R wave
        } else if (i % 10 === 1 || i % 10 === 9) {
          value -= 0.5; // Q and S waves
        }
        
        // Add noise
        value += (Math.random() - 0.5) * 0.1;
        
        // Introduce anomalies with 5% probability
        const isAnomaly = Math.random() < 0.05;
        if (isAnomaly) {
          const anomalyTypes = [
            () => value * 2.5, // Amplified R wave (ventricular hypertrophy)
            () => value * 0.3, // Reduced QRS amplitude
            () => value + Math.sin(t * 5) * 0.8, // Fibrillation pattern
            () => -value, // Inverted QRS complex
            () => value + (Math.random() - 0.5), // Random noise (interference)
          ];
          
          const anomalyFunc = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
          value = anomalyFunc();
        }
        
        data.push({ timestamp, value, isAnomaly });
      }
      
      return data;
    };

    // Initial data
    setEcgData(generateECGData());
    setEcgLoading(false);

    // Update data every second
    const interval = setInterval(() => {
      setEcgData(prevData => {
        const newData = [...prevData.slice(1)];
        const lastTimestamp = prevData[prevData.length - 1].timestamp;
        
        // Generate new data point
        const t = Date.now() / 1000;
        let value = Math.sin(t * Math.PI * 2) * 0.5;
        
        // Add QRS complex
        if (newData.length % 10 === 0) {
          value += 1.5;
        } else if (newData.length % 10 === 1 || newData.length % 10 === 9) {
          value -= 0.5;
        }
        
        // Add noise
        value += (Math.random() - 0.5) * 0.1;
        
        // Introduce anomaly with 5% probability
        const isAnomaly = Math.random() < 0.05;
        if (isAnomaly) {
          value = value * (Math.random() < 0.5 ? 2.5 : 0.3);
        }
        
        newData.push({
          timestamp: lastTimestamp + 1000,
          value,
          isAnomaly
        });
        
        return newData;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { ecgData, ecgLoading, ecgError };
};