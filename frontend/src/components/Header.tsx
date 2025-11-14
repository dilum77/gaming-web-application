import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isMuted, toggleMute } = useAudio();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full px-4 pt-4">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white/10 backdrop-blur-[18px] border border-white/15 shadow-[0_18px_45px_rgba(0,0,0,0.35)] px-4 sm:px-6 py-2 sm:py-3">
        <div className="text-sm sm:text-base font-semibold text-white/90">
          {user ? (
            <span className="text-primary font-bold tracking-wide uppercase">
              {user.username}
            </span>
          ) : (
            <span className="text-white/70 tracking-wide uppercase">Monkey Mind Puzzle</span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="rounded"
            size="icon"
            className="text-[#3c1f0a]"
            onClick={toggleMute}
            title={isMuted ? 'Unmute music' : 'Mute music'}
            aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <ThemeToggle />
          <Button variant="red" size="sm" onClick={handleLogout} className="text-xs sm:text-sm px-5">
            Log Out
          </Button>
        </div>
      </div>
    </header>
  );
};
