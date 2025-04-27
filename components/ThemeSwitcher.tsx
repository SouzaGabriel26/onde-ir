'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Sun } from '@/components/icons/Sun';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { constants } from '@/utils/constants';

import { motion } from 'framer-motion';

import { MoonIcon } from 'lucide-react';
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
        {resolvedTheme === 'dark' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MoonIcon />
          </motion.div>
        )}
        {resolvedTheme === 'light' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun />
          </motion.div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="rounded-md border shadow-md">
        <DropdownMenuRadioGroup
          value={resolvedTheme}
          onValueChange={handleChangeTheme}
          className="p-2"
        >
          <DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Escuro</DropdownMenuRadioItem>
          {systemTheme && (
            <DropdownMenuRadioItem value={systemTheme} showIndicator={false}>
              Padrão do sistema
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
