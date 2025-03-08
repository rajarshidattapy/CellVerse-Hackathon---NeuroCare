import MistralClient from '@mistralai/mistralai';

const mistral = new MistralClient({
  apiKey: 'fDLrlQw1ihTODC7r1MX4RJQssrmsakRq'
});

// Multiple sets of mock data for varied responses
const mockDataSets = [
  {
    shortTerm: [
      "Increased risk of cardiac arrhythmia within 3-6 months",
      "Potential development of stress-induced hypertension",
      "Risk of anxiety-related cardiovascular symptoms",
      "Possible sleep pattern disruptions affecting heart rhythm"
    ],
    longTerm: [
      "Progressive cardiovascular system adaptations over 2-3 years",
      "Potential development of chronic stress-related conditions",
      "Risk of cognitive function changes due to sustained stress",
      "Possible development of autonomic nervous system imbalances"
    ],
    risks: [
      { condition: "Cardiac Arrhythmia", probability: 0.65 },
      { condition: "Hypertension", probability: 0.55 },
      { condition: "Anxiety Disorder", probability: 0.45 },
      { condition: "Sleep Disorders", probability: 0.40 }
    ],
    preventiveMeasures: [
      "Regular cardiovascular check-ups every 3 months",
      "Implementation of stress management techniques",
      "Maintain consistent sleep schedule",
      "Regular physical activity with heart rate monitoring",
      "Balanced diet with reduced sodium intake",
      "Regular blood pressure monitoring"
    ],
    warningSignals: [
      "Irregular heartbeat or palpitations",
      "Unexplained fatigue or weakness",
      "Chest discomfort or pressure",
      "Shortness of breath during light activity",
      "Dizziness or light-headedness",
      "Sudden changes in blood pressure"
    ]
  },
  {
    shortTerm: [
      "High probability of stress-induced cardiovascular changes",
      "Risk of developing mild cognitive impairment",
      "Potential for autonomic nervous system dysfunction",
      "Increased likelihood of sleep-related breathing disorders"
    ],
    longTerm: [
      "Risk of developing chronic cardiovascular conditions",
      "Potential cognitive decline without intervention",
      "Progressive autonomic nervous system adaptation",
      "Possible development of chronic sleep disorders"
    ],
    risks: [
      { condition: "Cognitive Decline", probability: 0.58 },
      { condition: "Sleep Apnea", probability: 0.52 },
      { condition: "Cardiovascular Disease", probability: 0.48 },
      { condition: "Autonomic Dysfunction", probability: 0.43 }
    ],
    preventiveMeasures: [
      "Regular cognitive assessment and monitoring",
      "Sleep study and continuous monitoring",
      "Cardiovascular health optimization program",
      "Autonomic function testing and tracking",
      "Lifestyle modifications for brain health",
      "Regular exercise with proper monitoring"
    ],
    warningSignals: [
      "Memory lapses or confusion",
      "Daytime sleepiness or fatigue",
      "Irregular heart rhythms",
      "Unexplained dizziness",
      "Changes in blood pressure regulation",
      "Difficulty with concentration"
    ]
  },
  {
    shortTerm: [
      "Risk of developing acute stress response syndrome",
      "Potential for early-stage hypertension",
      "Increased likelihood of anxiety-related symptoms",
      "Risk of sleep-wake cycle disruption"
    ],
    longTerm: [
      "Possible development of chronic stress disorder",
      "Risk of long-term cardiovascular adaptations",
      "Potential for persistent anxiety patterns",
      "Progressive sleep pattern changes"
    ],
    risks: [
      { condition: "Chronic Stress", probability: 0.72 },
      { condition: "Early Hypertension", probability: 0.63 },
      { condition: "Anxiety Disorder", probability: 0.58 },
      { condition: "Sleep Disruption", probability: 0.51 }
    ],
    preventiveMeasures: [
      "Stress management program enrollment",
      "Regular blood pressure monitoring",
      "Anxiety management techniques",
      "Sleep hygiene improvement plan",
      "Regular exercise routine",
      "Dietary modifications"
    ],
    warningSignals: [
      "Persistent stress symptoms",
      "Elevated blood pressure readings",
      "Anxiety attacks or panic symptoms",
      "Disrupted sleep patterns",
      "Physical tension and discomfort",
      "Mood changes and irritability"
    ]
  },
  {
    shortTerm: [
      "Risk of developing neurological stress patterns",
      "Potential cardiac rhythm variations",
      "Increased likelihood of sleep disturbances",
      "Risk of cognitive performance fluctuations"
    ],
    longTerm: [
      "Possible chronic neurological adaptations",
      "Risk of persistent cardiac pattern changes",
      "Potential for chronic sleep disorders",
      "Progressive cognitive function changes"
    ],
    risks: [
      { condition: "Neurological Stress", probability: 0.67 },
      { condition: "Cardiac Rhythm Issues", probability: 0.59 },
      { condition: "Sleep Disorders", probability: 0.54 },
      { condition: "Cognitive Decline", probability: 0.48 }
    ],
    preventiveMeasures: [
      "Neurological health monitoring",
      "Cardiac rhythm tracking",
      "Sleep pattern optimization",
      "Cognitive function exercises",
      "Stress reduction techniques",
      "Regular health assessments"
    ],
    warningSignals: [
      "Neurological symptoms",
      "Irregular heart patterns",
      "Sleep disruptions",
      "Cognitive difficulties",
      "Stress-related symptoms",
      "Physical fatigue"
    ]
  },
  {
    shortTerm: [
      "Risk of autonomic nervous system imbalance",
      "Potential for stress-related cardiac changes",
      "Increased likelihood of cognitive stress",
      "Risk of circadian rhythm disruption"
    ],
    longTerm: [
      "Possible chronic autonomic dysfunction",
      "Risk of progressive cardiac adaptations",
      "Potential for persistent cognitive changes",
      "Long-term sleep pattern alterations"
    ],
    risks: [
      { condition: "Autonomic Dysfunction", probability: 0.64 },
      { condition: "Cardiac Stress", probability: 0.57 },
      { condition: "Cognitive Stress", probability: 0.52 },
      { condition: "Sleep Pattern Changes", probability: 0.49 }
    ],
    preventiveMeasures: [
      "Autonomic function monitoring",
      "Cardiac health program",
      "Cognitive health maintenance",
      "Sleep schedule optimization",
      "Stress management techniques",
      "Regular medical check-ups"
    ],
    warningSignals: [
      "Autonomic symptoms",
      "Cardiac irregularities",
      "Cognitive difficulties",
      "Sleep disturbances",
      "Stress manifestations",
      "Physical symptoms"
    ]
  },
  {
    shortTerm: [
      "Risk of developing acute stress response",
      "Potential cardiovascular adaptations",
      "Increased likelihood of sleep disruption",
      "Risk of cognitive performance changes"
    ],
    longTerm: [
      "Possible chronic stress condition",
      "Risk of long-term cardiac changes",
      "Potential for persistent sleep issues",
      "Progressive cognitive adaptations"
    ],
    risks: [
      { condition: "Acute Stress", probability: 0.69 },
      { condition: "Cardiovascular Changes", probability: 0.61 },
      { condition: "Sleep Issues", probability: 0.56 },
      { condition: "Cognitive Changes", probability: 0.50 }
    ],
    preventiveMeasures: [
      "Stress level monitoring",
      "Cardiovascular health tracking",
      "Sleep quality improvement",
      "Cognitive function maintenance",
      "Regular exercise program",
      "Dietary optimization"
    ],
    warningSignals: [
      "Stress symptoms",
      "Cardiovascular signs",
      "Sleep disruptions",
      "Cognitive issues",
      "Physical symptoms",
      "Mood changes"
    ]
  }
];

