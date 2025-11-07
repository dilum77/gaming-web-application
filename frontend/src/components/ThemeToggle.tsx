import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative w-11 h-11 p-0 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 bg-background/80 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/60"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 absolute text-orange-500" />
      <Moon className="h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 absolute text-blue-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

