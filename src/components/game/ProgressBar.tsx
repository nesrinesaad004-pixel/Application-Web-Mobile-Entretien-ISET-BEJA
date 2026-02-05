import { cn } from '@/lib/utils';
import { LevelIndicator } from './LevelIndicator';

// 🔥 Ajoute cette constante
const levels = [
  { level: 1, title: "L'Investigation" },
  { level: 2, title: "Le Bilan de Soi" },
  { level: 3, title: "L'Invitation" },
  { level: 4, title: "L'Entretien" },
  { level: 5, title: "Gestion de crise" },
];

interface ProgressBarProps {
  currentLevel: number;
  completedLevels: number[];
}

export function ProgressBar({ currentLevel, completedLevels }: ProgressBarProps) {
  const progress = (completedLevels.length / levels.length) * 100;

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6 shadow-md">
      {/* Progress line */}
      <div className="relative mb-6">
        <div className="absolute top-5 left-5 right-5 h-1 bg-muted rounded-full">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Level dots */}
        <div className="relative flex justify-between">
          {levels.map(({ level, title }) => (
            <LevelIndicator
              key={level}
              level={level}
              currentLevel={currentLevel}
              completedLevels={completedLevels}
              title=""
            />
          ))}
        </div>
      </div>

      {/* Current level info */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Niveau {currentLevel} sur {levels.length}
        </p>
        <p className="text-lg font-display font-semibold text-foreground mt-1">
          {levels.find(l => l.level === currentLevel)?.title || "Terminé"}
        </p>
      </div>
    </div>
  );
}
