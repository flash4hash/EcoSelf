import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Trophy } from 'lucide-react';
import PropTypes from 'prop-types';

export function Navbar({ ecoScore }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Calculator', path: '/calculate' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Action Hub', path: '/actions' },
    { name: 'Learn', path: '/learn' },
    { name: 'Community', path: '/community' },
    { name: 'Profile', path: '/profile' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#2D6A4F] text-[#F8F9F0] shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#74C69D] rounded-lg px-2 py-1">
            <Leaf className="w-6 h-6 text-[#74C69D] fill-[#74C69D] group-hover:scale-110 transition-transform duration-200" />
            <span className="font-bold text-xl tracking-tight">EcoSelf</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#74C69D] ${
                    active 
                      ? 'bg-[#1B4332] text-white' 
                      : 'text-[#D8F3DC] hover:bg-[#1B4332]/50 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Score Badge */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-1 bg-[#1B4332] border border-[#74C69D]/30 px-3 py-1.5 rounded-full text-sm font-semibold shadow-inner"
              title="Your Eco Score"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Your Eco Score: ${ecoScore} out of 100`}
            >
              <Trophy className="w-4 h-4 text-[#74C69D]" />
              <span className="text-[#74C69D] mr-1">Score:</span>
              <span className="text-white font-mono">{ecoScore}</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
              className="lg:hidden p-2 rounded-lg text-[#D8F3DC] hover:text-white hover:bg-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#74C69D] cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#2D6A4F] border-t border-[#1B4332] px-2 pt-2 pb-4 space-y-1 shadow-lg transition-all duration-200">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#74C69D] ${
                  active
                    ? 'bg-[#1B4332] text-white font-semibold shadow-inner'
                    : 'text-[#D8F3DC] hover:bg-[#1B4332]/50 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  ecoScore: PropTypes.number.isRequired,
};

export default Navbar;
