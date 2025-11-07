import React from 'react';

interface DecorativeMonkeyProps {
  variant?: 'happy' | 'waving' | 'thinking' | 'celebrating' | 'king';
  position?: 'left' | 'right';
  className?: string;
  message?: string;
}

export const DecorativeMonkey: React.FC<DecorativeMonkeyProps> = ({
  variant = 'happy',
  position = 'left',
  className = '',
  message
}) => {
  const imagePath = `/images/characters/monkey-${variant}.png`;
  
  // Fallback emoji if image not loaded
  const emojiMap = {
    happy: '🐵',
    waving: '👋🐵',
    thinking: '🤔🐵',
    celebrating: '🎉🐵',
    king: '👑🐵'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`animate-float ${position === 'right' ? 'scale-x-[-1]' : ''}`}>
        <img
          src={imagePath}
          alt={`Monkey ${variant}`}
          className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
          onError={(e) => {
            // Fallback to emoji if image doesn't exist yet
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) fallback.classList.remove('hidden');
          }}
        />
        {/* Fallback emoji */}
        <div className="hidden text-6xl md:text-7xl">
          {emojiMap[variant]}
        </div>
      </div>
      
      {message && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48">
          <div className="relative bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-secondary/30">
            <p className="text-sm font-bold text-secondary text-center">{message}</p>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-t-2 border-secondary/30 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

