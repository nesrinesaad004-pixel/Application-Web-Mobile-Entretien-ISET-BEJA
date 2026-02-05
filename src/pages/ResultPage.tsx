import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Trophy,
  Star,
  RefreshCcw,
  CheckCircle,
  Clock,
  User,
  Mail,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ResultPage() {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGame();
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selfEvaluation, setSelfEvaluation] = useState<string | null>(null);
  const [difficulties, setDifficulties] = useState<string[]>([]);

  // 🔥 Calcul CORRECT du score total
  const totalScore = [1, 2, 3, 4, 5]
    .map(level => gameState.levelScores[level] || 0)
    .reduce((a, b) => a + b, 0);
  const score = totalScore;

  const durationSeconds = gameState.startTime
    ? Math.round((Date.now() - gameState.startTime) / 1000)
    : 0;

  const formatDurationText = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} seconde${secs > 1 ? 's' : ''}`;
    if (secs === 0) return `${mins} minute${mins > 1 ? 's' : ''}`;
    return `${mins} minute${mins > 1 ? 's' : ''} et ${secs} seconde${secs > 1 ? 's' : ''}`;
  };

  const levelResults = [
    { level: 1, title: "L'Investigation", score: gameState.levelScores[1] || 0 },
    { level: 2, title: "Le Bilan de Soi", score: gameState.levelScores[2] || 0 },
    { level: 3, title: "L'Invitation", score: gameState.levelScores[3] || 0 },
    { level: 4, title: "L'Entretien", score: gameState.levelScores[4] || 0 },
    { level: 5, title: "Répondre efficacement", score: gameState.levelScores[5] || 0 },
  ];

  // Auto-évaluation locale (affichée à l'écran seulement)
  const difficultyOptions = [
    { id: 'investigation', label: "L'Investigation" },
    { id: 'bilan', label: 'Le Bilan de Soi' },
    { id: 'invitation', label: "L'Invitation" },
    { id: 'entretien', label: "L'Entretien" },
    { id: 'crise', label: 'Répondre efficacement' },
  ];

  const toggleDifficulty = (id: string) => {
    setDifficulties(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  const getScoreMessage = () => {
    if (score === 100) return { title: "Félicitations !", message: "Vous êtes prêt(e) pour votre entretien !", emoji: "🎉" };
    if (score >= 80) return { title: "Excellent travail !", message: "Vous avez très bien compris les bases.", emoji: "⭐" };
    if (score >= 60) return { title: "Bon travail !", message: "Continuez à vous entraîner.", emoji: "👍" };
    return { title: "Courage !", message: "La pratique mène à la perfection.", emoji: "💪" };
  };

  const scoreInfo = getScoreMessage();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-success shadow-lg mb-4">
            <Trophy className="h-10 w-10 text-success-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            {scoreInfo.title} {scoreInfo.emoji}
          </h1>
          <p className="text-muted-foreground">{scoreInfo.message}</p>
        </div>

        {/* Score Card */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-lg animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="text-center mb-6">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${score * 3.52} 352`}
                  className="text-success transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-4xl font-display font-bold text-foreground">
                {score}%
              </span>
            </div>
            <p className="text-muted-foreground mt-4">Score final</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted rounded-xl p-4 text-center">
              <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground font-mono">
                {Math.floor(durationSeconds / 60)}:{(durationSeconds % 60).toString().padStart(2, '0')}
              </p>
              <p className="text-sm text-muted-foreground">Temps total</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <Star className="h-6 w-6 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalScore}/100</p>
              <p className="text-sm text-muted-foreground">Niveaux complétés</p>
            </div>
          </div>

          {/* Student Info */}
          {gameState.studentInfo && (
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold text-foreground">
                  {gameState.studentInfo.prenom} {gameState.studentInfo.nom}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {gameState.studentInfo.niveau} • {gameState.studentInfo.specialite} • {gameState.studentInfo.groupe}
              </p>
            </div>
          )}

          {/* Level Results */}
          <h3 className="font-display font-semibold text-foreground mb-4">Progression par niveau</h3>
          <div className="space-y-3">
            {levelResults.map((result) => (
              <div
                key={result.level}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border",
                  result.score >= 20
                    ? "border-success/20 bg-success/5"
                    : "border-border bg-background"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      result.score >= 20
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {result.score >= 20 ? <CheckCircle className="h-4 w-4" /> : result.level}
                  </div>
                  <span className={cn(
                    "font-medium",
                    result.score >= 20 ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {result.title}
                  </span>
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  result.score >= 20 ? "text-success" : "text-muted-foreground"
                )}>
                  {result.score >= 20 ? "Complété" : "Non complété"}
                </span>
              </div>
            ))}
          </div>
        </div>

       

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button size="lg" variant="outline" onClick={handleRestart}>
            <RefreshCcw className="mr-2 h-5 w-5" />
            Recommencer
          </Button>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Bravo pour avoir terminé la simulation d'entretien !
        </p>
      </div>
    </div>
  );
}
