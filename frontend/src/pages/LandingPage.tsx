import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { JungleLayout } from '@/components/JungleLayout';
import { WoodenPanel } from '@/components/WoodenPanel';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/menu');
    }
  }, [isAuthenticated, navigate]);

  return (
    <JungleLayout>
      <div className="flex min-h-screen items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md space-y-16 relative z-10">
          {/* Title */}
          <div className="text-center space-y-4 animate-scale-in">
            <h1 className="cartoon-text text-5xl md:text-6xl font-extrabold">
              BANANA BEAST
            </h1>
            <p className="text-base md:text-lg text-foreground/70">
              Outsmart the jungle, conquer every puzzle, claim the crown.
            </p>
          </div>

          {/* Action Panel */}
          <WoodenPanel className="space-y-4">
            <Button
              variant="default"
              size="xl"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="w-full"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </WoodenPanel>
        </div>
      </div>
    </JungleLayout>
  );
};

export default LandingPage;
