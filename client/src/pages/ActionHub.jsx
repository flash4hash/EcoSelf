import React, { useState } from 'react';
import { Sparkles, Check, Info, ShieldAlert, Award } from 'lucide-react';

export const ALL_ACTIONS = [
  // Transport
  { id: 1, category: 'Transport', title: 'Public Transport 3x/week', description: 'Swap driving for buses, trains, or metro trains to reduce single-occupant footprint.', savedCo2: 40, difficulty: 'Easy' },
  { id: 2, category: 'Transport', title: 'Carpool to Work', description: 'Share commuter trips with colleagues to reduce fuel burning.', savedCo2: 30, difficulty: 'Medium' },
  { id: 3, category: 'Transport', title: 'Cycle/Walk Short Trips', description: 'For errands under 2km, avoid starting the engine entirely.', savedCo2: 15, difficulty: 'Easy' },
  { id: 4, category: 'Transport', title: 'Avoid One Domestic Flight', description: 'Choose express train networks for domestic transit where possible.', savedCo2: 21, difficulty: 'Committed' },
  { id: 5, category: 'Transport', title: 'Optimal Car Tire Pressure', description: 'Maintain target tire pressure to optimize fuel combustion rates.', savedCo2: 8, difficulty: 'Easy' },
  
  // Home Energy
  { id: 6, category: 'Home Energy', title: 'Switch to LED Bulbs', description: 'Replace incandescent lighting with high-efficiency LED lights.', savedCo2: 10, difficulty: 'Easy' },
  { id: 7, category: 'Home Energy', title: 'Air-dry Laundry', description: 'Use natural sunlight and air to dry clothes instead of mechanical heat dryer.', savedCo2: 8, difficulty: 'Easy' },
  { id: 8, category: 'Home Energy', title: 'Reduce AC by 2°C', description: 'Set air conditioning temperature at 26°C instead of 24°C to save compressors.', savedCo2: 15, difficulty: 'Easy' },
  { id: 9, category: 'Home Energy', title: 'Switch Off Standby Power', description: 'Turn off televisions and desktop nodes at the wall plug.', savedCo2: 5, difficulty: 'Easy' },
  { id: 10, category: 'Home Energy', title: 'Install Smart Power Strip', description: 'Stops vampire load draw automatically on idle peripherals.', savedCo2: 4, difficulty: 'Medium' },
  { id: 11, category: 'Home Energy', title: 'Induction / Solar Cooking', description: 'Swap traditional LPG burners for modern solar heaters or induction cooktops.', savedCo2: 25, difficulty: 'Committed' },

  // Diet
  { id: 12, category: 'Diet', title: 'Vegetarian 3 Days/week', description: 'Minimize high-carbon meat supply chain footprints by eating lentils/grains.', savedCo2: 25, difficulty: 'Medium' },
  { id: 13, category: 'Diet', title: 'Cut Food Waste by Half', description: 'Store food correctly and plan meals to limit waste decay emissions.', savedCo2: 12, difficulty: 'Easy' },
  { id: 14, category: 'Diet', title: 'Balcony Herb Garden', description: 'Grow basic kitchen herbs locally to offset packaging supply transport.', savedCo2: 2, difficulty: 'Easy' },
  { id: 15, category: 'Diet', title: 'Eat Local Produce', description: 'Purchase seasonal, locally sourced foods from regional farmers.', savedCo2: 10, difficulty: 'Easy' },
  { id: 16, category: 'Diet', title: 'Dairy-Free Switch', description: 'Use almond, oat, or soy milks instead of commercial dairy.', savedCo2: 6, difficulty: 'Medium' },

  // Lifestyle
  { id: 17, category: 'Lifestyle', title: 'Buy Second-Hand Once/Month', description: 'Extend products lifecycle to curb manufacturing and logistics emissions.', savedCo2: 5, difficulty: 'Easy' },
  { id: 18, category: 'Lifestyle', title: 'Unsubscribe Unused Streaming', description: 'Decreases continuous cloud storage server usage overheads.', savedCo2: 3, difficulty: 'Easy' },
  { id: 19, category: 'Lifestyle', title: 'Reject Single-Use Plastics', description: 'Stop purchasing single-use bottles, straws, and polythenes.', savedCo2: 8, difficulty: 'Medium' },
  { id: 20, category: 'Lifestyle', title: 'Composting Organic Waste', description: 'Turn kitchen scrap waste into rich soil instead of sending to landfills.', savedCo2: 15, difficulty: 'Committed' }
];