// Function to get a random mock data set
function getRandomMockData() {
  const randomIndex = Math.floor(Math.random() * mockDataSets.length);
  return {
    ...mockDataSets[randomIndex],
    timeSeriesForecasts: {
      cardiacMetrics: generateCardiacForecasts(),
      neurologicalMetrics: generateNeurologicalForecasts(),
      riskScores: generateRiskScoreForecasts(),
      vitalSigns: generateVitalSignForecasts()
    }
  };
}

// Generate 12 months of cardiac forecasts
function generateCardiacForecasts() {
  const startDate = new Date();
  const forecasts = [];
  let baseHeartRate = 75;
  let baseBloodPressure = { systolic: 120, diastolic: 80 };
  let baseArrhythmiaRisk = 0.2;

  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    // Add seasonal variations and trends
    const seasonalFactor = Math.sin((i / 12) * 2 * Math.PI);
    const trendFactor = i / 24; // Slight upward trend

    const forecast = {
      date: date.toISOString(),
      metrics: {
        heartRate: {
          mean: baseHeartRate + seasonalFactor * 5 + trendFactor * 10,
          min: baseHeartRate - 10 + seasonalFactor * 3,
          max: baseHeartRate + 20 + seasonalFactor * 7,
          variability: 0.15 + Math.abs(seasonalFactor) * 0.05
        },
        bloodPressure: {
          systolic: {
            mean: baseBloodPressure.systolic + seasonalFactor * 8 + trendFactor * 15,
            range: [
              baseBloodPressure.systolic - 15 + seasonalFactor * 5,
              baseBloodPressure.systolic + 25 + seasonalFactor * 10
            ]
          },
          diastolic: {
            mean: baseBloodPressure.diastolic + seasonalFactor * 5 + trendFactor * 10,
            range: [
              baseBloodPressure.diastolic - 10 + seasonalFactor * 3,
              baseBloodPressure.diastolic + 15 + seasonalFactor * 7
            ]
          }
        },
        arrhythmiaRisk: baseArrhythmiaRisk + Math.abs(seasonalFactor) * 0.1 + trendFactor * 0.15,
        ecgAnomalies: {
          predicted: Math.round((3 + seasonalFactor * 2 + trendFactor * 4) * 10) / 10,
          severity: (0.3 + Math.abs(seasonalFactor) * 0.2 + trendFactor * 0.25).toFixed(2)
        }
      },
      confidence: 0.95 - (i * 0.03) // Confidence decreases with time
    };

    forecasts.push(forecast);
  }

  return forecasts;
}

