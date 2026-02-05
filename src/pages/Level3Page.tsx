import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { LevelHeader } from '@/components/game/LevelHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { GameTimer } from '@/components/game/GameTimer';
import { ArrowRight, Mail, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const mailBlocks = [
  { id: 'salutation', content: 'Chère Madame Fatma,', order: 1 },
  { id: 'remerciement', content: 'Je vous remercie de votre invitation et je confirme ma présence à l\'entretien de stage PFE à TechTunis.', order: 2 },
  { id: 'disponibilite', content: 'Je reste disponible pour toute information complémentaire.', order: 3 },
  { id: 'signature', content: 'Respectueusement,', order: 4 },
];

export default function Level3Page() {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  
  const [blocks, setBlocks] = useState(() => 
    [...mailBlocks].sort(() => Math.random() - 0.5)
  );
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  // Prevent back navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      toast.warning('Vous ne pouvez pas revenir en arrière pendant le jeu');
    };
    
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (hasValidated) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const checkOrder = () => {
    const correctOrder = mailBlocks.map(b => b.id);
    const currentOrder = blocks.map(b => b.id);
    return correctOrder.every((id, index) => id === currentOrder[index]);
  };

  const handleValidate = () => {
    const correct = checkOrder();
    setIsCorrect(correct);
    setHasValidated(true);

    const totalScore = correct ? 20 : 0;
    completeLevel(3, totalScore);

    if (correct) {
      toast.success('Bravo ! Votre réponse est claire et professionnelle !');
      
      // 🔥 Lance l'audio
      setIsPlaying(true);
      setShowContinueButton(false);

      const fullText = blocks.map(b => b.content).join(' ');
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;

      utterance.onend = () => {
        setIsPlaying(false);
        setShowContinueButton(true); // Affiche le bouton après l'audio
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setShowContinueButton(true);
      };

      speechSynthesis.speak(utterance);
    } else {
      toast.error('L\'ordre n\'est pas correct.');
      setShowContinueButton(true); // Affiche directement le bouton si faux
    }
  };

  const handleContinue = () => {
    navigate('/niveau-4');
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress and Timer */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <ProgressBar currentLevel={3} completedLevels={[]} />
          </div>
          <div className="ml-4">
            <GameTimer />
          </div>
        </div>

        {/* Level Header */}
        <LevelHeader
          levelNumber={3}
          title="L'Invitation"
          objective="Savoir répondre correctement à un e-mail d'entretien, avec une formulation claire, polie et professionnelle."
        />

        {/* Email Context */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-md animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">Email reçu de TechTunis</h3>
              <p className="text-sm text-muted-foreground">De: fatma.benali@techtunis.tn</p>
            </div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-muted-foreground">
            <p className="mb-2">Bonjour,</p>
            <p className="mb-2">
              Suite à votre candidature pour un stage PFE, nous avons le plaisir de vous inviter à un entretien 
              dans nos locaux à Tunis le lundi 15 janvier 2025 à 10h00.
            </p>
            <p className="mb-2">
              Merci de confirmer votre présence.
            </p>
            <p>Cordialement,<br />Mme Fatma Ben Ali<br />Responsable RH - TechTunis</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-lg text-muted-foreground">
            Utilisez les flèches pour organiser un <span className="font-bold text-primary">mail de réponse professionnel</span>
          </p>
        </div>

        {/* Blocks with Up/Down buttons */}
        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-4 md:p-6 mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="space-y-3">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={cn(
                  "flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border-2 transition-all duration-300",
                  hasValidated && isCorrect
                    ? "border-success bg-success/5"
                    : hasValidated && !isCorrect
                    ? "border-destructive bg-destructive/5"
                    : "border-border bg-background"
                )}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="flex-1 text-foreground text-sm md:text-base">{block.content}</p>
                {!hasValidated && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        index === 0 
                          ? "text-muted-foreground/30 cursor-not-allowed" 
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                      )}
                      aria-label="Monter"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        index === blocks.length - 1 
                          ? "text-muted-foreground/30 cursor-not-allowed" 
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                      )}
                      aria-label="Descendre"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Validation */}
        {!hasValidated && (
          <div className="flex justify-center">
            <Button size="lg" onClick={handleValidate}>
              Valider l'ordre
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* 🔥 Affiche la bonne réponse SEULEMENT si faux */}
        {hasValidated && !isCorrect && (
          <div className="mt-6 p-4 bg-muted rounded-xl w-full max-w-2xl">
            <p className="font-medium text-muted-foreground mb-3">Bonne réponse :</p>
            <div className="space-y-2">
              {mailBlocks.map((block, index) => (
                <div 
                  key={block.id} 
                  className="p-3 rounded-lg bg-background border"
                >
                  <span className="text-xs font-bold text-muted-foreground mr-2">
                    {index + 1}.
                  </span>
                  {block.content}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔈 Indicateur d'attente pendant l'audio */}
        {hasValidated && isCorrect && isPlaying && (
          <div className="flex flex-col items-center gap-2 mt-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">😊 Lecture en cours…</p>
          </div>
        )}

        {/* ✅ Bouton "Passer" après audio (ou immédiatement si faux) */}
        {hasValidated && showContinueButton && (
          <div className="flex justify-center mt-6">
            <Button size="lg" variant="default" onClick={handleContinue}>
              Passer au niveau suivant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
