import React, { useState, useEffect } from 'react';
import { Users, Send, Twitter, ShieldAlert, Award, Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

export function Community({ ecoScore, activeActions, latestResults }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [pledgeText, setPledgeText] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmittingPledge, setIsSubmittingPledge] = useState(false);
  const [pledgeError, setPledgeError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Weekly Challenges
  const challenges = [
    { title: 'Commuter Challenge', desc: 'Walk or cycle for all short trips under 2 km this week. Leave your motor vehicles parked!', metric: 'Saves ~15 kg CO₂' },
    { title: 'Standby Zero', desc: 'Ensure all home electronics (TVs, chargers, routers) are unplugged at the wall before sleeping.', metric: 'Saves ~5 kg CO₂' },
    { title: 'Plant-Powered Week', desc: 'Switch to a lacto-vegetarian diet for 3 consecutive days. Focus on lentils, beans, and millets.', metric: 'Saves ~25 kg CO₂' },
    { title: 'Zero-Wrap Challenge', desc: 'Carry a cloth tote bag and a water flask everywhere. Refuse all single-use carrier polythenes.', metric: 'Saves ~8 kg CO₂' }
  ];

  // Get current challenge based on week of the year
  const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000)) || 1;
  const activeChallenge = challenges[(currentWeek - 1) % 4];

  // Retrieve user name from profile localStorage
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('ecoProfile') || '{}');
    setUserName(profile.name || 'Anonymous User');
  }, []);

  // Fetch leaderboard & pledges
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Sync current user score first if they have a name
      const profile = JSON.parse(localStorage.getItem('ecoProfile') || '{}');
      const name = profile.name || 'You';
      
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score: ecoScore })
      });

      // 2. Fetch leaderboard
      const lbRes = await fetch('/api/leaderboard');
      if (lbRes.ok) {
        const lbData = await lbRes.json();
        setLeaderboard(lbData);
      }

      // 3. Fetch pledges
      const plRes = await fetch('/api/pledges');
      if (plRes.ok) {
        const plData = await plRes.json();
        setPledges(plData);
      }
    } catch (err) {
      console.error('Error fetching community data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ecoScore]);

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    setPledgeError('');
    if (!pledgeText.trim()) return;

    if (pledgeText.length > 120) {
      setPledgeError('Pledge must be 120 characters or fewer.');
      return;
    }

    setIsSubmittingPledge(true);
    try {
      const profile = JSON.parse(localStorage.getItem('ecoProfile') || '{}');
      const name = profile.name || 'Anonymous User';

      const response = await fetch('/api/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pledge: pledgeText })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit pledge');
      }

      setPledgeText('');
      // Reload lists
      fetchData();
    } catch (err) {
      console.error('Pledge submission failed:', err);
      setPledgeError(err.message || 'Connection failed. Please try again.');
    } finally {
      setIsSubmittingPledge(false);
    }
  };

  // Share Tweet prefill
  // Calculate user's monthly savings from activeActions prop
  const monthlySaved = activeActions.reduce((sum, action) => sum + (action.savedCo2 || 0), 0);

  const handleShareTweet = () => {
    const tweetText = `I reduced my carbon footprint by ${monthlySaved} kg this month on EcoSelf! 🌱 #EcoSelf #Hack2Skill #SustainabilityChallenge`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-4" aria-label="Loading community data">
      {[1,2,3].map(i => (
        <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" aria-hidden="true" />
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-8">
      {/* Header */}
      <div className="text-center">
        <Users className="w-10 h-10 text-[#2D6A4F] mx-auto mb-2" />
        <h1 className="text-3xl font-black text-[#1B2A1E]">Community Wall & Rankings</h1>
        <p className="text-gray-500 mt-2 text-sm">Join other eco-warriors in India making small changes for big collective impact.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Leaderboard */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-[#2D6A4F]">
            <Award className="w-5 h-5 text-[#2D6A4F]" />
            <h2 className="font-bold text-base text-[#1B2A1E]">Top Eco Scores</h2>
          </div>

          <div className="space-y-3">
            {leaderboard.map((entry, idx) => {
              const isCurrentUser = entry.name.toLowerCase() === userName.toLowerCase() || (entry.is_mock === 0 && entry.name === 'You');
              return (
                <div 
                  key={entry.id || idx}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    isCurrentUser 
                      ? 'bg-[#2D6A4F]/10 border-[#2D6A4F]/30 ring-1 ring-[#2D6A4F]/20' 
                      : 'bg-gray-50/50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      idx === 0 
                        ? 'bg-amber-100 text-amber-800' 
                        : idx === 1 
                          ? 'bg-slate-100 text-slate-800' 
                          : idx === 2 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-gray-200 text-gray-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`text-sm font-semibold ${isCurrentUser ? 'text-[#2D6A4F] font-bold' : 'text-gray-700'}`}>
                      {entry.name} {isCurrentUser && '(You)'}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-black text-[#1B2A1E] bg-white border border-gray-200/60 px-2.5 py-1 rounded-lg">
                    {entry.score} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Pledge Wall */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#2D6A4F]">
              <Users className="w-5 h-5 text-[#2D6A4F]" />
              <h2 className="font-bold text-base text-[#1B2A1E]">Eco Pledge Wall</h2>
            </div>

            {/* Pledge Submit Form */}
            <form onSubmit={handlePledgeSubmit} className="space-y-3">
              <label htmlFor="pledge-wall-input" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Write a short sustainability pledge (max 120 characters)
              </label>
              <div className="relative">
                <input
                  id="pledge-wall-input"
                  type="text"
                  placeholder="e.g. I pledge to carry a reusable metal bottle everywhere! 💧"
                  value={pledgeText}
                  onChange={e => setPledgeText(e.target.value)}
                  maxLength={120}
                  className="w-full pl-4 pr-16 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmittingPledge || !pledgeText.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-[#2D6A4F] hover:bg-[#1B4332] disabled:bg-gray-200 text-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Submit pledge"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Pledge is shared publicly with your profile name.</span>
                <span className={pledgeText.length > 100 ? 'text-amber-600 font-bold' : ''}>
                  {pledgeText.length}/120
                </span>
              </div>
              {pledgeError && <p className="text-xs font-bold text-red-500">{pledgeError}</p>}
            </form>

            {/* List of pledges */}
            <div className="space-y-3 pt-4 border-t border-gray-100 max-h-[250px] sm:max-h-[350px] overflow-y-auto pr-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Recent Pledges</h3>
              {pledges.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-400 italic">No pledges logged yet. Be the first to pledge!</div>
              ) : (
                pledges.map((p) => (
                  <div key={p.id} className="p-3.5 bg-[#F8F9F0] border border-gray-200/50 rounded-xl">
                    <p className="text-xs text-gray-700 font-medium italic">"{p.pledge}"</p>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                      <span className="font-bold text-gray-500">— {p.name}</span>
                      <span>{new Date(p.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rotating Challenge & Share Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Weekly Challenge Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 mb-4">
              <Calendar className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#1B2A1E]">Weekly Challenge</h3>
            </div>
            
            <h4 className="font-black text-lg text-gray-800 mb-2">{activeChallenge.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">{activeChallenge.desc}</p>
          </div>

          <div className="flex justify-between items-center bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-xs font-bold text-amber-800">
            <span>Weekly Goal</span>
            <span>{activeChallenge.metric}</span>
          </div>
        </div>

        {/* Share Score Card */}
        <div className="bg-[#2D6A4F] text-[#F8F9F0] p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#74C69D]/20 rounded-full blur-xl"></div>

          <div>
            <h3 className="font-black text-lg mb-2">Spread the Word</h3>
            <p className="text-[#D8F3DC] text-xs leading-relaxed mb-6">
              Let your friends and community know about your carbon reductions! Invite others to track their footprints on EcoSelf.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1B4332] p-4 rounded-xl text-xs border border-[#74C69D]/20 italic select-all">
              "I reduced my carbon footprint by {monthlySaved} kg this month on EcoSelf! 🌱 #EcoSelf #Hack2Skill #SustainabilityChallenge"
            </div>

            <button
              onClick={handleShareTweet}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <Twitter className="w-4 h-4 fill-white" />
              <span>Share on X / Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Community.propTypes = {
  ecoScore: PropTypes.number.isRequired,
  activeActions: PropTypes.arrayOf(PropTypes.object).isRequired,
  latestResults: PropTypes.object,
};

export default Community;
