import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, TreePine, Sparkles, ChevronRight, TrendingDown, ClipboardList } from 'lucide-react';
import PropTypes from 'prop-types';

export function Dashboard({ ecoScore, activeActions, completedActions, latestResults, latestInputs }) {
  const navigate = useNavigate();
  const [advice, setAdvice] = useState('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // If no calculations exist, prompt user to calculate first
  const hasCalculated = !!latestResults;
  
  // Calculate stats
  const totalAnnual = latestResults?.total || 0;
  
  // CO2 saved per month from completed actions (each action saves X kg/month)
  const monthlySaved = completedActions.reduce((sum, action) => sum + (action.savedCo2 || 0), 0);
  const annualSaved = monthlySaved * 12;

  // Total CO2 this month = (Annual Footprint / 12) - Monthly Saved
  const rawMonthlyFootprint = hasCalculated ? Math.round(totalAnnual / 12) : 0;
  const currentMonthlyFootprint = Math.max(0, rawMonthlyFootprint - monthlySaved);

  // Reduction vs last month (%)
  // Based on: Saved CO2 / Baseline monthly footprint
  const reductionPercentage = rawMonthlyFootprint > 0 
    ? Math.round((monthlySaved / rawMonthlyFootprint) * 100) 
    : 0;

  // Equivalent trees needed to offset: Mature tree absorbs ~22 kg CO2 per year
  const treesNeeded = Math.round(Math.max(0, totalAnnual - annualSaved) / 22);

  // Seed mock monthly trend data (last 6 months)
  const mockTrendData = [
    { name: 'Jan', Footprint: rawMonthlyFootprint + 80 - (completedActions.length > 0 ? 10 : 0) },
    { name: 'Feb', Footprint: rawMonthlyFootprint + 60 - (completedActions.length > 1 ? 25 : 5) },
    { name: 'Mar', Footprint: rawMonthlyFootprint + 40 - (completedActions.length > 2 ? 40 : 10) },
    { name: 'Apr', Footprint: rawMonthlyFootprint + 20 - (completedActions.length > 3 ? 55 : 15) },
    { name: 'May', Footprint: rawMonthlyFootprint + 5 - (completedActions.length > 4 ? 70 : 20) },
    { name: 'Jun', Footprint: currentMonthlyFootprint } // current month
  ];

  // Bar chart category data
  const categoryData = [
    { name: 'Transport', Footprint: latestResults?.transport || 0 },
    { name: 'Home Energy', Footprint: latestResults?.energy || 0 },
    { name: 'Diet', Footprint: latestResults?.diet || 0 },
    { name: 'Lifestyle', Footprint: latestResults?.lifestyle || 0 }
  ];

  // Check advice caching on render
  useEffect(() => {
    const cachedAdvice = localStorage.getItem('ecoAdviceCache');
    const cachedTime = localStorage.getItem('ecoAdviceCacheTime');
    const cachedTotal = localStorage.getItem('ecoAdviceCacheTotal');
    const currentTotal = String(latestResults?.total || 0);
    
    if (cachedAdvice && cachedTime && cachedTotal === currentTotal) {
      const elapsed = Date.now() - Number(cachedTime);
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (elapsed < oneDayMs) {
        setAdvice(cachedAdvice);
        return;
      }
    }
    
    // Clear old cache and show nothing if total changed or expired
    localStorage.removeItem('ecoAdviceCache');
    localStorage.removeItem('ecoAdviceCacheTime');
    localStorage.removeItem('ecoAdviceCacheTotal');
    setAdvice('');
  }, [latestResults?.total]);

  const handleGetAdvice = async () => {
    if (!hasCalculated) return;
    
    setIsLoadingAdvice(true);
    try {
      const response = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transport: latestResults.transport,
          home: latestResults.energy,
          diet: latestResults.diet,
          lifestyle: latestResults.lifestyle,
          total: latestResults.total
        })
      });

      if (!response.ok) {
        throw new Error('AI failed to respond');
      }

      const data = await response.json();
      setAdvice(data.advice);

      // Cache advice with current timestamp
      localStorage.setItem('ecoAdviceCache', data.advice);
      localStorage.setItem('ecoAdviceCacheTime', String(Date.now()));
      localStorage.setItem('ecoAdviceCacheTotal', String(latestResults?.total || 0));
    } catch (err) {
      console.error('Error fetching advice:', err);
      setAdvice(`1. Walk or use two-wheelers for local errands under 2 km to easily cut transport emissions.
2. Turn off air conditioners when leaving rooms and unplug standby television/charger cables.
3. Choose locally grown lentils and seasonal produce to minimize indirect carbon shipping impacts.`);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  if (!hasCalculated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-[#74C69D]/20 text-[#2D6A4F] rounded-full mb-6">
          <ClipboardList className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-[#1B2A1E]">Welcome to EcoSelf Dashboard!</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          You haven't calculated your carbon footprint yet. Take our 2-minute quick calculator to load your dashboard stats!
        </p>
        <button
          onClick={() => navigate('/calculate')}
          className="mt-8 px-8 py-3.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold rounded-2xl transition duration-200 shadow-md cursor-pointer"
        >
          Calculate My Footprint
        </button>
      </div>
    );
  }

  // Comparisons styling values
  const userTotal = Math.max(0, totalAnnual - annualSaved);
  const avgIndian = 1900;
  const avgGlobal = 4700;
  
  // Percentage widths (capped at 100 for safety rendering)
  const maxRef = Math.max(userTotal, avgGlobal);
  const userPct = Math.round((userTotal / maxRef) * 100);
  const indianPct = Math.round((avgIndian / maxRef) * 100);
  const globalPct = Math.round((avgGlobal / maxRef) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <TreePine className="w-64 h-64 translate-x-12 translate-y-12" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black mb-2">Hello Eco-Warrior!</h1>
        <p className="text-[#D8F3DC] text-sm max-w-xl">
          Track your personal carbon footprint, verify your progress, and continue acting to reduce emissions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total CO2 this month */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total CO₂ This Month</span>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black text-[#1B2A1E]">{currentMonthlyFootprint.toLocaleString('en-IN')}</span>
            <span className="text-sm font-bold text-gray-500">kg</span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block">
            Baseline: {rawMonthlyFootprint} kg (Saved {monthlySaved} kg)
          </span>
        </div>

        {/* Card 2: Reduction vs Last Month */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Reduction vs Baseline</span>
          <div className="mt-4 flex items-center space-x-2 text-emerald-600 font-bold">
            <TrendingDown className="w-6 h-6" />
            <span className="text-3xl font-mono">{reductionPercentage}%</span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block">
            Based on active eco-habits logged.
          </span>
        </div>

        {/* Card 3: Eco Score */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Eco Score</span>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black text-[#2D6A4F]">{ecoScore}</span>
            <span className="text-sm font-bold text-gray-500">/ 100</span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block">
            Complete actions to boost score.
          </span>
        </div>

        {/* Card 4: Trees Equivalent */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Trees Needed (Offset)</span>
          <div className="mt-4 flex items-center space-x-2 text-[#2D6A4F] font-bold">
            <TreePine className="w-6 h-6" />
            <span className="text-3xl font-mono">{treesNeeded}</span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block">
            Offsetting remaining {Math.max(0, totalAnnual - annualSaved).toLocaleString('en-IN')} kg/year.
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-[#1B2A1E] text-base mb-6">Monthly Emission Trend (kg CO₂e)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                <Line type="monotone" dataKey="Footprint" stroke="#2D6A4F" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-[#1B2A1E] text-base mb-6">Emissions by Category (kg CO₂e)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                <Bar dataKey="Footprint" fill="#74C69D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparisons and Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simple Styled Progress Comparison Bars */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-bold text-[#1B2A1E] text-base mb-4">How You Compare</h3>
          
          <div className="space-y-6">
            {/* User vs India */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700">Your Annual Footprint</span>
                <span className="font-mono font-bold text-[#1B2A1E]">{userTotal.toLocaleString('en-IN')} kg/year</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${userTotal <= avgIndian ? 'bg-[#2D6A4F]' : 'bg-rose-500'}`}
                  style={{ width: `${userPct}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm pt-2">
                <span className="text-gray-500">Average Indian Footprint</span>
                <span className="font-mono font-bold text-gray-600">1,900 kg/year</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-400 rounded-full"
                  style={{ width: `${indianPct}%` }}
                ></div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* User vs Global */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700">Your Annual Footprint</span>
                <span className="font-mono font-bold text-[#1B2A1E]">{userTotal.toLocaleString('en-IN')} kg/year</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${userTotal <= avgGlobal ? 'bg-[#2D6A4F]' : 'bg-rose-500'}`}
                  style={{ width: `${userPct}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm pt-2">
                <span className="text-gray-500">Average Global Footprint</span>
                <span className="font-mono font-bold text-gray-600">4,700 kg/year</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-400 rounded-full"
                  style={{ width: `${globalPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Eco Advisor Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#74C69D]/30 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#74C69D]/10 rounded-full blur-xl"></div>
          
          <div>
            <div className="flex items-center space-x-2 text-[#2D6A4F] mb-4">
              <Brain className="w-6 h-6 text-[#2D6A4F]" />
              <h3 className="font-bold text-base text-[#1B2A1E]">AI Eco Advisor</h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Get personalized, localized tips based on your calculator answers. Tips are cached for 24 hours.
            </p>

            {/* Response Area */}
            {isLoadingAdvice ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : advice ? (
              <div className="bg-[#F8F9F0] border border-[#74C69D]/20 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line shadow-inner">
                {advice}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-gray-400 italic">
                No advice loaded yet. Click below to fetch custom AI suggestions.
              </div>
            )}
          </div>

          <button
            onClick={handleGetAdvice}
            disabled={isLoadingAdvice}
            className="mt-6 w-full py-3 bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-gray-300 text-white font-bold rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#74C69D]"
          >
            <Sparkles className="w-4 h-4 text-[#74C69D] fill-[#74C69D]" />
            <span>{advice ? 'Refresh Advice' : 'Get Personalized Advice'}</span>
          </button>
        </div>
      </div>

      {/* Recent Actions Log */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-[#1B2A1E] text-base">Recent Eco-Actions Log</h3>
          <button 
            onClick={() => navigate('/actions')}
            className="text-[#2D6A4F] font-bold text-sm hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Action Hub</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {completedActions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic">
            You haven't completed any actions yet. Visit the Action Hub to mark your first task!
          </div>
        ) : (
          <div className="space-y-4">
            {completedActions.slice(-5).reverse().map((action, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <h4 className="font-bold text-sm text-gray-800">{action.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                </div>
                <span className="font-mono text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  Saved {action.savedCo2} kg/month
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  ecoScore: PropTypes.number.isRequired,
  activeActions: PropTypes.arrayOf(PropTypes.object).isRequired,
  completedActions: PropTypes.arrayOf(PropTypes.object).isRequired,
  latestResults: PropTypes.object,
  latestInputs: PropTypes.object,
};

export default Dashboard;
