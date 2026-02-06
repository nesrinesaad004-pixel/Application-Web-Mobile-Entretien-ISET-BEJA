import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { LevelHeader } from '@/components/game/LevelHeader';
import { ProgressBar } from '@/components/game/ProgressBar';
import { GameTimer } from '@/components/game/GameTimer';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// ✅ 8 questions — avec corrections sur q6 et q7
const scenarios = [
    {
    id: 'q1',
    question: 'Vous envisagez plusieurs sujets de Projet de Fin d’Études. Comment procédez-vous pour faire un choix pertinent avant de démarrer votre stage chez nous ?',
    options: [
      { id: 'a', label: 'Je compare les sujets en fonction de mes compétences actuelles, de ce que je peux apprendre et du temps disponible pour le PFE.', isCorrect: true },
      { id: 'b', label: 'Je choisis le sujet qui paraît le plus impressionnant, même si je ne le maîtrise pas encore', isCorrect: false },
      { id: 'c', label: 'Je prends le même sujet que mes camarades pour éviter les difficultés.', isCorrect: false },
      { id: 'd', label: 'J’échange avec mon encadrant afin d’évaluer la faisabilité du sujet et son intérêt professionnel.', isCorrect: true },
      { id: 'e', label: 'Je choisis rapidement un sujet pour aller plus vite, sans analyse approfondie.', isCorrect: false },
    ],
    multipleAnswers: true, // ✅ CORRIGÉ
  },
    {
    id: 'q2',
    question: 'Quels critères prenez-vous en compte pour juger qu’un sujet de PFE est pertinent et intéressant pour un stage en entreprise ?',
    options: [
      { id: 'a', label: 'L’adéquation du sujet avec ma spécialité et mon projet professionnel.', isCorrect: true },
      { id: 'b', label: 'Le fait que le sujet soit très à la mode, même si je ne le maîtrise pas bien.', isCorrect: false },
      { id: 'c', label: 'La faisabilité du sujet dans le temps imparti du PFE.', isCorrect: true },
      { id: 'd', label: 'Le nombre d’étudiants ayant déjà choisi le même sujet.', isCorrect: false },
      { id: 'e', label: 'La possibilité de valoriser ce sujet lors d’un entretien ou sur mon CV.', isCorrect: true },
    ],
    multipleAnswers: true, // ✅ CORRIGÉ
  },
   {
    id: 'q3',
    question: 'Dans le cadre de votre Projet de Fin d’Études, comment envisagez-vous l’utilisation de l’intelligence artificielle ?',
    options: [
      { id: 'a', label: 'L’IA réalisera la majorité du travail technique à ma place', isCorrect: false },
      { id: 'b', label: 'Je préfère ne pas utiliser l’IA pour éviter tout risque', isCorrect: false },
      { id: 'c', label: 'J’utilise l’IA comme outil d’aide à la réflexion et à la recherche, tout en restant responsable de mon travail', isCorrect: true },
      { id: 'd', label: 'Je travaille seul et je n’intègre ni l’IA ni les recommandations de mon encadrant.', isCorrect: false },
    ],
    multipleAnswers: false,
  },
  {
    id: 'q4',
    question: 'Que faites-vous si votre supérieur vous confie une tâche urgente avant le week-end ?',
    options: [
      { id: 'a', label: 'Je vérifie le degré réel d\'urgence et je réorganise mes priorités pour la terminer avant de partir.', isCorrect: true },
      { id: 'b', label: 'Je refuse poliment en expliquant que c\'est le week-end et que je ne suis pas payé pour faire des heures supp.', isCorrect: false },
      { id: 'c', label: 'J\'accepte sans poser de questions et je reste jusqu\'à minuit pour la finir, même si je suis épuisé.', isCorrect: false },
      { id: 'd', label: 'Je clarifie les attentes, l\'échéance exacte et je propose un plan réaliste (éventuellement finir lundi matin si ce n\'est pas critique).', isCorrect: true },
    ],
    multipleAnswers: true,
  },
  {
    id: 'q5',
    question: 'Comment réagissez-vous si vous faites une erreur dans un projet important ?',
    options: [
      { id: 'a', label: 'J\'attends que le client ou un collègue le remarque pour ne pas passer pour incompétent.', isCorrect: false },
      { id: 'b', label: 'J\'informe immédiatement l\'équipe et mon responsable, je documente le problème et je propose une correction.', isCorrect: true },
      { id: 'c', label: 'Je blâme le collègue qui a fait le code review pour détourner l\'attention.', isCorrect: false },
      { id: 'd', label: 'Je corrige discrètement le bug sans rien dire à personne pour sauver la face.', isCorrect: false },
    ],
    multipleAnswers: false,
  },
  {
    id: 'q6',
    question: "Un collègue vous demande de l'aide alors que vous êtes très occupé. Que faites-vous ?",
    options: [
      { id: 'a', label: 'Je lui dis que je suis débordé et qu\'il a qu\'à se débrouiller tout seul.', isCorrect: false },
      { id: 'b', label: 'Je regarde rapidement son problème et je lui indique où chercher ou je bloque 15-20 min plus tard dans la journée pour l\'aider.', isCorrect: true },
      { id: 'c', label: 'Je l\'aide immédiatement en mettant mon propre travail de côté, même si ça me met en retard.', isCorrect: false },
      { id: 'd', label: "Je lui dis d'attendre que le chef le remarque puis je décide de l’aider.", isCorrect: false },
    ],
    multipleAnswers: false,
  },
  {
    id: 'q7',
    question: 'Comment montrez-vous votre motivation pour ce stage lors de l\'entretien ?',
    options: [
      { id: 'a', label: 'En répétant mot pour mot mon CV sans ajouter d\'anecdotes.', isCorrect: false },
      { id: 'b', label: 'En expliquant pourquoi le domaine du développement et les ERP m\'ont toujours passionné.', isCorrect: true },
      { id: 'c', label: 'En demandant directement combien je serai payé en tant que stagiaire.', isCorrect: false },
      { id: 'd', label: 'En donnant des exemples précis de projets personnels ou universitaires que j\'ai réalisés (ex. mini-ERP, application full-stack, etc.).', isCorrect: true },
    ],
    multipleAnswers: true,
  },
  {
    id: 'q8',
    question: 'Que faites-vous si vous ne comprenez pas une consigne donnée par votre supérieur ?',
    options: [
      { id: 'a', label: 'Je commence directement le développement en interprétant comme je peux.', isCorrect: false },
      { id: 'b', label: 'Je pose immédiatement des questions pour clarifier les attentes et je reformule avec mes mots pour valider ma compréhension.', isCorrect: true },
      { id: 'c', label: 'Je fais exactement ce qu\'il a dit même si ça me semble bizarre, « c\'est le chef qui décide ».', isCorrect: false },
      { id: 'd', label: 'Je délègue la tâche à un autre stagiaire pour ne pas prendre de risque.', isCorrect: false },
    ],
    multipleAnswers: false,
  }, 
];

