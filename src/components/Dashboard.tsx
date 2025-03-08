import React, { useState } from 'react';
import DigitalTwin from './DigitalTwin';
import HealthAlerts from './HealthAlerts';
import ApiConnections from './ApiConnections';
import Recommendations from './Recommendations';
import FuturePredictions from './FuturePredictions';
import { Brain, Heart, AlertTriangle, Activity, UserCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('twin');

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="https://i.imgur.com/OpEOQQp.png" alt="NeuroCard Logo" className="h-8 w-8 md:h-10 md:w-10" />
            <h1 className="text-xl font-bold md:text-2xl">NeuroCare</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-700">
            <UserCircle className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        <nav className="w-16 bg-gray-800 border-r border-gray-700 md:w-20">
          <div className="flex flex-col items-center py-4 space-y-6">
            <button
              className={`p-3 rounded-lg ${activeTab === 'twin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('twin')}
              title="Digital Twin"
            >
              <Activity className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'alerts' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('alerts')}
              title="Health Alerts"
            >
              <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'api' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('api')}
              title="API Connections"
            >
              <Activity className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'recommendations' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('recommendations')}
              title="Recommendations"
            >
              <Brain className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'predictions' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('predictions')}
              title="Future Predictions"
            >
              <Clock className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </nav>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === 'twin' && <DigitalTwin />}
          {activeTab === 'alerts' && <HealthAlerts />}
          {activeTab === 'api' && <ApiConnections />}
          {activeTab === 'recommendations' && <Recommendations />}
          {activeTab === 'predictions' && <FuturePredictions />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;