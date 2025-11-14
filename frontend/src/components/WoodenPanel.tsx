import React from 'react';
import { cn } from '@/lib/utils';

interface WoodenPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const WoodenPanel: React.FC<WoodenPanelProps> = ({ children, className }) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative w-full max-w-[540px] md:max-w-[600px] lg:max-w-[660px] animate-scale-in transition-all duration-300">
        <img
          src="/images/ui/board2.png"
          alt=""
          className="pointer-events-none select-none w-full h-auto"
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center px-12 py-14 md:px-16 md:py-16 lg:px-20 lg:py-20">
          <div className="w-full max-w-[420px] md:max-w-[460px] lg:max-w-[480px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
