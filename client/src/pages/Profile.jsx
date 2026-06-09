import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { User, MapPin, Award, FileText, Brain, Copy, Download, X, Check } from 'lucide-react';
import { ALL_ACTIONS } from './ActionHub';

export function Profile({ ecoScore, activeActionIds, latestResults, onProfileChange }) {
  const [profile, setProfile] = useState({ name: '', city: '' });
  const [reportText, setReportText] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('ecoProfile') || '{"name":"","city":""}');
    setProfile(savedProfile);
  }, []);

  const handleChange = (field, value) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    localStorage.setItem('ecoProfile', JSON.stringify(updated));
    if (onProfileChange) {
      onProfileChange(updated);
    }
  };

  // Sparkline history (6 historical items based on score progress)
  const scoreHistory = [
    { score: Math.max(10, ecoScore - 20) },
    { score: Math.max(15, ecoScore - 15) },
    { score: Math.max(20, ecoScore - 10) },
    { score: Math.max(25, ecoScore - 8) },
    { score: Math.max(30, ecoScore - 4) },
    { score: ecoScore }
  ];

  // Badges calculations
  const totalCompleted = activeActionIds.length;
  const badges = [
    { id: 'starter', name: 'Leaf Starter', desc: 'Log your first eco-action.', required: 1, icon: '🌱' },
    { id: 'warrior', name: 'Green Warrior', desc: 'Log at least 5 eco-actions.', required: 5, icon: '🛡️' },
    { id: 'champion', name: 'Eco Champion', desc: 'Log at least 10 eco-actions.', required: 10, icon: '🏆' },
    { id: 'hero', name: 'Carbon Neutral Hero', desc: 'Complete all 20 eco-actions.', required: 20, icon: '👑' }
  ];

  // Export standard report
  const handleExportTextReport = () => {
    const totalAnnual = latestResults?.total || 0;
    const completedActionTitles = ALL_ACTIONS
      .filter(a => activeActionIds.includes(a.id))
      .map(a => `- ${a.title} (Saves ${a.savedCo2} kg/month)`)
      .join('\n');

    const reportContent = `ECOSELF CARBON FOOTPRINT REPORT
==================================
Date: ${new Date().toLocaleDateString('en-IN')}
User: ${profile.name || 'Anonymous Warrior'}
City: ${profile.city || 'Not Specified'}
----------------------------------
Current Eco Score: ${ecoScore} / 100
Annual Carbon Footprint: ${totalAnnual.toLocaleString('en-IN')} kg CO2e/year
----------------------------------
COMPLETED ECO-ACTIONS (${activeActionIds.length} total):
${completedActionTitles || 'No actions completed yet.'}
==================================
Thank you for playing your part in reducing India's emissions! 🌱`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EcoSelf_Report_${profile.name || 'User'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Generate Weekly AI Report
  const handleGenerateAIReport = async () => {
    setIsGeneratingReport(true);
    setShowReportModal(true);
    setReportText('');
    setCopied(false);

    try {
      // Mock last 4 weeks of footprint data based on active reduction
      const monthlyBaseline = latestResults ? Math.round(latestResults.total / 12) : 333;
      const completedActionsList = ALL_ACTIONS.filter(a => activeActionIds.includes(a.id));
      const monthlySaved = completedActionsList.reduce((sum, action) => sum + action.savedCo2, 0);

      const weekData = [
        { week: 1, footprint: Math.max(50, monthlyBaseline / 4) },
        { week: 2, footprint: Math.max(50, (monthlyBaseline - (monthlySaved * 0.3)) / 4) },
        { week: 3, footprint: Math.max(50, (monthlyBaseline - (monthlySaved * 0.7)) / 4) },
        { week: 4, footprint: Math.max(50, (monthlyBaseline - monthlySaved) / 4) }
      ];

      const response = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: weekData,
          actions: completedActionsList.map(a => a.title)
        })
      });

      if (!response.ok) throw new Error('Failed to generate report');
      const data = await response.json();
      setReportText(data.report);
    } catch (err) {
      console.error('AI Report error:', err);
      // Fallback
      setReportText(`You have done an amazing job this month! By setting up eco-habits and logging actions, you have already saved significant carbon emissions.

Your biggest carbon impact area remains Transport. Opting to walk or carpool for short trips can yield even higher carbon savings.

Did you know? If 1 million households in India committed to switching off standby electrical plugs, we would collectively offset over 150 million kg of CO2 emissions annually! Keep up the green choices.`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAIReport = () => {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EcoSelf_AI_Weekly_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Trapping focus inside Modal when open
  useEffect(() => {
    if (!showReportModal) return;

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      if (!modalRef.current) return;

      const focusables = modalRef.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showReportModal]);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-20 space-y-8">
      {/* Header */}
      <div className="text-center">
        <User className="w-10 h-10 text-[#2D6A4F] mx-auto mb-2" />
        <h1 className="text-3xl font-black text-[#1B2A1E]">User Profile & Badges</h1>
        <p className="text-gray-500 mt-2 text-sm">Manage preferences, track credentials, and export reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="font-bold text-base text-gray-800 border-b pb-2 border-gray-100 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>Profile Settings</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="profileName" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Name</label>
              <input
                id="profileName"
                type="text"
                value={profile.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Rohan Gupta"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] text-sm"
              />
            </div>

            <div>
              <label htmlFor="profileCity" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
              <input
                id="profileCity"
                type="text"
                value={profile.city}
                onChange={e => handleChange('city', e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] text-sm"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Score Trend</span>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">This Week</span>
                <span className="font-mono font-black text-[#2D6A4F] text-lg">Score: {ecoScore} ▲ +5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Exporter */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 md:col-span-2">
          <div className="flex items-center space-x-2 text-[#2D6A4F] border-b pb-2 border-gray-100">
            <Award className="w-5 h-5 text-[#2D6A4F]" />
            <h2 className="font-bold text-base text-[#1B2A1E]">Earned Badges</h2>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map(badge => {
              const isEarned = totalCompleted >= badge.required;
              return (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex items-center space-x-4 ${
                    isEarned
                      ? 'bg-[#2D6A4F]/5 border-[#2D6A4F]/30 shadow-sm'
                      : 'bg-gray-50 border-gray-100 opacity-60'
                  }`}
                >
                  <span className={`text-3xl p-2.5 rounded-xl ${isEarned ? 'bg-[#74C69D]/20 animate-pulse' : 'bg-gray-200/50'}`}>
                    {badge.icon}
                  </span>
                  <div>
                    <h3 className={`text-sm font-bold ${isEarned ? 'text-gray-800' : 'text-gray-400'}`}>{badge.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{badge.desc}</p>
                    <span className={`text-[10px] font-bold mt-1.5 inline-block px-2 py-0.5 rounded-md ${
                      isEarned 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isEarned ? 'UNLOCKED' : `Requires ${badge.required} ${badge.required === 1 ? 'action' : 'actions'}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Buttons */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExportTextReport}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition duration-150 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <FileText className="w-4 h-4" />
              <span>Export Text Report</span>
            </button>

            <button
              onClick={handleGenerateAIReport}
              className="flex-1 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#74C69D]"
            >
              <Brain className="w-4 h-4 text-[#74C69D] fill-[#74C69D]" />
              <span>Generate AI Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Report Modal */}
      {showReportModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-report-title"
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 border-gray-100">
              <div className="flex items-center space-x-2 text-[#2D6A4F]">
                <Brain className="w-6 h-6 text-[#2D6A4F]" />
                <h2 id="ai-report-title" className="text-lg font-black text-gray-800">Weekly AI Sustainability Report</h2>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                aria-label="Close report modal"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-6">
              {isGeneratingReport ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-gray-500 animate-pulse">EcoBot is compiling your carbon trend and generating advice...</p>
                </div>
              ) : (
                <div className="text-sm text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap select-text bg-[#F8F9F0] border border-[#74C69D]/20 p-5 rounded-2xl shadow-inner">
                  {reportText}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            {!isGeneratingReport && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={handleCopyToClipboard}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition duration-150 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                </button>

                <button
                  onClick={handleDownloadAIReport}
                  className="flex-1 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#74C69D]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download as .txt</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