export default function Level5Page() {
  const navigate = useNavigate();
  const { completeLevel } = useGame();
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionResults, setQuestionResults] = useState<boolean[]>([]);

  const scenario = scenarios[currentScenario];
  const isLastScenario = currentScenario === scenarios.length - 1;

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

  const toggleAnswer = (optionId: string) => {
    if (hasValidated) return;
    
    if (scenario.multipleAnswers) {
      setSelectedAnswers(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedAnswers([optionId]);
    }
  };

  const handleValidate = () => {
    if (selectedAnswers.length === 0) {
      toast.error('Veuillez sélectionner au moins une réponse');
      return;
    }

    const correctOptions = scenario.options.filter(o => o.isCorrect).map(o => o.id);
    const selectedSet = new Set(selectedAnswers);
    const correctSet = new Set(correctOptions);
    
    const isAnswerCorrect = 
      selectedSet.size === correctSet.size && 
      [...selectedSet].every(id => correctSet.has(id));

    setIsCorrect(isAnswerCorrect);
    setHasValidated(true);

    if (isAnswerCorrect) {
      toast.success('Bonne réponse ! +2.5 points');
    } else {
      toast.error('Mauvaise réponse.');
    }
  };

  const handleNext = () => {
    const newResults = [...questionResults, isCorrect];
    setQuestionResults(newResults);

    if (isLastScenario) {
      const totalCorrect = newResults.filter(Boolean).length;
      const totalScore = totalCorrect * 2.5; // 8 × 2.5 = 20

      completeLevel(5, totalScore);

      if (totalScore === 20) {
        toast.success(`Félicitations ! Vous avez obtenu ${totalScore}/20 points au niveau 5.`);
      } else if (totalScore >= 12.5) {
        toast.info(`Bon travail ! Vous avez obtenu ${totalScore}/20 points au niveau 5.`);
      } else {
        toast.warning(`Vous avez obtenu ${totalScore}/20 points au niveau 5. Révisez vos réflexes professionnels !`);
      }

      navigate('/auto-evaluation');
    } else {
      setCurrentScenario(prev => prev + 1);
      setSelectedAnswers([]);
      setHasValidated(false);
      setIsCorrect(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress and Timer */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <ProgressBar currentLevel={5} completedLevels={[]} />
          </div>
          <div className="ml-4">
            <GameTimer />
          </div>
        </div>

        {/* Level Header */}
        <LevelHeader
          levelNumber={5}
          title="Répondre efficacement"
          objective="L'équipe de recrutement vous met à l'épreuve avec des situations réalistes. Répondez à 8 QCM qui testent votre logique professionnelle."
        />

        {/* Scenario Progress */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {scenarios.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index < currentScenario && questionResults[index] && "bg-success",
                index < currentScenario && !questionResults[index] && "bg-destructive",
                index === currentScenario && "bg-primary w-6",
                index > currentScenario && "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Scenario Card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-md animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm text-muted-foreground">Question {currentScenario + 1}/{scenarios.length}</p>
                {scenario.multipleAnswers && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Sélectionnez toutes les bonnes réponses
                  </span>
                )}
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground">
                {scenario.question}
              </h3>
            </div>
          </div>

          {/* Options with Checkboxes */}
          <div className="space-y-3">
            {scenario.options.map((option) => {
              const isSelected = selectedAnswers.includes(option.id);
              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                  onClick={() => toggleAnswer(option.id)}
                >
                  <Checkbox 
                    checked={isSelected}
                    disabled={hasValidated}
                    className="mt-1"
                  />
                  <Label className="flex-1 cursor-pointer text-foreground">
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ Affiche la bonne réponse SEULEMENT si faux */}
        {hasValidated && !isCorrect && (
          <div className="mt-6 p-4 bg-muted rounded-xl">
            <p className="font-medium text-muted-foreground mb-3">Bonne(s) réponse(s) :</p>
            <div className="space-y-2">
              {scenario.options
                .filter(o => o.isCorrect)
                .map(option => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-foreground">{option.label}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          {!hasValidated && (
            <Button size="lg" onClick={handleValidate} disabled={selectedAnswers.length === 0}>
              Valider ma réponse
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {hasValidated && (
            <Button size="lg" variant={isCorrect ? "success" : "default"} onClick={handleNext}>
              {isLastScenario ? "Passer à l'auto-évaluation" : "Question suivante"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
