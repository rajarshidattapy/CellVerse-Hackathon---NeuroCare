import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAR5VNhCHL2nKQ72Q7VXsCA_GblLhcpGeI');

export async function generateHealthResponse(question: string, patientProfile: any): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `As a medical AI assistant, please provide a helpful and accurate response to this health-related question. Consider the patient's profile when relevant:

Patient Profile:
- Age: ${patientProfile.age}
- Gender: ${patientProfile.gender}
- Medical History: ${patientProfile.medicalHistory}

Question: ${question}

Please provide a clear, concise, and medically accurate response. Include relevant health advice and precautions when appropriate. If the question requires immediate medical attention, make sure to emphasize that.

Important: Always maintain a professional tone and emphasize that this is general advice, not a replacement for professional medical consultation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Add disclaimer if not already present
    if (!text.includes('medical professional')) {
      return text + '\n\nNote: This information is for general guidance only. Please consult a medical professional for personalized medical advice.';
    }

    return text;
  } catch (error) {
    console.error('Error generating health response:', error);
    return "I apologize, but I'm having trouble generating a response. For accurate medical advice, please consult with a healthcare professional.";
  }
}

export async function analyzeHealthData(ecgData: any[], eegData: any[], anomalies: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Format anomalies for better prompt structure
    const formattedAnomalies = anomalies.map(a => ({
      type: a.type,
      description: a.description,
      severity: a.severity,
      timestamp: new Date(a.timestamp).toLocaleString()
    }));

    // Create a structured prompt
    const prompt = `As a medical AI assistant specializing in cardiology and neurology, analyze this health data and provide recommendations:

Current Status:
- Total Anomalies: ${anomalies.length}
- ECG Anomalies: ${anomalies.filter(a => a.type === 'ECG').length}
- EEG Anomalies: ${anomalies.filter(a => a.type === 'EEG').length}

Detailed Anomalies:
${formattedAnomalies.map(a => `Time: ${a.timestamp}
Type: ${a.type}
Description: ${a.description}
Severity: ${a.severity}
`).join('\n')}

Please provide a structured analysis with the following sections:

1. Analysis:
[Provide a brief analysis of the detected patterns and their significance]

2. Health Implications:
[List potential health implications of these patterns]

3. Recommendations:
[List specific recommended actions, prioritized by importance]

4. Warning Signs:
[List specific warning signs that require immediate attention]

5. Medical Attention:
[Specify when to seek immediate medical attention]

Important: Keep the response concise and actionable. Focus on practical recommendations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into structured sections
    const sections = text.split(/\n(?=\d\. [A-Z])/);
    
    return {
      analysis: sections[1]?.replace(/1\. Analysis:/, '').trim() || '',
      implications: sections[2]?.replace(/2\. Health Implications:/, '').trim() || '',
      recommendations: sections[3]?.replace(/3\. Recommendations:/, '').trim().split('\n').filter(r => r.trim()),
      warningSigns: sections[4]?.replace(/4\. Warning Signs:/, '').trim().split('\n').filter(w => w.trim()),
      medicalAdvice: sections[5]?.replace(/5\. Medical Attention:/, '').trim()
    };
  } catch (error) {
    console.error('Error analyzing health data with Gemini:', error);
    return getMockAnalysis(anomalies);
  }
}

function getMockAnalysis(anomalies: any[]) {
  const hasECGAnomalies = anomalies.some(a => a.type === 'ECG');
  const hasEEGAnomalies = anomalies.some(a => a.type === 'EEG');
  
  return {
    analysis: `Based on the analysis of ${anomalies.length} detected anomalies, there are patterns that require attention. ${
      hasECGAnomalies ? 'The ECG data shows some irregular patterns that may indicate cardiac rhythm variations. ' : ''
    }${
      hasEEGAnomalies ? 'The EEG readings suggest fluctuations in brain wave activity that could be stress-related.' : ''
    }`,
    implications: 'These patterns may indicate increased stress levels and potential cardiovascular strain. Early intervention and lifestyle modifications could help prevent more serious conditions.',
    recommendations: [
      'Schedule a check-up with your healthcare provider',
      'Maintain a regular sleep schedule',
      'Practice stress-reduction techniques like deep breathing or meditation',
      'Monitor and log any unusual symptoms',
      'Stay hydrated and maintain a balanced diet'
    ],
    warningSigns: [
      'Severe chest pain or pressure',
      'Difficulty breathing',
      'Sudden confusion or severe headache',
      'Irregular heartbeat or palpitations',
      'Extreme fatigue or weakness'
    ],
    medicalAdvice: 'Seek immediate medical attention if you experience severe chest pain, difficulty breathing, or sudden neurological symptoms like severe headache or confusion.'
  };
}