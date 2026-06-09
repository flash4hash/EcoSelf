import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import ActionHub, { ALL_ACTIONS } from './pages/ActionHub';
import Learn from './pages/Learn';
import Community from './pages/Community';
import Profile from './pages/Profile';

export function App() {
  const [activeActionIds, setActiveActionIds] = useState([]);
  const [latestResults, setLatestResults] = useState(null);
  const [latestInputs, setLatestInputs] = useState(null);
  const [ecoScore, setEcoScore] = useState(50);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedActions = JSON.parse(localStorage.getItem('ecoActiveActionIds') || '[]');
    const savedResults = JSON.parse(localStorage.getItem('ecoLatestResults') || 'null');
    const savedInputs = JSON.parse(localStorage.getItem('ecoLatestInputs') || 'null');

    setActiveActionIds(savedActions);
    setLatestResults(savedResults);
    setLatestInputs(savedInputs);
  }, []);

  // Calculate Eco Score dynamically
  useEffect(() => {
    // Base score is based on the carbon footprint.
    // If footprint is 0 (or not calculated), base is 50.
    // If calculated, higher emissions reduce the base score, but it is capped.
    // E.g. emissions of 4500 kg: base score = 100 - (4500 / 150) = 100 - 30 = 70.
    const baseScore = latestResults 
      ? Math.max(10, Math.min(95, 100 - Math.round(latestResults.total / 150))) 
      : 50;
    
    // Add 2.5 points for each completed action, capped at 100
    const pointsFromActions = activeActionIds.length * 2.5;
    const finalScore = Math.round(Math.min(100, baseScore + pointsFromActions));
    setEcoScore(finalScore);
  }, [latestResults, activeActionIds]);

  // Handle calculator submission callback
  const handleSaveResults = (computedResults) => {
    setLatestResults(computedResults);
    // Reload inputs from localStorage
    const savedInputs = JSON.parse(localStorage.getItem('ecoLatestInputs') || 'null');
    setLatestInputs(savedInputs);
  };

  // Handle toggling actions in Action Hub
  const handleToggleAction = (action) => {
    let updated;
    if (activeActionIds.includes(action.id)) {
      updated = activeActionIds.filter(id => id !== action.id);
    } else {
      updated = [...activeActionIds, action.id];
    }
    setActiveActionIds(updated);
    localStorage.setItem('ecoActiveActionIds', JSON.stringify(updated));
  };

  // Profile change listener (triggers re-eval of score and name updates)
  const handleProfileChange = () => {
    // Sync state
  };

  // Build active actions details list
  const completedActionsList = ALL_ACTIONS.filter(action => activeActionIds.includes(action.id));

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#F8F9F0] text-[#1B2A1E] flex flex-col justify-between">
          <Navbar ecoScore={ecoScore} />
          
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/calculate" element={<Calculator onSaveResults={handleSaveResults} />} />
              <Route 
                path="/dashboard" 
                element={
                  <Dashboard 
                    ecoScore={ecoScore} 
                    activeActions={ALL_ACTIONS}
                    completedActions={completedActionsList}
                    latestResults={latestResults}
                    latestInputs={latestInputs}
                  />
                } 
              />
              <Route 
                path="/actions" 
                element={
                  <ActionHub 
                    activeActionIds={activeActionIds} 
                    onToggleAction={handleToggleAction}
                    latestResults={latestResults}
                  />
                } 
              />
              <Route path="/learn" element={<Learn />} />
              <Route 
                path="/community" 
                element={
                  <Community 
                    ecoScore={ecoScore} 
                    activeActions={completedActionsList}
                    latestResults={latestResults}
                  />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <Profile 
                    ecoScore={ecoScore} 
                    activeActionIds={activeActionIds}
                    latestResults={latestResults}
                    onProfileChange={handleProfileChange}
                  />
                } 
              />
            </Routes>
          </div>

          <Footer />

          {/* Global Floating Chatbot drawer */}
          <ChatBot />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
