import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useGame } from '@/context/GameContext';

export function GameTimer() {
  const { gameState } = useGame();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!gameState.startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameState.startTime!) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameState.startTime) return null;

  return (
    <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-xl">
      <Clock className="h-5 w-5 text-primary" />
      <span className="font-mono font-semibold text-foreground">{formatTime(elapsedTime)}</span>
    </div>
  );
}
