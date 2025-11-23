import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function ThemeToggle() {
  const { actualTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg hover:bg-[var(--neutral-subtle)] transition-colors"
            aria-label={actualTheme === 'light' ? 'Ativar modo escuro' : 'Desativar modo escuro'}
            aria-pressed={actualTheme === 'dark'}
          >
            {actualTheme === 'light' ? (
              <Sun className="h-5 w-5 text-[var(--neutral-icon)]" />
            ) : (
              <Moon className="h-5 w-5 text-[var(--neutral-icon)]" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{actualTheme === 'light' ? 'Ativar modo escuro' : 'Desativar modo escuro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
