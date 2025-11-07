import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { JungleLayout } from '@/components/JungleLayout';
import { WoodenPanel } from '@/components/WoodenPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim().length === 0) {
      toast.error('Please enter a username');
      return;
    }

    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    login(username.trim());
    toast.success(`Welcome back, ${username}!`);
    navigate('/menu');
  };

  return (
    <JungleLayout>
      <div className="flex min-h-screen items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md space-y-10 animate-scale-in">
          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="cartoon-text text-4xl md:text-5xl font-extrabold">
              Login
            </h1>
            <p className="text-sm text-foreground/60">
              Welcome back
            </p>
          </div>

          {/* Login Form */}
          <WoodenPanel>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  autoFocus
                />
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back
                </Button>
              </div>
            </form>
          </WoodenPanel>
        </div>
      </div>
    </JungleLayout>
  );
};

export default LoginPage;
