'use client';

import { Button } from '@nextui-org/react';

import { useTheme } from '@/src/contexts/ThemeProvider';
import { sanitizeClassName } from '@/src/utils/sanitizeClassName';

import { Moon } from './icons/Moon';
import { Sun } from './icons/Sun';

type ToggleThemeButtonProps = {
  className?: string;
};

export function ToggleThemeButton({ className }: ToggleThemeButtonProps) {
  const { handleToggleTheme, theme } = useTheme();

  return (
    <Button
      onClick={handleToggleTheme}
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
