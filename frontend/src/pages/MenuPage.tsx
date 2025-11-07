import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { JungleLayout } from '@/components/JungleLayout';
import { WoodenPanel } from '@/components/WoodenPanel';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, username } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <JungleLayout>
      <div className="flex min-h-screen items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md space-y-16 relative z-10">
          {/* Title */}
          <div className="text-center space-y-3 animate-scale-in">
            <h1 className="cartoon-text text-5xl md:text-6xl font-extrabold">
              BANANA BEAST
            </h1>
            <p className="text-sm text-foreground/60">
              Welcome, <span className="text-primary font-semibold">{username}</span>
            </p>
          </div>

          {/* Menu Panel */}
          <WoodenPanel className="space-y-4 animate-scale-in">
            <Button
              variant="default"
              size="xl"
              className="w-full"
              onClick={() => navigate('/game')}
            >
              Start Game
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="w-full"
              onClick={() => navigate('/highscores')}
            >
              Leaderboard
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="w-full"
              onClick={() => navigate('/howtoplay')}
            >
              How to Play
            </Button>
            
            <div className="pt-3 border-t border-white/10">
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </div>
          </WoodenPanel>
        </div>
      </div>
    </JungleLayout>
  );
};

export default MenuPage;
