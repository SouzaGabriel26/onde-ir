'use client'

import { useTheme } from "@/contexts/ThemeProvider";
import { sanitizeClassName } from "@/utils/sanitizeClassName";
import { Button } from "@nextui-org/react";
import { Moon } from "./icons/Moon";
import { Sun } from "./icons/Sun";

type ToggleThemeButtonProps = {
  className?: string;
}

export function ToggleThemeButton({ className }: ToggleThemeButtonProps) {
  const { handleSetTheme, theme } = useTheme();

  return (
    <Button
      onClick={handleSetTheme}
      className={sanitizeClassName(`
        h-fit
        w-fit
        p-2
        rounded-full
        border
        hover:brightness-110
        group
      `,
        className
      )}>
      <label title={theme} className="cursor-pointer">
        {
          theme === 'dark' ? (
            <Sun />
          ) : (
            <Moon />
          )
        }
      </label>
    </Button>
  )
}
