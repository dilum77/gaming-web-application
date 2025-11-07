import React from 'react';

export const JungleBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300"
        style={{
          backgroundImage: `url('/images/backgrounds/jungle-background.jpg')`,
          opacity: 0.3
        }}
        onError={(e) => {
          // Hide if image doesn't exist
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      
      {/* Decorative foliage overlay */}
      <img
        src="/images/backgrounds/leaves-overlay.png"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none opacity-20"
        style={{ mixBlendMode: 'multiply' }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

