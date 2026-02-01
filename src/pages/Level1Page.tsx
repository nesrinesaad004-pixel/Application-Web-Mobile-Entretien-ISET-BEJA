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
  const { completeLevel } = useGame();
  
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

  // ✅ ÉTAPE 1 : Validation du domaine
  const handleValidateDomain = () => {
    const isCorrect = selectedDomain === 'C'; // seule option correcte
    setDomainCorrect(isCorrect);
    setDomainValidated(true);

    const domainScore = isCorrect ? 10 : 0;
    // On ne sauvegarde pas encore — on attend l'étape 2

    if (isCorrect) {
      toast.success("Excellent choix !");
      setTimeout(() => setStep(2), 1500);
    } else {
      toast.error("Mauvais choix. La bonne réponse vous sera affichée.");
      // Affiche la bonne réponse puis passe à l'étape 2 après 2s
      setTimeout(() => {
        setStep(2);
      }, 2000);
    }
  };

  // ✅ ÉTAPE 2 : Validation des valeurs
  const handleValidateValues = () => {
    if (selectedValues.length !== 4) {
      toast.error('Veuillez sélectionner exactement 4 valeurs');
      return;
    }

    const correctValues = valueOptions.filter(v => v.isCorrect).map(v => v.id);
    let score = 0;
    selectedValues.forEach(id => {
      if (correctValues.includes(id)) {
        score += 2.5;
      }
    });

    const valuesScore = score; // entre 0 et 10
    const domainScore = domainCorrect ? 10 : 0;
    const totalScore = domainScore + valuesScore;

    completeLevel(1, totalScore);

    // Affiche feedback
    if (totalScore === 20) {
      toast.success(`Félicitations ! ${totalScore}/20 points.`);
    } else if (totalScore >= 10) {
      toast.info(`Bon travail ! ${totalScore}/20 points.`);
    } else {
      toast.warning(`${totalScore}/20 points. Révisez l'entreprise.`);
    }

    // ➡️ Passe automatiquement au niveau 2 après 2s
    setTimeout(() => {
      navigate('/niveau-2');
    }, 2000);
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
            <br /><br />
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

            {!domainValidated && (
              <div className="flex justify-center">
                <Button size="lg" onClick={handleValidateDomain} disabled={!selectedDomain}>
                  Valider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Affiche la bonne réponse si faux */}
            {domainValidated && !domainCorrect && (
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium text-muted-foreground">Bonne réponse :</p>
                <p>C. Solutions ERP personnalisées et transformation digitale des PME tunisiennes</p>
              </div>
            )}
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

            {!valuesValidated && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleValidateValues}
                  disabled={selectedValues.length !== 4}
                >
                  Valider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Affiche les bonnes réponses après validation */}
            {valuesValidated && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="font-medium text-muted-foreground mb-2">Bonnes réponses :</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {valueOptions
                    .filter(v => v.isCorrect)
                    .map(v => (
                      <div key={v.id} className="flex items-center gap-1">
                        <span>✓</span> {v.label}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
