import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full py-4 px-6 md:px-8 flex justify-between items-center bg-card/80 backdrop-blur-lg border-b border-border/20 shadow-lg">
      <div className="text-sm md:text-base font-semibold text-foreground">
        <span className="text-primary font-bold">{username}</span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs md:text-sm">
          Log Out
        </Button>
      </div>
    </header>
  );
};
