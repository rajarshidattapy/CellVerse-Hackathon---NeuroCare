import { useState, useEffect } from 'react';

interface EEGDataPoint {
  timestamp: number;
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
  isAnomaly: boolean;
}

export const useEEGData = () => {
  const [eegData, setEegData] = useState<EEGDataPoint[]>([]);
  const [eegLoading, setEegLoading] = useState<boolean>(true);
  const [eegError, setEegError] = useState<string | null>(null);

  useEffect(() => {
    const generateEEGData = () => {
      const data: EEGDataPoint[] = [];
      const now = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const timestamp = now - (99 - i) * 1000;
        const t = i / 10;
        
        // Generate base wave patterns
        let alpha = Math.sin(t * 0.8) * 0.5 + Math.random() * 0.1;
        let beta = Math.sin(t * 1.5) * 0.3 + Math.random() * 0.1;
        let theta = Math.sin(t * 0.4) * 0.4 + Math.random() * 0.1;
        let delta = Math.sin(t * 0.2) * 0.6 + Math.random() * 0.1;
        
        // Introduce anomalies with 5% probability
        const isAnomaly = Math.random() < 0.05;
        if (isAnomaly) {
          const anomalyTypes = [
            () => ({ // High beta (anxiety/stress)
              alpha: alpha * 0.5,
              beta: beta * 2.5,
              theta: theta * 0.7,
              delta: delta * 0.7
            }),
            () => ({ // High delta (deep sleep during wake)
              alpha: alpha * 0.3,
              beta: beta * 0.3,
              theta: theta * 0.5,
              delta: delta * 3
            }),
            () => ({ // Low alpha (poor relaxation)
              alpha: alpha * 0.2,
              beta: beta * 1.5,
              theta: theta * 1.2,
              delta: delta * 1.1
            }),
            () => ({ // Irregular patterns (potential seizure)
              alpha: alpha * (1 + Math.sin(t * 5)),
              beta: beta * (1 + Math.sin(t * 7)),
              theta: theta * (1 + Math.sin(t * 3)),
              delta: delta * (1 + Math.sin(t * 2))
            })
          ];
          
          const anomalyFunc = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
          const anomalyValues = anomalyFunc();
          
          alpha = anomalyValues.alpha;
          beta = anomalyValues.beta;
          theta = anomalyValues.theta;
          delta = anomalyValues.delta;
        }
        
        data.push({
          timestamp,
          alpha,
          beta,
          theta,
          delta,
          isAnomaly
        });
      }
      
      return data;
    };

    // Initial data
    setEegData(generateEEGData());
    setEegLoading(false);

    // Update data every second
    const interval = setInterval(() => {
      setEegData(prevData => {
        const newData = [...prevData.slice(1)];
        const lastTimestamp = prevData[prevData.length - 1].timestamp;
        const t = Date.now() / 1000;
        
        // Generate base waves
        let alpha = Math.sin(t * 0.8) * 0.5 + Math.random() * 0.1;
        let beta = Math.sin(t * 1.5) * 0.3 + Math.random() * 0.1;
        let theta = Math.sin(t * 0.4) * 0.4 + Math.random() * 0.1;
        let delta = Math.sin(t * 0.2) * 0.6 + Math.random() * 0.1;
        
        // Introduce anomaly with 5% probability
        const isAnomaly = Math.random() < 0.05;
        if (isAnomaly) {
          const anomalyFactor = Math.random() < 0.5 ? 2.5 : 0.3;
          const targetWave = Math.floor(Math.random() * 4);
          
          switch (targetWave) {
            case 0:
              alpha *= anomalyFactor;
              break;
            case 1:
              beta *= anomalyFactor;
              break;
            case 2:
              theta *= anomalyFactor;
              break;
            case 3:
              delta *= anomalyFactor;
              break;
          }
        }
        
        newData.push({
          timestamp: lastTimestamp + 1000,
          alpha,
          beta,
          theta,
          delta,
          isAnomaly
        });
        
        return newData;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { eegData, eegLoading, eegError };
};