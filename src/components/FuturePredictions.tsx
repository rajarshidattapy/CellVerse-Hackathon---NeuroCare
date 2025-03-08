import React, { useState, useRef, useEffect } from 'react';
import { useAnomalies } from '../hooks/useAnomalies';
import { predictHealthConditions } from '../services/groq';
import { generateHealthResponse } from '../services/gemini';
import { Send, Bot, User, RefreshCw, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  data?: any;
}

const LoadingIndicator = () => (
  <div className="space-y-6 p-4">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
    </div>
    <div className="flex items-center justify-center space-x-2 text-blue-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Analyzing health patterns...</span>
    </div>
  </div>
);

const FuturePredictions = () => {
  const { anomalies } = useAnomalies();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'bot',
    content: 'Hello! I can help you with health-related questions and future predictions. You can ask me about:\n\n• Short-term predictions (next 6 months)\n• Long-term predictions (2-5 years)\n• Risk analysis\n• Preventive measures\n• Warning signs to monitor\n• General health questions and advice'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock patient profile - in a real app, this would come from user data
  const patientProfile = {
    age: 45,
    gender: 'Male',
    medicalHistory: 'Hypertension, Family history of cardiovascular disease'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        
        // Simulate different stages of analysis
        const stages = [
          'Analyzing historical health data...',
        ];

        for (const stage of stages) {
          setLoadingStage(stage);
          // Simulate processing time for each stage
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        const result = await predictHealthConditions(anomalies, patientProfile);
        setPredictions(result);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
        setLoadingStage('');
      }
    };

    fetchPredictions();
  }, [anomalies]);

  const isPredictionQuery = (query: string): boolean => {
    const predictionKeywords = [
      'prediction', 'forecast', 'future',
      'short', 'long', '6 month', '2-5',
      'risk', 'prevent', 'warning', 'sign'
    ];
    return predictionKeywords.some(keyword => query.includes(keyword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const query = input.toLowerCase();
      let response: Message;

      if (isPredictionQuery(query) && predictions) {
        // Simulate processing time for prediction queries
        setLoadingStage('Analyzing query and generating personalized response...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (query.includes('short') || query.includes('6 month')) {
          response = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "Here are the short-term predictions (next 6 months):\n\n" + 
              predictions.shortTerm.map((pred: string) => `• ${pred}`).join('\n')
          };
        } else if (query.includes('long') || query.includes('2-5')) {
          response = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "Here are the long-term predictions (2-5 years):\n\n" + 
              predictions.longTerm.map((pred: string) => `• ${pred}`).join('\n')
          };
        } else if (query.includes('risk')) {
          response = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "Here are the current risk assessments:\n\n" + 
              predictions.risks.map((risk: any) => 
                `• ${risk.condition}: ${Math.round(risk.probability * 100)}% probability`
              ).join('\n')
          };
        } else if (query.includes('prevent')) {
          response = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "Here are recommended preventive measures:\n\n" + 
              predictions.preventiveMeasures.map((measure: string) => `• ${measure}`).join('\n')
          };
        } else if (query.includes('warning') || query.includes('sign')) {
          response = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "Here are important warning signs to monitor:\n\n" + 
              predictions.warningSignals.map((signal: string) => `• ${signal}`).join('\n')
          };
        } else {
          response = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "I'm not sure how to help with that prediction query. Try asking about short-term or long-term predictions, risks, preventive measures, or warning signs."
          };
        }
      } else {
        // Simulate processing time for general health questions
        setLoadingStage('Processing health query and consulting medical database...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const answer = await generateHealthResponse(input, patientProfile);
        response = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: answer
        };
      }

      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I encountered an error processing your question. Please try again or rephrase your question."
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Health Prediction Assistant</h2>
        <button 
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-gray-800 rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className={`rounded-lg px-4 py-2 ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {message.content}
                  </pre>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start w-full">
              <div className="max-w-[80%] w-full bg-gray-800 rounded-lg">
                <LoadingIndicator />
                {loadingStage && (
                  <div className="px-4 pb-4 text-sm text-gray-400">
                    {loadingStage}
                  </div>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any health-related question..."
              className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuturePredictions;