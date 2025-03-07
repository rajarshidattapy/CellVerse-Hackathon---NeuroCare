/**
 * API client for backend communication
 */

// Base URL for API requests
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Production: relative path
  : 'http://localhost:5000/api'; // Development: full URL

// Generic fetch function with error handling and timeout
const fetchWithErrorHandling = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  } finally {
    clearTimeout(timeoutId);
  }
};

// ECG data endpoints
export const ecgApi = {
  getECGData: async (startTime?: number, endTime?: number) => {
    try {
      const params = new URLSearchParams();
      if (startTime) params.append('startTime', startTime.toString());
      if (endTime) params.append('endTime', endTime.toString());
      
      return await fetchWithErrorHandling(`${API_BASE_URL}/ecg?${params.toString()}`);
    } catch (error) {
      console.error('Failed to fetch ECG data:', error);
      throw error;
    }
  },
  
  getECGAnomalies: async (startTime?: number, endTime?: number) => {
    try {
      const params = new URLSearchParams();
      if (startTime) params.append('startTime', startTime.toString());
      if (endTime) params.append('endTime', endTime.toString());
      
      return await fetchWithErrorHandling(`${API_BASE_URL}/ecg/anomalies?${params.toString()}`);
    } catch (error) {
      console.error('Failed to fetch ECG anomalies:', error);
      throw error;
    }
  }
};

// EEG data endpoints
export const eegApi = {
  getEEGData: async (startTime?: number, endTime?: number) => {
    try {
      const params = new URLSearchParams();
      if (startTime) params.append('startTime', startTime.toString());
      if (endTime) params.append('endTime', endTime.toString());
      
      return await fetchWithErrorHandling(`${API_BASE_URL}/eeg?${params.toString()}`);
    } catch (error) {
      console.error('Failed to fetch EEG data:', error);
      throw error;
    }
  },
  
  getEEGAnomalies: async (startTime?: number, endTime?: number) => {
    try {
      const params = new URLSearchParams();
      if (startTime) params.append('startTime', startTime.toString());
      if (endTime) params.append('endTime', endTime.toString());
      
      return await fetchWithErrorHandling(`${API_BASE_URL}/eeg/anomalies?${params.toString()}`);
    } catch (error) {
      console.error('Failed to fetch EEG anomalies:', error);
      throw error;
    }
  }
};

// Combined anomaly detection endpoints
export const anomalyApi = {
  getAnomalies: async (startTime?: number, endTime?: number) => {
    try {
      const params = new URLSearchParams();
      if (startTime) params.append('startTime', startTime.toString());
      if (endTime) params.append('endTime', endTime.toString());
      
      return await fetchWithErrorHandling(`${API_BASE_URL}/anomalies?${params.toString()}`);
    } catch (error) {
      console.error('Failed to fetch anomalies:', error);
      throw error;
    }
  },
  
  getRecommendations: async (anomalyId: string) => {
    try {
      return await fetchWithErrorHandling(`${API_BASE_URL}/anomalies/${anomalyId}/recommendations`);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  }
};

// Google Fit API endpoints
export const googleFitApi = {
  connect: async () => {
    try {
      return await fetchWithErrorHandling(`${API_BASE_URL}/google-fit/connect`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to connect to Google Fit:', error);
      throw error;
    }
  },
  
  disconnect: async () => {
    try {
      return await fetchWithErrorHandling(`${API_BASE_URL}/google-fit/disconnect`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to disconnect from Google Fit:', error);
      throw error;
    }
  },
  
  sync: async () => {
    try {
      return await fetchWithErrorHandling(`${API_BASE_URL}/google-fit/sync`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to sync Google Fit data:', error);
      throw error;
    }
  },
  
  getStatus: async () => {
    try {
      return await fetchWithErrorHandling(`${API_BASE_URL}/google-fit/status`);
    } catch (error) {
      console.error('Failed to get Google Fit status:', error);
      throw error;
    }
  }
};

// LLM API endpoints
export const llmApi = {
  getHealthRecommendations: async (data: any) => {
    try {
      return await fetchWithErrorHandling(`${API_BASE_URL}/llm/recommendations`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to get health recommendations:', error);
      throw error;
    }
  },
  
  getAnomalyAnalysis: async (anomalyId: string) => {
    try {
      return await fetchWithErrorHandling(`${API_BASE_URL}/llm/analysis/${anomalyId}`);
    } catch (error) {
      console.error('Failed to get anomaly analysis:', error);
      throw error;
    }
  },
  
  setApiKey: async (apiKey: string) => {
    try {
      return await fetchWithErrorHandling(`${API_BASE_URL}/llm/config`, {
        method: 'POST',
        body: JSON.stringify({ apiKey })
      });
    } catch (error) {
      console.error('Failed to set LLM API key:', error);
      throw error;
    }
  }
};