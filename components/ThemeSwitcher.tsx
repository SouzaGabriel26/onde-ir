'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Moon } from '@/components/icons/Moon';
import { Sun } from '@/components/icons/Sun';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { constants } from '@/utils/constants';

import { Skeleton } from './ui/Skeleton';

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton className="h-9 w-9" />;

  function handleChangeTheme(theme: string) {
    setTheme(theme);
    document.cookie = `${constants.themeKey}=${theme}; path=/`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title="Trocar tema"
        className={`
          flex
          w-fit
          items-center
          rounded-md
          border-slate-800
          p-1.5
          outline-none
          transition-all
          hover:bg-muted
          focus:bg-muted
        `}
      >
        <Sun className="dark:hidden" />
        <Moon className="hidden dark:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-28 rounded-md border shadow-md">
        <DropdownMenuRadioGroup
          value={resolvedTheme}
          onValueChange={handleChangeTheme}
          className="p-2"
        >
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          {systemTheme && (
            <DropdownMenuRadioItem value={systemTheme}>
              System
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
