import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Navigation, ShieldCheck, Flame, Compass, Target } from 'lucide-react';
import { LeafParticles } from '../components/LeafParticles';

export function Landing() {
  const [emissions, setEmissions] = useState(0);

  useEffect(() => {
    // India's annual CO2 emissions are roughly 2.9 billion metric tonnes (2,900,000,000,000 kg)
    const annualEmissionsKg = 2900000000000; 
    
    const updateEmissions = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      
      const isLeapYear = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || (now.getFullYear() % 400 === 0);
      const daysInYear = isLeapYear ? 366 : 365;
      const msInYear = daysInYear * 24 * 60 * 60 * 1000;
      
      const msElapsed = now - startOfYear;
      const currentEmissions = annualEmissionsKg * (msElapsed / msInYear);
      setEmissions(Math.round(currentEmissions));
    };

    updateEmissions();
    const timer = setInterval(updateEmissions, 53); // Update 19 times/sec for ultra-smooth tick

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#F8F9F0] to-[#E9F0EC] px-4 pt-8 pb-20">
      {/* Background Particles */}
      <LeafParticles />

      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto text-center z-10 py-12">
        {/* Leaf Tag */}
        <div className="inline-flex items-center space-x-2 bg-[#74C69D]/20 border border-[#74C69D]/40 text-[#2D6A4F] font-semibold text-xs uppercase px-3.5 py-1.5 rounded-full mb-6 tracking-wider shadow-sm">
          <Leaf className="w-3.5 h-3.5" />
          <span>India Sustainability Initiative</span>
        </div>

        {/* Hero Header */}
        <h1 className="text-4xl sm:text-6xl font-black text-[#1B2A1E] tracking-tight leading-none mb-6">
          Your choices leave a mark.<br />
          <span className="text-[#2D6A4F]">Track it. Change it.</span>
        </h1>
        
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mb-12 font-medium">
          Understand your personal carbon footprint, adopt sustainable Indian-focused habits, and log actions to earn eco-credentials.
        </p>

        {/* simulated real-time counter */}
        <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md border border-white/60 p-8 rounded-3xl shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#74C69D]/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#2D6A4F]/10 rounded-full blur-2xl"></div>

          <h2 className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-4">
            India's Estimated CO₂ Emissions This Year
          </h2>
          
          <div className="font-mono text-3xl sm:text-5xl font-black text-[#1B2A1E] tabular-nums tracking-wide mb-3 flex justify-center items-baseline gap-1.5">
            {emissions.toLocaleString('en-IN')}
            <span className="text-lg font-bold text-gray-500">kg</span>
          </div>

          <p className="text-xs text-gray-400">
            Ticking at ~91,950 kg per second based on national averages for {new Date().getFullYear()}.
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to="/calculate"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#74C69D]"
        >
          <span>Calculate My Footprint</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </Link>
      </main>

      {/* Feature Highlights */}
      <footer className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 z-10 pt-8 border-t border-gray-200/50">
        <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white/40 border border-white/30 text-left">
          <div className="p-3 bg-[#74C69D]/20 rounded-xl text-[#2D6A4F]">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#1B2A1E]">1. Calculate</h3>
            <p className="text-sm text-gray-500 mt-1">
              Input transportation, energy, diet, and lifestyle metrics tailored to Indian households.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white/40 border border-white/30 text-left">
          <div className="p-3 bg-[#74C69D]/20 rounded-xl text-[#2D6A4F]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#1B2A1E]">2. Track</h3>
            <p className="text-sm text-gray-500 mt-1">
              Monitor trends over time with clean visual charts showing your reductions in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white/40 border border-white/30 text-left">
          <div className="p-3 bg-[#74C69D]/20 rounded-xl text-[#2D6A4F]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#1B2A1E]">3. Reduce</h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose from 20 high-impact eco-habits and let the AI guide you with tailored carbon-cutting tips.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
