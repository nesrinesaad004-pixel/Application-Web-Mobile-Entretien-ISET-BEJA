import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QualityCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
  animationDelay?: number;
  image?: string;
}

export function QualityCard({ 
  id, 
  label, 
  isSelected, 
  onToggle, 
  disabled = false,
  animationDelay = 0,
  image
}: QualityCardProps) {
  return (
    <button
      onClick={() => !disabled && onToggle(id)}
      disabled={disabled}
      className={cn(
        "game-card cursor-pointer text-left opacity-0 animate-fade-in",
        isSelected && "selected",
        disabled && "cursor-not-allowed opacity-60"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex flex-col items-center gap-3">
        {image && (
          <img 
            src={image} 
            alt={label} 
            className="w-16 h-16 rounded-xl object-cover"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-base text-card-foreground">
            {label}
          </span>
          <div
            className={cn(
              "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
              isSelected
                ? "bg-primary border-primary"
                : "border-muted-foreground"
            )}
          >
            {isSelected && (
              <Check className="h-4 w-4 text-primary-foreground animate-checkmark" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
