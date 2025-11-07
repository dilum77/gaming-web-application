import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JungleLayout } from '@/components/JungleLayout';
import { WoodenPanel } from '@/components/WoodenPanel';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';

const HowToPlayPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <JungleLayout>
      <Header />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-8">
          {/* Title */}
          <div className="text-center space-y-3 animate-scale-in">
            <h1 className="cartoon-text text-4xl md:text-5xl font-extrabold">
              HOW TO PLAY
            </h1>
            <p className="text-sm text-foreground/60">
              Game Instructions
            </p>
          </div>

          {/* Instructions Panel */}
          <WoodenPanel>
            <div className="space-y-6">
              <div className="space-y-4 text-foreground">
                <div className="flex items-start gap-4 bg-card/60 rounded-xl p-5 border border-border/20 hover:bg-card/80 transition-all duration-200 animate-scale-in shadow-md" style={{ animationDelay: '0.05s' }}>
                  <span className="text-2xl flex-shrink-0">1️⃣</span>
                  <div>
                    <h3 className="font-bold text-base mb-2">Choose Difficulty</h3>
                    <p className="text-sm text-foreground/70">Easy (60s), Medium (45s), or Hard (30s). Higher difficulty = more points!</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-card/60 rounded-xl p-5 border border-border/20 hover:bg-card/80 transition-all duration-200 animate-scale-in shadow-md" style={{ animationDelay: '0.1s' }}>
                  <span className="text-2xl flex-shrink-0">2️⃣</span>
                  <div>
                    <h3 className="font-bold text-base mb-2">Race Against Time</h3>
                    <p className="text-sm text-foreground/70">Each puzzle has a timer. Answer fast to earn time bonuses!</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-card/60 rounded-xl p-5 border border-border/20 hover:bg-card/80 transition-all duration-200 animate-scale-in shadow-md" style={{ animationDelay: '0.15s' }}>
                  <span className="text-2xl flex-shrink-0">3️⃣</span>
                  <div>
                    <h3 className="font-bold text-base mb-2">Solve Puzzles</h3>
                    <p className="text-sm text-foreground/70">Look at the puzzle carefully and figure out the number answer.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-card/60 rounded-xl p-5 border border-border/20 hover:bg-card/80 transition-all duration-200 animate-scale-in shadow-md" style={{ animationDelay: '0.2s' }}>
                  <span className="text-2xl flex-shrink-0">4️⃣</span>
                  <div>
                    <h3 className="font-bold text-base mb-2">Earn Points</h3>
                    <p className="text-sm text-foreground/70">Base: 10 points + time bonus (seconds ÷ 2) × level multiplier.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-card/60 rounded-xl p-5 border border-border/20 hover:bg-card/80 transition-all duration-200 animate-scale-in shadow-md" style={{ animationDelay: '0.25s' }}>
                  <span className="text-2xl flex-shrink-0">5️⃣</span>
                  <div>
                    <h3 className="font-bold text-base mb-2">Climb the Leaderboard</h3>
                    <p className="text-sm text-foreground/70">Your scores are saved. Compete with others to reach the top!</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/20">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/menu')}
                >
                  Back to Menu
                </Button>
              </div>
            </div>
          </WoodenPanel>
        </div>
      </div>
    </JungleLayout>
  );
};

export default HowToPlayPage;