export function ActionHub({ activeActionIds, onToggleAction, latestResults }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Transport', 'Home Energy', 'Diet', 'Lifestyle'];

  // Calculate total saved
  const completedActions = ALL_ACTIONS.filter(action => activeActionIds.includes(action.id));
  const totalMonthlySaved = completedActions.reduce((sum, action) => sum + action.savedCo2, 0);

  const handleGetRecommendations = async () => {
    setIsRecommending(true);
    try {
      const breakdown = latestResults || { transport: 1000, energy: 1000, diet: 1000, lifestyle: 1000, total: 4000 };
      
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transport: breakdown.transport,
          home: breakdown.energy,
          diet: breakdown.diet,
          lifestyle: breakdown.lifestyle,
          completed: activeActionIds,
          actionsList: ALL_ACTIONS
        })
      });

      if (!response.ok) {
        throw new Error('AI recommendation failed');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      // Fallback: Recommend top 5 high impact remaining actions
      const uncompleted = ALL_ACTIONS.filter(a => !activeActionIds.includes(a.id));
      uncompleted.sort((a, b) => b.savedCo2 - a.savedCo2);
      setRecommendations(uncompleted.slice(0, 5).map(a => a.id));
    } finally {
      setIsRecommending(false);
    }
  };

  const filteredActions = activeTab === 'All' 
    ? ALL_ACTIONS 
    : ALL_ACTIONS.filter(a => a.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#1B2A1E]">Action Hub</h1>
          <p className="text-gray-500 text-sm">Log carbon-reducing actions and habits. Every logged action improves your Eco Score.</p>
        </div>

        <div className="bg-gradient-to-br from-[#F8F9F0] to-[#E9F0EC] p-6 rounded-2xl border border-[#74C69D]/20 text-center flex flex-col justify-center min-w-[200px]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] mb-1">Total Savings Logged</span>
          <span className="font-mono text-3xl font-black text-[#1B2A1E]">
            {totalMonthlySaved} <span className="text-sm font-bold text-gray-500">kg CO₂/month</span>
          </span>
        </div>
      </div>

      {/* AI Recommendation Launcher */}
      <div className="bg-[#F8F9F0] border border-[#74C69D]/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start space-x-3 text-left">
          <div className="p-2.5 bg-[#2D6A4F]/10 rounded-xl text-[#2D6A4F] mt-0.5">
            <Sparkles className="w-5 h-5 fill-[#2D6A4F]/20" />
          </div>
          <div>
            <h3 className="font-bold text-[#1B2A1E]">Smart AI Action Recommender</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-lg">
              Let the AI analyze your footprint profile to recommend the 5 highest-impact next steps tailored for you.
            </p>
          </div>
        </div>

        <button
          onClick={handleGetRecommendations}
          disabled={isRecommending}
          className="px-6 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-gray-300 text-white font-bold rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#74C69D] flex-shrink-0"
        >
          {isRecommending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Recommending...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Show My Top 5 Actions</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-gray-200 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#74C69D] ${
              activeTab === cat
                ? 'bg-[#2D6A4F] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActions.map(action => {
          const isCompleted = activeActionIds.includes(action.id);
          const isRecommended = recommendations.includes(action.id);
          
          return (
            <div 
              key={action.id}
              className={`bg-white rounded-2xl p-6 border shadow-sm relative flex flex-col justify-between transition-all duration-200 ${
                isCompleted 
                  ? 'border-emerald-500 bg-emerald-50/10 shadow-emerald-50/20' 
                  : isRecommended 
                    ? 'border-[#2D6A4F] ring-2 ring-[#74C69D]/30 shadow-md' 
                    : 'border-gray-200'
              }`}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <span className="absolute top-4 right-4 bg-[#2D6A4F] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  Recommended for you
                </span>
              )}

              {/* Content */}
              <div className="space-y-3 pr-20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {action.category}
                </span>
                
                <h3 className="font-bold text-base text-[#1B2A1E] leading-tight">
                  {action.title}
                </h3>
                
                <p className="text-xs text-gray-500 leading-relaxed">
                  {action.description}
                </p>
              </div>

              {/* Action Stats */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Carbon Savings</span>
                  <span className="font-mono text-sm font-black text-emerald-600">
                    {action.savedCo2} kg/month
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Difficulty Badge */}
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    action.difficulty === 'Easy' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : action.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {action.difficulty}
                  </span>

                  {/* Toggle Check Button */}
                  <button
                    onClick={() => onToggleAction(action)}
                    aria-label={`Mark "${action.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#74C69D] ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-600 text-white shadow-inner' 
                        : 'bg-white border-gray-300 hover:border-gray-400 text-gray-300'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActionHub;
