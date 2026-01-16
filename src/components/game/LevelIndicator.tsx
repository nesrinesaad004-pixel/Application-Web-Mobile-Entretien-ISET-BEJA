import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelIndicatorProps {
  level: number;
  currentLevel: number;
  completedLevels: number[];
  title: string;
}

export function LevelIndicator({ level, currentLevel, completedLevels, title }: LevelIndicatorProps) {
  const isActive = level === currentLevel;
  const isCompleted = completedLevels.includes(level);
  const isAccessible = level <= currentLevel || isCompleted;

  return (
    <div className={cn(
      "flex items-center gap-3 transition-all duration-300",
      isAccessible ? "opacity-100" : "opacity-40"
    )}>
      <div
        className={cn(
          "level-indicator",
          isCompleted && "completed",
          isActive && !isCompleted && "active",
          !isActive && !isCompleted && "inactive"
        )}
      >
        {isCompleted ? (
          <Check className="h-5 w-5 animate-checkmark" />
        ) : (
          level
        )}
      </div>
      <span className={cn(
        "text-sm font-medium transition-colors duration-300",
        isActive && "text-primary font-semibold",
        isCompleted && "text-success",
        !isActive && !isCompleted && "text-muted-foreground"
      )}>
        {title}
      </span>
    </div>
  );
}
