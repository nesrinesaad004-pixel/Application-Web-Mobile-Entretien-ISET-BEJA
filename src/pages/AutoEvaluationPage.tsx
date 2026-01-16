import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, User, Mail, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

// 🔑 Remplace par tes identifiants EmailJS
const EMAILJS_SERVICE_ID = 'service_c0dtn7v';
const EMAILJS_TEMPLATE_ID = 'template_uw8ox7o';
const EMAILJS_PUBLIC_KEY = 'LUjw_yg7wq9nBoBbl';

export default function AutoEvaluationPage() {
  const navigate = useNavigate();
  const { gameState } = useGame(); // 🔥 Pas besoin de resetGame ici
  const [selfEvaluation, setSelfEvaluation] = useState<string | null>(null);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const difficultyOptions = [
    { id: 'investigation', label: "L'Investigation" },
    { id: 'bilan', label: 'Le Bilan de Soi' },
    { id: 'invitation', label: "L'Invitation" },
    { id: 'entretien', label: "L'Entretien" },
    { id: 'crise', label: 'La Gestion de Crise' },
     { id: 'Aucun', label: 'Aucun' },
  ];

  const toggleDifficulty = (id: string) => {
    setDifficulties(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!selfEvaluation || difficulties.length === 0) {
      toast.error('Veuillez compléter tous les champs.');
      return;
    }

    // 🔥 Vérifie que studentInfo existe
    if (!gameState.studentInfo) {
      toast.error('Données manquantes. Veuillez recommencer le jeu.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 🔥 Calcule le score réel sur 100 points
      const levelScores = [1, 2, 3, 4, 5].map(level => 
        gameState.levelScores[level] || 0
      );
      const totalScore = levelScores.reduce((a, b) => a + b, 0); // déjà sur 100
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

      // 🔥 Sauvegarde les scores réels (0-20) dans Supabase
      await supabase.from('student_results').insert({
        nom: gameState.studentInfo.nom,
        prenom: gameState.studentInfo.prenom,
        groupe: gameState.studentInfo.groupe,
        niveau: gameState.studentInfo.niveau,
        specialite: gameState.studentInfo.specialite,
        score, // sur 100
        total_questions: 5,
        duration_seconds: durationSeconds,
        start_time: gameState.startTime ? new Date(gameState.startTime).toISOString() : null,
        end_time: new Date().toISOString(),
        level1_score: gameState.levelScores[1] || 0,
        level2_score: gameState.levelScores[2] || 0,
        level3_score: gameState.levelScores[3] || 0,
        level4_score: gameState.levelScores[4] || 0,
        level5_score: gameState.levelScores[5] || 0,
      });

      // 🔥 Prépare les statuts pour l'e-mail
      const getStatus = (levelScore: number) => 
        levelScore >= 20 ? '✅ Réussi' : '❌ Échoué';

      // Envoi EmailJS
      const difficultyLabels = difficulties
        .map(id => {
          const option = difficultyOptions.find(opt => opt.id === id);
          return option ? option.label : '';
        })
        .filter(label => label !== '');

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: gameState.studentInfo.professorEmail,
          nom: gameState.studentInfo.nom,
          prenom: gameState.studentInfo.prenom,
          specialite: gameState.studentInfo.specialite,
          score: score,
          time_elapsed: formatDurationText(durationSeconds),
          self_evaluation: selfEvaluation,
          difficulties: difficultyLabels.join(', '),
          level1_status: getStatus(gameState.levelScores[1] || 0),
          level2_status: getStatus(gameState.levelScores[2] || 0),
          level3_status: getStatus(gameState.levelScores[3] || 0),
          level4_status: getStatus(gameState.levelScores[4] || 0),
          level5_status: getStatus(gameState.levelScores[5] || 0),
        },
        EMAILJS_PUBLIC_KEY
      );

      toast.success('Résultats envoyés au professeur !');
      navigate('/resultat');
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      // 🔥 Message plus clair
      toast.error('Erreur d\'envoi. Vos résultats sont sauvegardés en base.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Auto-évaluation
          </h1>
          <p className="text-muted-foreground">
            Aidez-nous à améliorer ce jeu en répondant à ces deux questions.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          {/* Performance */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-3">Comment évaluez-vous votre performance ?</p>
            <div className="flex gap-2">
              {['Très satisfaisante', 'Satisfaisante', 'À améliorer'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSelfEvaluation(option)}
                  className={cn(
                    "flex-1 py-2 px-3 text-sm rounded-lg border transition-colors",
                    selfEvaluation === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary hover:bg-primary/5"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Difficultés */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Quel est le niveau qui vous a semblé le plus difficile ?</p>
            <div className="space-y-2">
              {difficultyOptions.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
                    difficulties.includes(option.id)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                  onClick={() => toggleDifficulty(option.id)}
                >
                  <Checkbox 
                    checked={difficulties.includes(option.id)}
                    className="pointer-events-none"
                  />
                  <span className="text-sm text-foreground">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selfEvaluation || difficulties.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                Finaliser mes résultats
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}