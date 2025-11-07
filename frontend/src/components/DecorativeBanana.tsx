import React from 'react';

interface DecorativeBananaProps {
  type?: 'single' | 'bunch';
  className?: string;
  animate?: boolean;
}

export const DecorativeBanana: React.FC<DecorativeBananaProps> = ({
  type = 'single',
  className = '',
  animate = true
}) => {
  const imagePath = `/images/props/banana-${type}.png`;

  return (
    <div className={`${className} ${animate ? 'animate-float' : ''}`}>
      <img
        src={imagePath}
        alt="Banana"
        className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md"
        onError={(e) => {
          // Fallback to emoji if image doesn't exist yet
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) fallback.classList.remove('hidden');
        }}
      />
      {/* Fallback emoji */}
      <div className="hidden text-5xl">🍌</div>
    </div>
  );
};