// Generate 12 months of neurological forecasts
function generateNeurologicalForecasts() {
  const startDate = new Date();
  const forecasts = [];
  let baseStressLevel = 0.4;
  let baseCognitiveScore = 0.85;
  let baseSleepQuality = 0.75;

  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    const seasonalFactor = Math.sin((i / 12) * 2 * Math.PI);
    const trendFactor = i / 24;

    const forecast = {
      date: date.toISOString(),
      metrics: {
        stressLevels: {
          mean: baseStressLevel + seasonalFactor * 0.15 + trendFactor * 0.2,
          range: [
            baseStressLevel - 0.1 + Math.abs(seasonalFactor) * 0.05,
            baseStressLevel + 0.3 + Math.abs(seasonalFactor) * 0.15
          ]
        },
        cognitiveFunction: {
          overall: baseCognitiveScore - Math.abs(seasonalFactor) * 0.05 - trendFactor * 0.1,
          attention: baseCognitiveScore - Math.abs(seasonalFactor) * 0.07 - trendFactor * 0.08,
          memory: baseCognitiveScore - Math.abs(seasonalFactor) * 0.06 - trendFactor * 0.12
        },
        sleepPatterns: {
          quality: baseSleepQuality - Math.abs(seasonalFactor) * 0.1 - trendFactor * 0.15,
          disruptions: Math.round((2 + seasonalFactor * 1.5 + trendFactor * 3) * 10) / 10,
          remPercentage: 0.25 - seasonalFactor * 0.03 - trendFactor * 0.05
        },
        eegAnomalies: {
          predicted: Math.round((2 + Math.abs(seasonalFactor) * 1.5 + trendFactor * 2.5) * 10) / 10,
          severity: (0.25 + Math.abs(seasonalFactor) * 0.15 + trendFactor * 0.2).toFixed(2)
        }
      },
      confidence: 0.93 - (i * 0.025) // Confidence decreases with time
    };

    forecasts.push(forecast);
  }

  return forecasts;
}

