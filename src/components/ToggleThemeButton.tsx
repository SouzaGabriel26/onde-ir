'use client';

import { Button } from '@nextui-org/react';

import { useTheme } from '@/contexts/ThemeProvider';
import { sanitizeClassName } from '@/utils/sanitizeClassName';

import { Moon } from './icons/Moon';
import { Sun } from './icons/Sun';

type ToggleThemeButtonProps = {
  className?: string;
};

export function ToggleThemeButton({ className }: ToggleThemeButtonProps) {
  const { handleSetTheme, theme } = useTheme();

  return (
    <Button
      onClick={handleSetTheme}
      className={sanitizeClassName(
        `
        group
        h-fit
        w-fit
        rounded-full
        border
        p-2
        hover:brightness-110
      `,
        className,
      )}
    >
      <label title={theme} className="cursor-pointer">
        {theme === 'dark' ? <Sun /> : <Moon />}
      </label>
    </Button>
  );
}
