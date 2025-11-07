import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JungleLayout } from '@/components/JungleLayout';
import { WoodenPanel } from '@/components/WoodenPanel';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

interface LeaderboardEntry {
  username: string;
  score: number;
  level: string;
  date: string;
}

const HighScoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadLeaderboard = () => {
      const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');
      setLeaderboard(data);
    };
    loadLeaderboard();
  }, []);

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getLevelEmoji = (level: string) => {
    if (level === 'Easy') return '🍌';
    if (level === 'Medium') return '🐵';
    if (level === 'Hard') return '🔥';
    return '🎯';
  };

  return (
    <JungleLayout>
      <Header />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <div className="w-full max-w-5xl space-y-8">
          {/* Title */}
          <div className="text-center space-y-3 animate-scale-in">
            <h1 className="cartoon-text text-4xl md:text-5xl font-extrabold">
              LEADERBOARD
            </h1>
            <p className="text-sm text-foreground/60">
              Top Players
            </p>
          </div>

          {/* Leaderboard Panel */}
          <WoodenPanel>
            <div className="space-y-8">
              {leaderboard.length === 0 ? (
                <div className="text-center space-y-6 py-12 animate-scale-in">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      No Scores Yet
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Be the first to play
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => navigate('/game')}
                  >
                    Start Playing
                  </Button>
                </div>
              ) : (
                <>
                  {/* Top 3 Podium */}
                  {leaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4 mb-8 animate-scale-in">
                      {/* 2nd Place */}
                      <div className="text-center space-y-3 mt-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                        <div className="text-3xl">🥈</div>
                        <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/20 shadow-md">
                          <p className="font-bold text-sm truncate">{leaderboard[1].username}</p>
                          <p className="text-primary text-xl font-bold mt-2">{leaderboard[1].score}</p>
                          <p className="text-xs text-foreground/60 mt-2">
                            {leaderboard[1].level}
                          </p>
                        </div>
                      </div>

                      {/* 1st Place */}
                      <div className="text-center space-y-3 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                        <div className="text-4xl">🥇</div>
                        <div className="bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-xl p-5 border border-primary/30 shadow-lg">
                          <p className="font-bold text-base truncate">{leaderboard[0].username}</p>
                          <p className="text-primary text-2xl font-bold mt-2">{leaderboard[0].score}</p>
                          <p className="text-xs text-foreground/60 mt-2">
                            {leaderboard[0].level}
                          </p>
                        </div>
                      </div>

                      {/* 3rd Place */}
                      <div className="text-center space-y-3 mt-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
                        <div className="text-3xl">🥉</div>
                        <div className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/20 shadow-md">
                          <p className="font-bold text-sm truncate">{leaderboard[2].username}</p>
                          <p className="text-primary text-xl font-bold mt-2">{leaderboard[2].score}</p>
                          <p className="text-xs text-foreground/60 mt-2">
                            {leaderboard[2].level}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Full Leaderboard Table */}
                  <div className="bg-card/60 backdrop-blur-sm rounded-xl overflow-hidden border border-border/20 animate-scale-in shadow-lg">
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                      <table className="w-full">
                        <thead className="bg-card/80 sticky top-0 backdrop-blur-sm border-b border-border/20">
                          <tr>
                            <th className="px-4 md:px-6 py-4 text-left font-semibold text-foreground text-xs">Rank</th>
                            <th className="px-4 md:px-6 py-4 text-left font-semibold text-foreground text-xs">Player</th>
                            <th className="px-4 md:px-6 py-4 text-center font-semibold text-foreground text-xs">Score</th>
                            <th className="px-4 md:px-6 py-4 text-center font-semibold text-foreground text-xs">Level</th>
                            <th className="px-4 md:px-6 py-4 text-center font-semibold text-foreground text-xs">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map((entry, index) => (
                            <tr 
                              key={index}
                              className={`border-t border-border/10 transition-all duration-200 ${
                                entry.username === username 
                                  ? 'bg-primary/10' 
                                  : 'hover:bg-accent/5'
                              }`}
                            >
                              <td className="px-4 md:px-6 py-4 text-sm font-bold">
                                {getMedalEmoji(index)}
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <span className={`font-medium text-sm ${
                                  entry.username === username ? 'text-primary' : ''
                                }`}>
                                  {entry.username}
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-center">
                                <span className="text-primary font-bold text-base">{entry.score}</span>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-center">
                                <span className="font-medium text-xs text-foreground/70">
                                  {entry.level}
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-4 text-center text-xs text-foreground/50">
                                {formatDate(entry.date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/20">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/game')}
                >
                  Play Game
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/menu')}
                >
                  Back
                </Button>
              </div>
            </div>
          </WoodenPanel>
        </div>
      </div>
    </JungleLayout>
  );
};

export default HighScoresPage;
