'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Moon } from '@/src/components/icons/Moon';
import { Sun } from '@/src/components/icons/Sun';
import { constants } from '@/src/utils/constants';

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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

      <DropdownMenuContent className="w-28 rounded-md border bg-white shadow-md dark:bg-slate-900">
        <DropdownMenuRadioGroup
          value={resolvedTheme}
          onValueChange={handleChangeTheme}
          className="p-2"
        >
          <DropdownMenuRadioItem
            className="cursor-pointer rounded-md p-1.5 px-2 outline-none focus:bg-muted"
            value="light"
          >
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="cursor-pointer rounded-md p-1.5 px-2 outline-none focus:bg-muted"
            value="dark"
          >
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="cursor-pointer rounded-md p-1.5 px-2 outline-none focus:bg-muted"
            value="system"
          >
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
