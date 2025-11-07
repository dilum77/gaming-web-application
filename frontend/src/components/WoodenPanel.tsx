import React from 'react';
import { cn } from '@/lib/utils';

interface WoodenPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const WoodenPanel: React.FC<WoodenPanelProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "rounded-2xl p-8 md:p-10 relative overflow-hidden",
      "animate-scale-in",
      "transition-all duration-300",
      className
    )}>
      {/* Wooden texture */}
      <img
        src="/images/wooden_board.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        aria-hidden="true"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
