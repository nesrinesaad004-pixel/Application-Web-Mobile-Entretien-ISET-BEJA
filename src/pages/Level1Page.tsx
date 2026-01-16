import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { LevelHeader } from '@/components/game/LevelHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { GameTimer } from '@/components/game/GameTimer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const domainOptions = [
  { id: 'A', label: 'Sites e-commerce grand public', isCorrect: false },
  { id: 'B', label: 'Jeux vidéo', isCorrect: false },
  { id: 'C', label: 'Solutions ERP personnalisées et transformation digitale des PME tunisiennes', isCorrect: true },
  { id: 'D', label: 'Cybersécurité', isCorrect: false },
];

const valueOptions = [
  { id: 'innovation', label: 'Innovation', isCorrect: true },
  { id: 'competitivite', label: 'Compétitivité à tout prix', isCorrect: false },
  { id: 'rapidite', label: 'Rapidité avant qualité', isCorrect: false },
  { id: 'collaboration', label: 'Collaboration', isCorrect: true },
  { id: 'proximite', label: 'Proximité client', isCorrect: true },
  { id: 'travail-individuel', label: 'Travail 100% individuel', isCorrect: false },
  { id: 'standardisation', label: 'Standardisation maximale', isCorrect: false },
  { id: 'rigueur', label: 'Rigueur', isCorrect: true },
];

