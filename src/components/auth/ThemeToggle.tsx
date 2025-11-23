import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export function ThemeToggle() {
  const { actualTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 rounded-lg bg-[#19215A] dark:bg-[#19215A] border border-[#2F5FFF]/20 hover:border-[#2F5FFF]/50 transition-all z-50"
      title={actualTheme === 'dark' ? 'Mudar para light mode' : 'Mudar para dark mode'}
    >
      {actualTheme === 'dark' ? (
        <Sun className="h-5 w-5 text-white" />
      ) : (
        <Moon className="h-5 w-5 text-[#2F5FFF]" />
      )}
    </button>
  );
}
