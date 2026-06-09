import React from 'react';

export function LeafParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Leaf 1 */}
      <div 
        className="absolute bottom-[-50px] left-[10%] w-8 h-8 opacity-0 animate-leaf-1"
        style={{ color: '#2D6A4F' }}
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L2.18,20.66C4.08,15.93 6,9.4 15,7C14.03,5.05 12.06,3.55 10,3V1C13.88,1 18,3 21,7C22,11 20,18 19,21C18.67,22 17.67,22 17,21C17,19 18,14 17,8Z" />
        </svg>
      </div>
      {/* Leaf 2 */}
      <div 
        className="absolute bottom-[-50px] left-[40%] w-6 h-6 opacity-0 animate-leaf-2"
        style={{ color: '#74C69D' }}
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L2.18,20.66C4.08,15.93 6,9.4 15,7C14.03,5.05 12.06,3.55 10,3V1C13.88,1 18,3 21,7C22,11 20,18 19,21C18.67,22 17.67,22 17,21C17,19 18,14 17,8Z" />
        </svg>
      </div>
      {/* Leaf 3 */}
      <div 
        className="absolute bottom-[-50px] left-[70%] w-10 h-10 opacity-0 animate-leaf-3"
        style={{ color: '#2D6A4F' }}
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L2.18,20.66C4.08,15.93 6,9.4 15,7C14.03,5.05 12.06,3.55 10,3V1C13.88,1 18,3 21,7C22,11 20,18 19,21C18.67,22 17.67,22 17,21C17,19 18,14 17,8Z" />
        </svg>
      </div>
      {/* Leaf 4 */}
      <div 
        className="absolute bottom-[-50px] left-[85%] w-7 h-7 opacity-0 animate-leaf-4"
        style={{ color: '#74C69D' }}
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L2.18,20.66C4.08,15.93 6,9.4 15,7C14.03,5.05 12.06,3.55 10,3V1C13.88,1 18,3 21,7C22,11 20,18 19,21C18.67,22 17.67,22 17,21C17,19 18,14 17,8Z" />
        </svg>
      </div>
    </div>
  );
}

export default LeafParticles;
