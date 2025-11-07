import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { JungleLayout } from '@/components/JungleLayout';
import { WoodenPanel } from '@/components/WoodenPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import bananaApi, { PuzzleData } from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface LevelConfig {
  label: string;
  time: number;
  pointsMultiplier: number;
  emoji: string;
}

const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  easy: { label: 'Easy', time: 60, pointsMultiplier: 1, emoji: '🍌' },
  medium: { label: 'Medium', time: 45, pointsMultiplier: 1.5, emoji: '🐵' },
  hard: { label: 'Hard', time: 30, pointsMultiplier: 2, emoji: '🔥' }
};

const GamePage: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
  const [showVictoryVideo, setShowVictoryVideo] = useState(false);
  const [finalGameScore, setFinalGameScore] = useState(0);
  const { username } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isTimerActive && timeRemaining === 0) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerActive, timeRemaining]);

  const handleLevelSelect = (level: DifficultyLevel) => {
    setSelectedLevel(level);
    setScore(0);
    loadNewPuzzle(level);
  };

  const loadNewPuzzle = async (level?: DifficultyLevel) => {
    const currentLevel = level || selectedLevel;
    if (!currentLevel) return;

    setLoading(true);
    setIsTimerActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    try {
      const newPuzzle = await bananaApi.getPuzzle();
      setPuzzle(newPuzzle);
      setGuess('');
      setTimeRemaining(LEVEL_CONFIG[currentLevel].time);
      setLoading(false);
      setIsTimerActive(true);
    } catch (error) {
      toast.error('Failed to load puzzle. Please try again.');
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    setShowTimeoutDialog(true);
  };

  const handleTryAgain = () => {
    setShowTimeoutDialog(false);
    loadNewPuzzle();
  };

  const handleQuit = () => {
    setShowTimeoutDialog(false);
    handleBackToMenu();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!puzzle || !selectedLevel) return;
    
    const userGuess = parseInt(guess);
    
    if (isNaN(userGuess)) {
      toast.error('Please enter a valid number');
      return;
    }

    const isCorrect = bananaApi.checkAnswer(userGuess, puzzle.solution);

    if (isCorrect) {
      setIsTimerActive(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      
      const levelConfig = LEVEL_CONFIG[selectedLevel];
      const basePoints = 10;
      const timeBonus = Math.floor(timeRemaining / 2);
      const earnedPoints = Math.floor((basePoints + timeBonus) * levelConfig.pointsMultiplier);
      const newScore = score + earnedPoints;
      
      setScore(newScore);
      toast.success(`🎉 Correct! +${earnedPoints} points! (Time bonus: ${timeBonus}) Score: ${newScore}`);
      
      setTimeout(() => {
        loadNewPuzzle();
      }, 1500);
    } else {
      toast.error('Wrong answer! Try again! 🐵');
    }
  };

  const saveToLeaderboard = (finalScore: number) => {
    if (finalScore === 0 || !selectedLevel || !username) return;

    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    
    const newEntry = {
      username,
      score: finalScore,
      level: LEVEL_CONFIG[selectedLevel].label,
      date: new Date().toISOString(),
    };

    leaderboardData.push(newEntry);
    leaderboardData.sort((a: any, b: any) => b.score - a.score);
    const topScores = leaderboardData.slice(0, 20); // Keep top 20 scores
    
    localStorage.setItem('leaderboard', JSON.stringify(topScores));
  };

  const handleBackToMenu = () => {
    setIsTimerActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (score > 0) {
      saveToLeaderboard(score);
      setFinalGameScore(score);
      // Show victory video if score is decent (30+ points means at least 3 correct answers on easy)
      if (score >= 30) {
        setShowVictoryVideo(true);
      } else {
        toast.success(`Game Over! Final Score: ${score} 🏆`);
        navigate('/menu');
      }
    } else {
      navigate('/menu');
    }
  };

  const handleVictoryVideoEnd = () => {
    setShowVictoryVideo(false);
    toast.success(`Game Over! Final Score: ${finalGameScore} 🏆`);
    navigate('/menu');
  };

  const getTimerColor = () => {
    if (!selectedLevel) return 'text-foreground';
    const maxTime = LEVEL_CONFIG[selectedLevel].time;
    const percentage = (timeRemaining / maxTime) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600 animate-pulse';
  };

  return (
    <JungleLayout>
      <Header />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          {/* Title and Score */}
          <div className="text-center space-y-4 animate-scale-in">
            <h1 className="cartoon-text text-3xl md:text-4xl font-extrabold">BANANA BEAST</h1>
            {selectedLevel && (
              <div className="flex flex-wrap justify-center gap-3 text-sm items-center">
                <div className="bg-card/60 backdrop-blur-sm rounded-xl px-5 py-2.5 border border-border/20 shadow-md">
                  <span className="text-foreground font-medium">
                    {LEVEL_CONFIG[selectedLevel].label}
                  </span>
                </div>
                <div className="bg-card/60 backdrop-blur-sm rounded-xl px-5 py-2.5 border border-border/20 shadow-md">
                  <span className="text-foreground font-medium">
                    Score: <span className="text-primary font-bold">{score}</span>
                  </span>
                </div>
                <div className={`${getTimerColor()} bg-card/60 backdrop-blur-sm rounded-xl px-5 py-2.5 border ${timeRemaining <= 10 ? 'animate-pulse border-red-500/50' : 'border-border/20'} font-bold shadow-md`}>
                  {timeRemaining}s
                </div>
              </div>
            )}
          </div>

          {/* Level Selection or Game Panel */}
          {!selectedLevel ? (
            <WoodenPanel className="min-h-[400px]">
              <div className="space-y-8">
                <div className="text-center space-y-3 animate-scale-in">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Select Difficulty
                  </h2>
                  <p className="text-sm text-foreground/60">
                    Higher difficulty = More points
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(LEVEL_CONFIG) as DifficultyLevel[]).map((level, index) => {
                    const config = LEVEL_CONFIG[level];
                    return (
                      <div
                        key={level}
                        className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border/20 hover:border-primary/50 transition-all duration-200 cursor-pointer hover:bg-card/80 group animate-scale-in shadow-md hover:shadow-lg"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleLevelSelect(level)}
                      >
                        <div className="text-center space-y-4">
                          <h3 className="text-xl font-bold text-foreground">
                            {config.label}
                          </h3>
                          <div className="space-y-2 text-sm text-foreground/70">
                            <p>{config.time}s</p>
                            <p>{config.pointsMultiplier}x Points</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            Select
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-6 border-t border-border/20">
                  <Button variant="ghost" onClick={() => navigate('/menu')}>
                    Back to Menu
                  </Button>
                </div>
              </div>
            </WoodenPanel>
          ) : (
            <WoodenPanel className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-base font-medium text-foreground/60 animate-pulse">
                  Loading puzzle...
                </p>
              </div>
            ) : puzzle ? (
              <div className="space-y-6 animate-scale-in">
                {/* Puzzle Image/Question */}
                <div className="bg-card/60 backdrop-blur-sm rounded-xl p-8 min-h-[250px] flex items-center justify-center border border-border/20 shadow-lg">
                  {puzzle.question.startsWith('http') ? (
                    <img 
                      src={puzzle.question} 
                      alt="Puzzle" 
                      className="max-w-full max-h-[300px] object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Puzzle+Loading...';
                      }}
                    />
                  ) : (
                    <p className="text-xl md:text-2xl font-semibold text-center text-foreground">{puzzle.question}</p>
                  )}
                </div>

                {/* Answer Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3">
                    <label className="text-foreground font-medium text-sm block text-center">
                      Your Answer
                    </label>
                    <Input
                      type="number"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="Enter number..."
                      className="h-14 text-xl text-center font-semibold"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      className="w-full"
                      disabled={!isTimerActive}
                    >
                      Submit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={handleBackToMenu}
                    >
                      End Game
                    </Button>
                  </div>
                </form>

                <div className="flex justify-center pt-4 border-t border-border/20">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsTimerActive(false);
                      if (timerRef.current) clearTimeout(timerRef.current);
                      if (score > 0) saveToLeaderboard(score);
                      setSelectedLevel(null);
                      setScore(0);
                    }}
                  >
                    Change Level
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-base font-medium text-foreground/60">
                  Failed to load puzzle
                </p>
                <Button variant="default" size="sm" onClick={() => loadNewPuzzle()}>
                  Try Again
                </Button>
              </div>
            )}
            </WoodenPanel>
          )}
        </div>
      </div>

      {/* Timeout Alert Dialog */}
      <AlertDialog open={showTimeoutDialog} onOpenChange={setShowTimeoutDialog}>
        <AlertDialogContent className="glass-panel border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-center text-foreground">
              Time's Up!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-foreground/70 pt-2">
              Your time has expired for this puzzle
              <span className="text-base font-bold text-primary mt-3 block">
                Current Score: {score}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <AlertDialogCancel 
              onClick={handleQuit}
              className="w-full sm:w-auto bg-destructive/90 hover:bg-destructive text-white border-white/10"
            >
              Quit
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleTryAgain}
              className="w-full sm:w-auto bg-primary/90 hover:bg-primary text-white border-white/10"
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Victory Video Overlay */}
      {showVictoryVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative w-full h-full">
            <video
              autoPlay
              muted
              playsInline
              onEnded={handleVictoryVideoEnd}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/Won.mp4" type="video/mp4" />
            </video>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
              <div className="glass-panel px-8 py-5 border-primary/50 shadow-2xl">
                <p className="text-3xl md:text-4xl font-bold text-primary text-center">
                  Victory!
                </p>
                <p className="text-xl md:text-2xl font-semibold text-foreground text-center mt-2">
                  Score: {finalGameScore}
                </p>
              </div>
            </div>
            <button
              onClick={handleVictoryVideoEnd}
              className="absolute bottom-8 right-8 glass-panel text-foreground px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 border-border/20 shadow-lg"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </JungleLayout>
  );
};

export default GamePage;
