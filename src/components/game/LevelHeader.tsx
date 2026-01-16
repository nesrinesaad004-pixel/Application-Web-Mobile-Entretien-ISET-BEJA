import { cn } from '@/lib/utils';

interface LevelHeaderProps {
  levelNumber: number;
  title: string;
  objective: string;
  character?: string;
}

export function LevelHeader({ levelNumber, title, objective, character }: LevelHeaderProps) {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Niveau {levelNumber}
      </div>
      
      <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
        {title}
      </h1>
      
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-4 shadow-sm">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Objectif :</span> {objective}
        </p>
        {character && (
          <p className="text-sm text-muted-foreground mt-2 italic">
            — {character}
          </p>
        )}
      </div>
    </div>
  );
}