export default function Level1Page() {
  const navigate = useNavigate();
  const { gameState, setLevel2Domain, setLevel2Values, completeLevel } = useGame();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [domainValidated, setDomainValidated] = useState(false);
  const [valuesValidated, setValuesValidated] = useState(false);
  const [domainCorrect, setDomainCorrect] = useState(false);
  const [valuesCorrect, setValuesCorrect] = useState(false);

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

  const toggleValue = (id: string) => {
    if (valuesValidated) return;
    
    setSelectedValues((prev) => {
      if (prev.includes(id)) {
        return prev.filter((v) => v !== id);
      }
      if (prev.length >= 4) {
        toast.warning('Vous ne pouvez sélectionner que 4 valeurs');
        return prev;
      }
      return [...prev, id];
    });
  };

  // 🔥 CORRIGÉ : Passe toujours à l'étape 2 après validation
  const handleValidateDomain = () => {
    if (!selectedDomain) {
      toast.error('Veuillez sélectionner une réponse');
      return;
    }

    const correct = domainOptions.find((d) => d.id === selectedDomain)?.isCorrect || false;
    setDomainValidated(true);
    setDomainCorrect(correct);
    setLevel2Domain(selectedDomain);

    if (correct) {
      toast.success('Bonne réponse ! +10 points');
    } else {
      toast.error('Ce n\'est pas la bonne réponse. 0 point.');
    }

    // 🔥 Toujours passer à l'étape 2 après 1.5s, même en cas d'erreur
    setTimeout(() => setStep(2), 1500);
  };

  const handleValidateValues = () => {
    if (selectedValues.length !== 4) {
      toast.error('Veuillez sélectionner exactement 4 valeurs');
      return;
    }

    const correctValues = valueOptions.filter((v) => v.isCorrect).map((v) => v.id);
    const allCorrect = correctValues.every((v) => selectedValues.includes(v));

    setValuesValidated(true);
    setValuesCorrect(allCorrect);
    setLevel2Values(selectedValues);

    if (allCorrect) {
      toast.success('Excellent ! +10 points');
    } else {
      toast.error('Ce n\'est pas tout à fait correct. 0 point.');
    }
  };

  // 🔥 Affiche le score final et passe au niveau suivant
  const handleContinue = () => {
    const domainScore = domainCorrect ? 10 : 0;
    const valuesScore = valuesCorrect ? 10 : 0;
    const totalScore = domainScore + valuesScore;

    completeLevel(1, totalScore);

    // Message adapté au score
    if (totalScore === 20) {
      toast.success(`Félicitations ! Vous avez obtenu ${totalScore}/20 points au niveau 1.`);
    } else if (totalScore === 10) {
      toast.info(`Bon travail ! Vous avez obtenu ${totalScore}/20 points au niveau 1.`);
    } else {
      toast.warning(`Vous avez obtenu ${totalScore}/20 points au niveau 1. Révisez l'entreprise !`);
    }

    navigate('/niveau-2');
  };

  const handleRetryDomain = () => {
    setSelectedDomain('');
    setDomainValidated(false);
  };

  const handleRetryValues = () => {
    setSelectedValues([]);
    setValuesValidated(false);
  };

  return (
    <div className="h-screen bg-background px-4 py-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Progress and Timer */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
           <ProgressBar currentLevel={1} completedLevels={[]} />
          </div>
          <div className="ml-4">
            <GameTimer />
          </div>
        </div>

        {/* Level Header */}
        <LevelHeader
          levelNumber={1}
          title="L'Investigation"
          objective="Apprendre à analyser une entreprise, comprendre son domaine d'activité et identifier ses valeurs essentielles avant un entretien."
        />

        {/* Company Info Card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-md animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">TechTunis</h3>
              <p className="text-sm text-muted-foreground">Entreprise tunisienne • Créée en 2015 • Tunis</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            TechTunis est une entreprise tunisienne spécialisée dans les solutions ERP personnalisées et 
le développement web/mobile pour PME tunisiennes. Sa mission est de rendre la 
transformation digitale accessible et rentable pour les entreprises locales, en tenant compte 
de leurs besoins.

TechTunis se caractérise par l'utilisation de technologies modernes, le travail en équipe, la 
qualité du travail et la compréhension des besoins des entreprises.
          </p>
  
        </div>

        {/* Step 1: Domain Question */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">
              Étape 1 – Quel est le domaine d'activité principal de TechTunis ?
            </h2>
            
            <RadioGroup
              value={selectedDomain}
              onValueChange={setSelectedDomain}
              disabled={domainValidated}
              className="space-y-3 mb-6"
            >
              {domainOptions.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
                    selectedDomain === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50",
                    domainValidated && option.isCorrect && "border-success bg-success/5",
                    domainValidated && selectedDomain === option.id && !option.isCorrect && "border-destructive bg-destructive/5"
                  )}
                  onClick={() => !domainValidated && setSelectedDomain(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer font-medium">
                    {option.id}. {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-center gap-4">
              {!domainValidated && (
                <Button size="lg" onClick={handleValidateDomain} disabled={!selectedDomain}>
                  Valider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              {domainValidated && !domainCorrect && (
                <Button size="lg" variant="outline" onClick={handleRetryDomain}>
                  Réessayer
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Values Question */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">
              Étape 2 – Sélectionnez les 4 valeurs fondamentales de TechTunis
            </h2>
            
            <p className="text-muted-foreground mb-4">
              {selectedValues.length}/4 sélectionnées
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {valueOptions.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
                    selectedValues.includes(option.id)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50",
                    valuesValidated && option.isCorrect && selectedValues.includes(option.id) && "border-success bg-success/5",
                    valuesValidated && !option.isCorrect && selectedValues.includes(option.id) && "border-destructive bg-destructive/5"
                  )}
                  onClick={() => toggleValue(option.id)}
                >
                  <Checkbox
                    checked={selectedValues.includes(option.id)}
                    disabled={valuesValidated}
                  />
                  <Label className="flex-1 cursor-pointer font-medium">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4">
              {!valuesValidated && (
                <Button
                  size="lg"
                  onClick={handleValidateValues}
                  disabled={selectedValues.length !== 4}
                >
                  Valider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}

              {valuesValidated && !valuesCorrect && (
                <div className="text-center">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4">
                    <p className="text-destructive font-medium">
                      ❌ Réponse échoue.
                    </p>
                  </div>
                  <Button size="lg" variant="outline" onClick={handleRetryValues}>
                    Réessayer
                  </Button>
                </div>
              )}

              {valuesValidated && valuesCorrect && (
                <div className="text-center">
                  <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-4">
                    <p className="text-success font-medium">
                      Parfait ! Vous êtes prêt(e) pour votre entretien chez TechTunis.
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
        )}
      </div>
    </div>
  );
}