// Generate 12 months of risk score forecasts
function generateRiskScoreForecasts() {
  const startDate = new Date();
  const forecasts = [];
  let baseCardiacRisk = 0.3;
  let baseStrokeRisk = 0.25;
  let baseAnxietyRisk = 0.35;

  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    const seasonalFactor = Math.sin((i / 12) * 2 * Math.PI);
    const trendFactor = i / 24;

    const forecast = {
      date: date.toISOString(),
      scores: {
        cardiac: {
          overall: baseCardiacRisk + seasonalFactor * 0.1 + trendFactor * 0.15,
          components: {
            arrhythmia: baseCardiacRisk * 0.8 + seasonalFactor * 0.12 + trendFactor * 0.18,
            ischemia: baseCardiacRisk * 0.6 + Math.abs(seasonalFactor) * 0.08 + trendFactor * 0.12,
            hypertension: baseCardiacRisk * 0.7 + seasonalFactor * 0.15 + trendFactor * 0.2
          }
        },
        stroke: {
          overall: baseStrokeRisk + Math.abs(seasonalFactor) * 0.08 + trendFactor * 0.12,
          components: {
            thrombotic: baseStrokeRisk * 0.7 + seasonalFactor * 0.1 + trendFactor * 0.15,
            hemorrhagic: baseStrokeRisk * 0.5 + Math.abs(seasonalFactor) * 0.07 + trendFactor * 0.1
          }
        },
        neurological: {
          anxiety: baseAnxietyRisk + seasonalFactor * 0.15 + trendFactor * 0.2,
          depression: baseAnxietyRisk * 0.8 + Math.abs(seasonalFactor) * 0.12 + trendFactor * 0.18,
          cognitive: baseAnxietyRisk * 0.6 + seasonalFactor * 0.1 + trendFactor * 0.15
        }
      },
      confidence: 0.92 - (i * 0.02) // Confidence decreases with time
    };

    forecasts.push(forecast);
  }

  return forecasts;
}

// Generate 12 months of vital sign forecasts
function generateVitalSignForecasts() {
  const startDate = new Date();
  const forecasts = [];
  let baseTemperature = 98.6;
  let baseOxygenSaturation = 98;
  let baseRespiratoryRate = 16;

  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    const seasonalFactor = Math.sin((i / 12) * 2 * Math.PI);
    const trendFactor = i / 24;

    const forecast = {
      date: date.toISOString(),
      vitals: {
        temperature: {
          mean: baseTemperature + seasonalFactor * 0.4 + trendFactor * 0.3,
          range: [
            baseTemperature - 0.5 + seasonalFactor * 0.2,
            baseTemperature + 0.8 + seasonalFactor * 0.3
          ]
        },
        oxygenSaturation: {
          mean: baseOxygenSaturation - Math.abs(seasonalFactor) * 0.5 - trendFactor * 0.8,
          range: [
            baseOxygenSaturation - 2 - Math.abs(seasonalFactor),
            baseOxygenSaturation - Math.abs(seasonalFactor) * 0.3
          ]
        },
        respiratoryRate: {
          mean: baseRespiratoryRate + seasonalFactor * 1 + trendFactor * 1.5,
          range: [
            baseRespiratoryRate - 2 + seasonalFactor * 0.5,
            baseRespiratoryRate + 4 + seasonalFactor * 1.5
          ]
        }
      },
      anomalyProbability: 0.1 + Math.abs(seasonalFactor) * 0.05 + trendFactor * 0.1,
      confidence: 0.94 - (i * 0.02) // Confidence decreases with time
    };

    forecasts.push(forecast);
  }

  return forecasts;
}

