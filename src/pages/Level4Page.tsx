import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { LevelHeader } from '@/components/game/LevelHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { GameTimer } from '@/components/game/GameTimer';
import { ArrowRight, CheckCircle2, Volume2, VolumeX, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
// Import new avatar images
import avatarProfessionnel from '@/assets/avatars/avatar-professionnel.jpg';
import avatarDecontracte from '@/assets/avatars/avatar-decontracte.jpg';
import avatarSportif from '@/assets/avatars/avatar-sportif.jpg';
import avatarCasual from '@/assets/avatars/avatar-casual.webp';

const avatars = [
  { id: 'casual', label: 'Casual', image: avatarCasual, isCorrect: false },
  { id: 'soigne', label: 'Soigné', image: avatarProfessionnel, isCorrect: true },
  { id: 'sportif', label: 'Sportif', image: avatarSportif, isCorrect: false },
  { id: 'decontracte', label: 'Décontracté', image: avatarDecontracte, isCorrect: false },
];

const getBasePitchBlocks = (prenom: string, nom: string, specialite: string) => [
  { id: 'salutation', content: 'Bonjour, merci de me recevoir aujourd\'hui.', order: 1 },
  { id: 'presentation', content: `Je m'appelle ${prenom} ${nom}, étudiant(e) en 3ème année ${specialite}.`, order: 2 },
  { id: 'motivation', content: 'Je suis passionné(e) par mon domaine et je souhaite mettre mes compétences au service de TechTunis.', order: 3 },
  { id: 'conclusion', content: 'Ce stage PFE représente pour moi une opportunité idéale de contribuer à des projets concrets.', order: 4 },
];

// Fisher-Yates shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Level4Page() {
  const navigate = useNavigate();
  const { gameState, completeLevel } = useGame();
  
  const prenom = gameState.studentInfo?.prenom || 'Prénom';
  const nom = gameState.studentInfo?.nom || 'Nom';
  const specialite = gameState.studentInfo?.specialite || 'Informatique';
  
  const pitchBlocks = useMemo(() => getBasePitchBlocks(prenom, nom, specialite), [prenom, nom, specialite]);
  
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [blocks, setBlocks] = useState(() => shuffleArray(pitchBlocks));
  const [hasValidated, setHasValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [avatarValidated, setAvatarValidated] = useState(false);
  const [avatarCorrect, setAvatarCorrect] = useState(false);

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

  const handleAvatarSelect = (id: string) => {
    setSelectedAvatar(id);
  };

  const handleAvatarConfirm = () => {
    if (!selectedAvatar) {
      toast.error('Veuillez sélectionner un avatar');
      return;
    }
    
    const selected = avatars.find(a => a.id === selectedAvatar);
    setAvatarValidated(true);
    
    if (selected?.isCorrect) {
      setAvatarCorrect(true);
      toast.success('Excellent choix ! +10 points');
    } else {
      setAvatarCorrect(false);
      toast.error('Cette tenue n\'est pas appropriée. 0 point.');
    }

    // 🔥 Toujours passer à l'étape 2 après validation
    setTimeout(() => setStep(2), 1500);
  };

  const handleAvatarRetry = () => {
    setSelectedAvatar(null);
    setAvatarValidated(false);
    setAvatarCorrect(false);
  };

  // Move block up or down using buttons (mobile-friendly)
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (hasValidated) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const checkOrder = () => {
    const correctOrder = pitchBlocks.map(b => b.id);
    const currentOrder = blocks.map(b => b.id);
    return correctOrder.every((id, index) => id === currentOrder[index]);
  };

  const handleValidate = () => {
    const correct = checkOrder();
    setIsCorrect(correct);
    setHasValidated(true);

    if (correct) {
      toast.success('Excellent ! Votre pitch est parfaitement structuré ! +10 points');
    } else {
      toast.error('L\'ordre n\'est pas optimal. Réessayez !');
    }
  };

  const handleRetry = () => {
    setBlocks(shuffleArray(pitchBlocks));
    setHasValidated(false);
    setIsCorrect(false);
  };
  const [isPlayingAndNavigating, setIsPlayingAndNavigating] = useState(false);

  // 🔥 NOUVELLE FONCTION : Calculer le score (10 + 10) et afficher un message
const handleContinue = () => {
  const avatarScore = avatarCorrect ? 10 : 0;
  const pitchScore = isCorrect ? 10 : 0;
  const totalScore = avatarScore + pitchScore;
  completeLevel(4, totalScore);
        if (totalScore === 20) {
      toast.success(`Excellent ! Vous avez obtenu ${totalScore}/20 points au niveau 4.`);
    } else {
      toast.warning(`Vous avez obtenu ${totalScore}/20 points au niveau 4. `);
    }
     setIsPlayingAndNavigating(true);

  // 🔥 Lance la lecture du pitch
  const pitchText = blocks.map(b => b.content).join(' ');
  const utterance = new SpeechSynthesisUtterance(pitchText);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.9;

  utterance.onend = () => {
    navigate('/niveau-5');
  };

  utterance.onerror = () => {
    setTimeout(() => navigate('/niveau-5'), 1000);
  };

  speechSynthesis.speak(utterance);
};

  const playPitchAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const pitchText = blocks.map(b => b.content).join(' ');
    const utterance = new SpeechSynthesisUtterance(pitchText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress and Timer */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <ProgressBar currentLevel={4} completedLevels={[]} />
          </div>
          <div className="ml-4">
            <GameTimer />
          </div>
        </div>

        {/* Level Header */}
        <LevelHeader
          levelNumber={4}
          title="L'Entretien"
          objective="Adopter une posture professionnelle et construire une présentation personnelle claire et structurée lors du début d'un entretien."
        />

        {/* Step 1: Avatar Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-display font-semibold text-foreground text-center mb-6">
              Choisissez votre avatar pour l'entretien
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => !avatarValidated && handleAvatarSelect(avatar.id)}
                  disabled={avatarValidated}
                  className={cn(
                    "game-card flex flex-col items-center gap-3 py-6 cursor-pointer transition-all",
                    selectedAvatar === avatar.id && !avatarValidated && "selected",
                    selectedAvatar === avatar.id && avatarValidated && avatarCorrect && "border-success bg-success/10",
                    selectedAvatar === avatar.id && avatarValidated && !avatarCorrect && "border-destructive bg-destructive/10",
                    avatarValidated && "cursor-not-allowed opacity-70",
                    avatarValidated && selectedAvatar === avatar.id && "opacity-100"
                  )}
                >
                  <img src={avatar.image} alt={avatar.label} className="w-20 h-20 rounded-full object-cover" />
                  <span className="font-medium text-foreground">{avatar.label}</span>
                  {avatarValidated && avatar.isCorrect && (
                    <span className="text-xs text-success font-medium">✓ Tenue soignée</span>
                  )}
                </button>
              ))}
            </div>

            {/* Avatar Validation Feedback */}
            {avatarValidated && !avatarCorrect && (
              <div className="text-center mb-6">
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4">
                  <p className="text-destructive font-medium">
                    Cette tenue n'est pas appropriée pour un entretien professionnel. Choisissez une tenue soignée.
                  </p>
                </div>
                <Button size="lg" variant="outline" onClick={handleAvatarRetry}>
                  Réessayer
                </Button>
              </div>
            )}

            {avatarValidated && avatarCorrect && (
              <div className="text-center mb-6">
                <div className="bg-success/10 border border-success/20 rounded-xl p-4">
                  <p className="text-success font-medium">
                    Excellent choix ! Une tenue soignée est essentielle pour faire bonne impression.
                  </p>
                </div>
              </div>
            )}

            {!avatarValidated && (
              <div className="flex justify-center">
                <Button size="lg" onClick={handleAvatarConfirm} disabled={!selectedAvatar}>
                  Confirmer mon avatar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Pitch Order with numbered buttons */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img 
                src={avatars.find(a => a.id === selectedAvatar)?.image} 
                alt="Avatar" 
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              />
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Construisez votre pitch de présentation
                </h2>
                <p className="text-muted-foreground">
                  Utilisez les flèches pour organiser les éléments
                </p>
              </div>
            </div>

            {/* Blocks with Up/Down buttons (mobile-friendly) */}
            <div className="bg-card border-2 border-dashed border-border rounded-2xl p-4 md:p-6 mb-8">
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
                    {/* Position number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    {/* Block content */}
                    <p className="flex-1 text-foreground text-sm md:text-base">{block.content}</p>
                    
                    {/* Up/Down buttons (always visible for mobile) */}
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

            

            {/* Validation / Actions */}
            <div className="flex flex-col items-center gap-4">
          {!hasValidated && (
            <Button size="lg" onClick={handleValidate}>
             Valider mon pitch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
                {hasValidated && !isCorrect && (
            <div className="text-center">
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4">
                <p className="text-destructive font-medium">
L'ordre n'est pas optimal. Commencez par la salutation, puis présentez-vous, expliquez votre motivation et concluez
                </p>
              </div>
              <Button size="lg" variant="outline" onClick={handleRetry}>
                Réessayer
              </Button>
            </div>
          )}

              {hasValidated && isCorrect && (
  <div className="text-center">
    <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-4">
      <p className="text-success font-medium">Excellent travail !</p>
    </div>

    {isPlayingAndNavigating ? (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
         😊 Veuillez patienter ➡️
        </p>
      </div>
    ) : (
      <Button size="lg" variant="success" onClick={handleContinue}>
        Passer au niveau suivant
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    )}
  </div>
)}


            </div>
          </div>
        )}
      </div>
    </div>
  );
}