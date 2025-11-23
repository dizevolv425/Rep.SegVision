import React from 'react';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#2F5FFF]/10 dark:bg-[#2F5FFF]/20 flex items-center justify-center">
            <Icon className="h-10 w-10 text-[#2F5FFF]" />
          </div>
        </div>
        
        <h3 className="text-[var(--neutral-text)] mb-3">{title}</h3>
        
        <p className="text-[var(--neutral-text-muted)] mb-6">
          {description}
        </p>
        
        {(actionLabel || secondaryActionLabel) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {actionLabel && onAction && (
              <Button
                onClick={onAction}
                className="bg-[#2F5FFF] text-white hover:opacity-96"
              >
                {actionLabel}
              </Button>
            )}
            {secondaryActionLabel && onSecondaryAction && (
              <Button
                onClick={onSecondaryAction}
                variant="outline"
                className="border-[#2F5FFF]/30 text-[var(--neutral-text)] hover:bg-[#2F5FFF]/10"
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
