import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { JungleLayout } from '@/components/JungleLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim().length === 0) {
      toast.error('Please enter a username');
      return;
    }

    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login(username.trim(), password);

      if (response.success) {
        toast.success(`Welcome back, ${response.data?.user.username}!`);
        navigate('/menu');
      } else {
        toast.error(response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unable to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="relative w-full max-w-lg rounded-[28px] bg-white/10 backdrop-blur-[18px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.35)] px-12 py-14 md:px-14 md:py-16">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold tracking-wide text-white/90">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 bg-white/90 text-black placeholder:text-black/60 focus-visible:ring-white"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold tracking-wide text-white/90">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white/90 text-black placeholder:text-black/60 focus-visible:ring-white"
                />
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </JungleLayout>
  );
};

export default LoginPage;
