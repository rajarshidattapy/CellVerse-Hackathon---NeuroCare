# NeuroCardiac Digital Twin 🧠❤️

![NeuroCardiac Digital Twin Workflow](workflow-diagram.png)

## 🚀 Overview
The **NeuroCardiac Digital Twin** is an AI-powered system that integrates **EEG and ECG data**, leveraging **machine learning** and **real-time anomaly detection** to provide **continuous health monitoring, predictive analytics, and personalized health recommendations**. This system bridges the gap between **cardiac and neural health** for **precision medicine at scale**.

## 🏗️ Workflow
1. **Data Generation & Collection**
   - Real-time **EEG & ECG data** collection via wearable sensors.
   - **Preprocessing & Feature Extraction** (e.g., heart rate variability, PQRST detection, brainwave patterns).

2. **Machine Learning for Anomaly Detection**
   - **Random Forest Model** trained on normal EEG & ECG data.
   - **Isolation Forest** detects anomalies in real-time.

3. **AI-Powered Health Alerts & Recommendations**
   - **Anomaly data is sent to Google Gemini** for health alerts and personalized recommendations.

4. **Time-Series Forecasting & Chatbot Integration**
   - **Mistral AI processes anomaly data** to predict future health risks.
   - **AI Chatbot** enables users to query and receive AI-driven health insights.

5. **3D Digital Twin & Continuous Monitoring**
   - **Holographic 3D visualization** updates with real-time risk heatmaps.
   - **Continuous learning** enhances predictive accuracy.

## 🛠️ Tech Stack
- **AI & ML:** Scikit-Learn (Random Forest, Isolation Forest), Mistral AI, Google Gemini API
- **Chatbot:** Mistral AI API
- **3D Visualization:** Three.js

## 📌 Features
✅ Real-time **EEG & ECG monitoring**  
✅ AI-powered **anomaly detection**  
✅ **Predictive analytics** for future health risks  
✅ **Health alerts & recommendations** via Google Gemini  
✅ **Mistral AI chatbot** for patient queries and future predictions
✅ **3D Digital Twin visualization**  

## 🎯 Future Enhancements
- Integration with **IoT-enabled wearable devices**
- Improved **deep learning-based forecasting**
- Enhanced **personalized treatment plans**

## 🏁 Getting Started
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/neurocardiac-digital-twin.git
cd neurocardiac-digital-twin
```

### 2️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Run the Application
```bash
python main.py
```

## 🤝 Contributing
- Rajarshi Datta -> responsible for frontend and writing backend
- Gautam Sharma -> training model and connecting to frontend
- Sarthak Gupta -> Frontend styling
- Varshini Mishra -> Styling and presentation



