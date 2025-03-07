# NeuroCard - ECG & EEG Analysis Platform

NeuroCard is a modern web application that provides real-time analysis of ECG (electrocardiogram) and EEG (electroencephalogram) data, featuring 3D visualizations, anomaly detection, and AI-powered health recommendations.

## Features

- Real-time ECG & EEG data visualization with interactive 3D models
- Advanced early detection system for health risks:
  - Stroke risk detection within 7 minutes of pattern onset
  - Heart attack risk detection within 7 minutes of pattern onset
  - Combined risk analysis with 5-minute early warning
  - Progressive risk assessment with probability tracking
- Machine learning-powered anomaly detection
- AI-powered health recommendations using Google's Gemini
- Google Fit integration for historical health data
- Beautiful, responsive UI with real-time updates
- Comprehensive test suite for risk detection algorithms

## Early Detection Capabilities

The platform includes sophisticated early detection systems that monitor for:

### Stroke Risk Indicators
- Decreasing alpha wave activity
- Elevated delta wave patterns
- Beta wave variations
- Asymmetric brain activity patterns

### Heart Attack Risk Indicators
- ST segment elevation
- T wave inversions
- QRS complex abnormalities
- R wave amplitude changes

### Combined Risk Analysis
- Simultaneous monitoring of both ECG and EEG patterns
- Cross-correlation of cardiac and neurological indicators
- Rapid detection of compound health risks

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm (usually comes with Node.js)

## Setup Instructions

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a Python virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows:
   ```bash
   venv\Scripts\activate
   ```
   - macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Start the Flask backend:
```bash
python main.py
```

The backend will be available at `http://localhost:5000`

## Testing

Run the test suite to verify early detection capabilities:

```bash
cd backend
python -m unittest tests/test_risk_detection.py -v
```

The tests simulate various health scenarios including:
- Progressive stroke risk patterns
- Developing heart attack indicators
- Combined risk scenarios
- Normal to abnormal pattern transitions

## Project Structure

```
├── backend/
│   ├── models/          # ML models and training scripts
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic and services
│   ├── tests/           # Test suites for risk detection
│   ├── main.py         # Backend entry point
│   └── requirements.txt # Python dependencies
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # Frontend services
│   └── utils/         # Utility functions
├── package.json       # Node.js dependencies
└── README.md         # This file
```

## Development

- Frontend uses React with TypeScript and Tailwind CSS
- Backend uses Flask with Python
- Real-time data processing with NumPy and scikit-learn
- 3D visualizations using Three.js and React Three Fiber
- State management with React hooks
- Machine learning models for risk detection
- Comprehensive test suite for validation

## API Integration
- Gemini AI for health recommendations
