import React from 'react';

const BackgroundCircles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      {/* Top decorative circles */}
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-80 animate-pulse" 
           style={{ animationDuration: '4s' }} />
      
      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-64 h-64 rounded-full" 
           style={{ background: 'linear-gradient(135deg, #0A2367 0%, #1e40af 100%)' }} />
      
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-bl from-red-600 to-red-800 opacity-80 animate-pulse" 
           style={{ animationDuration: '3s' }} />
      
      {/* Bottom decorative circles */}
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full" 
           style={{ background: 'linear-gradient(45deg, #F9AE2B 0%, #f59e0b 100%)' }} />
      
      <div className="absolute -bottom-40 left-1/3 w-64 h-64 rounded-full" 
           style={{ background: 'linear-gradient(135deg, #0A2367 0%, #1e40af 100%)' }} />
      
      <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-tl from-red-600 to-red-800 opacity-90" />
      
      {/* Additional mobile-optimized circles */}
      <div className="absolute top-1/4 -right-16 w-32 h-32 rounded-full bg-gradient-to-l from-orange-400 to-yellow-500 opacity-60 md:hidden" />
      <div className="absolute bottom-1/4 -left-16 w-28 h-28 rounded-full bg-gradient-to-r from-red-500 to-red-700 opacity-60 md:hidden" />
    </div>
  );
};

export default BackgroundCircles;