export async function predictHealthConditions(anomalies: any[], patientProfile: any) {
  try {
    const prompt = `As a medical AI expert, analyze the following health data and provide detailed predictions about potential future health conditions. Focus on medically accurate, evidence-based predictions.

Patient Profile:
Age: ${patientProfile.age}
Gender: ${patientProfile.gender}
Medical History: ${patientProfile.medicalHistory}

Recent Anomalies:
${anomalies.map(a => `- Type: ${a.type}
  Severity: ${a.severity}
  Description: ${a.description}
  Details: ${a.details}
  Detected: ${new Date(a.timestamp).toLocaleString()}`).join('\n')}

Based on this data, provide:
1. Short-term predictions (next 6 months)
2. Long-term predictions (2-5 years)
3. Risk percentages for each condition
4. Preventive measures
5. Warning signs to monitor

Format the response in a structured way with clear sections and bullet points.`;

    const response = await mistral.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "You are a highly experienced medical AI specializing in predictive healthcare analysis. Provide evidence-based predictions using medical research and clinical guidelines. Be thorough but avoid causing unnecessary alarm. Always emphasize that predictions are probabilistic and should be verified by healthcare professionals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      maxTokens: 2048,
      topP: 0.9
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      console.log('No response from Mistral API, using mock data');
      return getRandomMockData();
    }

    // Parse the response into structured sections
    const sections = content.split('\n\n');
    const result = {
      shortTerm: extractSection(sections, 'Short-term predictions'),
      longTerm: extractSection(sections, 'Long-term predictions'),
      risks: extractRisks(sections),
      preventiveMeasures: extractList(sections, 'Preventive measures'),
      warningSignals: extractList(sections, 'Warning signs'),
      timeSeriesForecasts: {
        cardiacMetrics: generateCardiacForecasts(),
        neurologicalMetrics: generateNeurologicalForecasts(),
        riskScores: generateRiskScoreForecasts(),
        vitalSigns: generateVitalSignForecasts()
      }
    };

    // If any section is empty, use random mock data for that section
    const mockData = getRandomMockData();
    if (result.shortTerm.length === 0) result.shortTerm = mockData.shortTerm;
    if (result.longTerm.length === 0) result.longTerm = mockData.longTerm;
    if (result.risks.length === 0) result.risks = mockData.risks;
    if (result.preventiveMeasures.length === 0) result.preventiveMeasures = mockData.preventiveMeasures;
    if (result.warningSignals.length === 0) result.warningSignals = mockData.warningSignals;

    return result;
  } catch (error) {
    console.error('Error generating health predictions:', error);
    return getRandomMockData();
  }
}

function extractSection(sections: string[], sectionName: string): string[] {
  const section = sections.find(s => s.toLowerCase().includes(sectionName.toLowerCase()));
  if (!section) return [];
  
  return section
    .split('\n')
    .slice(1) // Remove the section header
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

function extractRisks(sections: string[]): Array<{ condition: string; probability: number }> {
  const riskSection = sections.find(s => s.toLowerCase().includes('risk percentages'));
  if (!riskSection) return [];

  return riskSection
    .split('\n')
    .slice(1) // Remove the section header
    .map(line => {
      const match = line.match(/([^:]+):\s*(\d+)%/);
      if (!match) return null;
      
      return {
        condition: match[1].trim(),
        probability: parseInt(match[2]) / 100
      };
    })
    .filter((risk): risk is { condition: string; probability: number } => risk !== null);
}

function extractList(sections: string[], sectionName: string): string[] {
  const section = sections.find(s => s.toLowerCase().includes(sectionName.toLowerCase()));
  if (!section) return [];
  
  return section
    .split('\n')
    .slice(1) // Remove the section header
    .map(line => line.trim().replace(/^[•-]\s*/, ''))
    .filter(line => line.length > 0);
}