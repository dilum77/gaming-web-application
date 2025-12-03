import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { JungleLayout } from '@/components/JungleLayout';
import { WoodenPanel } from '@/components/WoodenPanel';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <JungleLayout showHeader>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <div className="w-full max-w-md space-y-16">
          {/* Title */}
          <div className="text-center space-y-3 animate-scale-in">
            <h1 className="cartoon-text text-5xl md:text-6xl font-extrabold">
              BANANA BEAST
            </h1>
            <div className="flex flex-col items-center gap-3">
              {user && (
                <UserAvatar username={user.username} size="xl" />
              )}
              <p className="text-sm text-foreground/60">
                Welcome, <span className="text-primary font-semibold">{user?.username}</span>
              </p>
            </div>
          </div>

          {/* Menu Panel */}
          <WoodenPanel className="space-y-4 animate-scale-in">
            <Button
              variant="default"
              size="xl"
              className="w-full"
              onClick={() => navigate('/game')}
            >
              Play
            </Button>
            <Button
              variant="default"
              size="xl"
              className="w-full"
              onClick={() => navigate('/highscores')}
            >
              Leaderboard
            </Button>
            <Button
              variant="default"
              size="xl"
              className="w-full"
              onClick={() => navigate('/howtoplay')}
            >
              How to Play
            </Button>
          </WoodenPanel>
        </div>
      </div>
    </JungleLayout>
  );
};

export default MenuPage;
