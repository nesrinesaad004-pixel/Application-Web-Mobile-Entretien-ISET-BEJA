import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { LevelHeader } from '@/components/game/LevelHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { GameTimer } from '@/components/game/GameTimer';
import { QualityCard } from '@/components/game/QualityCard';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Import quality images
import rigueurImg from '@/assets/qualities/rigueur.png';
import curiositeImg from '@/assets/qualities/curiosite.png';
import espritEquipeImg from '@/assets/qualities/esprit-equipe.png';
import autonomieImg from '@/assets/qualities/autonomie.png';
import ponctualiteImg from '@/assets/qualities/ponctualite.png';
import patienceImg from '@/assets/qualities/patience.png';
import humourImg from '@/assets/qualities/humour.png';
import competitiviteImg from '@/assets/qualities/competitivite.png';

const baseQualities = [
  { id: 'rigueur', label: 'Rigueur', isCorrect: true, image: rigueurImg },
  { id: 'curiosite', label: 'Curiosité', isCorrect: true, image: curiositeImg },
  { id: 'esprit-equipe', label: "Esprit d'équipe", isCorrect: true, image: espritEquipeImg },
  { id: 'autonomie', label: 'Autonomie', isCorrect: true, image: autonomieImg },
  { id: 'ponctualite', label: 'Ponctualité', isCorrect: false, image: ponctualiteImg },
  { id: 'patience', label: 'Patience', isCorrect: false, image: patienceImg },
  { id: 'humour', label: "Sens de l'humour", isCorrect: false, image: humourImg },
  { id: 'competitivite', label: 'Compétitivité', isCorrect: false, image: competitiviteImg },
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

export default function Level2Page() {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Shuffle qualities once on mount
  const qualities = useMemo(() => shuffleArray(baseQualities), []);

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

  const toggleQuality = (id: string) => {
    if (hasValidated) return;
    
    setSelectedQualities((prev) => {
      if (prev.includes(id)) {
        return prev.filter((q) => q !== id);
      }
      if (prev.length >= 4) {
        toast.warning('Vous ne pouvez sélectionner que 4 qualités');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleValidate = () => {
    if (selectedQualities.length !== 4) {
      toast.error('Veuillez sélectionner exactement 4 qualités');
      return;
    }

    // Calcul du score : +5 / -5, mais on sauvegarde le score réel (0 min)
    let calculatedScore = 0;
    selectedQualities.forEach(id => {
      const quality = baseQualities.find(q => q.id === id);
      if (quality) {
        if (quality.isCorrect) {
          calculatedScore += 5;
        } else {
          calculatedScore -= 5;
        }
      }
    });

    const totalScore = Math.max(0, calculatedScore); // min 0
    setScore(totalScore);

    // Vérifie si toutes les 4 sont correctes
    const correctIds = baseQualities.filter(q => q.isCorrect).map(q => q.id);
    const allCorrect = correctIds.every(id => selectedQualities.includes(id));

    setIsCorrect(allCorrect);
    setHasValidated(true);
    completeLevel(2, totalScore);

    if (allCorrect) {
      toast.success('Excellent ! Vous avez identifié les 4 qualités essentielles ! +20 points');
    } else {
      toast.error('Ce n\'est pas tout à fait correct.');
    }
  };

  const handleContinueToNextLevel = () => {
    navigate('/niveau-3');
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress and Timer */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <ProgressBar currentLevel={2} completedLevels={[]} />
          </div>
          <div className="ml-4">
            <GameTimer />
          </div>
        </div>

        {/* Level Header */}
        <LevelHeader
          levelNumber={2}
          title="Le Bilan de Soi"
          objective="Identifier ses qualités personnelles les plus importantes pour réussir un stage PFE."
          character="Mme Fatma (RH) vous demande une auto-évaluation..."
        />

        {/* Context text */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Pour réussir chez TechTunis, vous devez avoir une grande précision dans l'exécution des tâches et une volonté constante de s'informer pour progresser. 
            Votre succès au sein de notre société reposera également sur votre aisance collaborative et votre capacité à faire preuve d'initiative pour agir avec indépendance.
          </p>
          <p className="text-muted-foreground text-sm mt-2 font-medium">
            Parmi ces 8 qualités, Mme Fatma (RH) vous demande de sélectionner les 4 qualités les plus importantes pour un stage PFE chez TechTunis.
          </p>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-lg text-muted-foreground">
            Sélectionnez exactement <span className="font-bold text-primary">4 qualités</span> parmi les 8 proposées
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {selectedQualities.length}/4 sélectionnées
          </p>
        </div>

        {/* Quality Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {qualities.map((quality, index) => (
            <QualityCard
              key={quality.id}
              id={quality.id}
              label={quality.label}
              image={quality.image}
              isSelected={selectedQualities.includes(quality.id)}
              onToggle={toggleQuality}
              disabled={hasValidated}
              animationDelay={300 + index * 50}
            />
          ))}
        </div>

        {/* Validation */}
        {!hasValidated && (
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '700ms' }}>
            <Button
              size="lg"
              onClick={handleValidate}
              disabled={selectedQualities.length !== 4}
            >
              Valider ma sélection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* 🔥 Affichage des bonnes réponses SEULEMENT si faux */}
        {hasValidated && !isCorrect && (
          <div className="mt-6 p-4 bg-muted rounded-xl animate-fade-in">
            <p className="font-medium text-muted-foreground mb-3">Bonnes réponses :</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {baseQualities.map(quality => {
                const isSelected = selectedQualities.includes(quality.id);
                const isCorrect = quality.isCorrect;

                return (
                  <div
                    key={quality.id}
                    className={`p-3 rounded-lg text-center ${
                      isCorrect && isSelected
                        ? 'bg-green-100 border border-green-300'
                        : isCorrect && !isSelected
                          ? 'bg-green-50 text-green-800'
                          : !isCorrect && isSelected
                            ? 'bg-red-100 border border-red-300'
                            : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <div className="font-medium text-xs mb-1">{quality.label}</div>
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ✅ Bouton "Passer à l’étape suivante" après validation */}
        {hasValidated && (
          <div className="flex justify-center mt-6">
            <Button
              size="lg"
              variant="default"
              onClick={handleContinueToNextLevel}
            >
              Passer à l’étape suivante
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
