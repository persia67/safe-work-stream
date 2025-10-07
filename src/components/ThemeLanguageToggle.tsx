import React from 'react';
import { Moon, Sun, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const ThemeLanguageToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="relative overflow-hidden transition-all hover:shadow-md"
        title={theme === 'light' ? 'حالت تیره' : 'حالت روشن'}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="gap-2 transition-all hover:shadow-md"
        title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
      >
        <Languages className="h-4 w-4" />
        <span className="font-semibold">{language === 'fa' ? 'EN' : 'FA'}</span>
      </Button>
    </div>
  );
};
