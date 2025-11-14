import React from 'react';
import { Header } from '@/components/Header';

interface JungleLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export const JungleLayout: React.FC<JungleLayoutProps> = ({ children, showHeader = false }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <img
          src="/images/bgs/home.jpg"
          alt="Banana Beast background"
          className="w-full h-full object-cover opacity-60"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background/30 dark:from-black/60 dark:via-black/45 dark:to-black/65" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {showHeader && <Header />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
