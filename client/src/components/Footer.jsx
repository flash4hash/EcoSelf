import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full bg-[#1B2A1E] text-[#F8F9F0] py-8 border-t border-[#2D6A4F]/30">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2 text-[#74C69D]">
          <Leaf className="w-6 h-6" />
          <span className="font-black text-xl tracking-tight text-white">EcoSelf</span>
        </div>
        <div className="text-center text-sm text-gray-400">
          <p className="mb-3 text-gray-300 font-semibold">Built for Hack2Skill × Google PromptWars India 2026</p>
          <div className="flex space-x-6 justify-center mb-3">
            <Link to="/" className="hover:text-[#74C69D] transition-colors">Home</Link>
            <Link to="/calculate" className="hover:text-[#74C69D] transition-colors">Calculator</Link>
            <Link to="/learn" className="hover:text-[#74C69D] transition-colors">Learn</Link>
          </div>
          <p className="text-xs">Data sources: IPCC AR6, CEA India</p>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          © 2026 EcoSelf
        </div>
      </div>
    </footer>
  );
}

export default Footer;
