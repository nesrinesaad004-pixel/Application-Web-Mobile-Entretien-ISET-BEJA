
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { LevelHeader } from '@/components/game/LevelHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { GameTimer } from '@/components/game/GameTimer';
import { QualityCard } from '@/components/game/QualityCard';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
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
  const { gameState, setLevel1Choices, completeLevel } = useGame();
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

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

    const correctQualities = qualities.filter((q) => q.isCorrect).map((q) => q.id);
    const allCorrect = correctQualities.every((q) => selectedQualities.includes(q));

    setHasValidated(true);
    setIsCorrect(allCorrect);
    setLevel1Choices(selectedQualities);

    if (allCorrect) {
      toast.success('Bravo ! Vous avez identifié les 4 qualités essentielles ! +20 points');
    } else {
      // 🔥 Pas de révélation des bonnes réponses
      toast.error('Ce n\'est pas tout à fait correct. Réessayez !');
    }
  };

  // 🔥 NOUVELLE FONCTION : Calculer le score et afficher un message
  const handleContinue = () => {
    const totalScore = isCorrect ? 20 : 0; // 🔥 Niveau 2 = tout ou rien (20 ou 0)
    completeLevel(2, totalScore);

    if (totalScore === 20) {
      toast.success(`Excellent ! Vous avez obtenu ${totalScore}/20 points au niveau 2.`);
    } else {
      toast.warning(`Vous avez obtenu ${totalScore}/20 points au niveau 2. Révisez vos qualités !`);
    }

    navigate('/niveau-3');
  };

  const handleRetry = () => {
    setSelectedQualities([]);
    setHasValidated(false);
    setIsCorrect(false);
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

        {/* Context text from PDF */}
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

        {/* Validation / Feedback */}
        <div className="flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '700ms' }}>
          {!hasValidated && (
            <Button
              size="lg"
              onClick={handleValidate}
              disabled={selectedQualities.length !== 4}
            >
              Valider ma sélection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {hasValidated && !isCorrect && (
            <div className="text-center">
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4">
                <p className="text-destructive font-medium">
                  Ce n'est pas tout à fait correct. Réessayez !
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
                <p className="text-success font-medium">
                  Excellent ! Vous avez correctement identifié les qualités essentielles pour un stage PFE.
                </p>
              </div>
              <Button size="lg" variant="success" onClick={handleContinue}>
                Passer au niveau suivant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
