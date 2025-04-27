import Link from 'next/link';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import type { User } from '@/types';

import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { Compass } from 'lucide-react';
import { AnimatedComponent } from './AnimatedComponent';
import { NavButton } from './NavButton';
import { UserOptions } from './UserOptions';

type HeaderProps = {
  userData?: Partial<User> | null;
  divider?: boolean;
};

export function Header({ userData, divider }: HeaderProps) {
  return (
    <header
      className={sanitizeClassName(
        `
        flex
        h-16
        w-full
        items-center
        justify-between
        bg-background
        px-4
        py-6
      `,
        divider && 'border-b',
      )}
    >
      <Link href="/">
        <AnimatedComponent
          variant="button"
          className="text-2xl font-bold flex items-center gap-2"
        >
          <Compass className="w-8 h-8 text-primary" />
          Onde Ir?
        </AnimatedComponent>
      </Link>

      <nav className="flex items-center gap-2 text-sm md:gap-4 md:text-base">
        {!userData && <NavButton href="/auth/signin" title="Entrar" />}

        <ThemeSwitcher />

        {userData && <UserOptions user={userData} />}
      </nav>
    </header>
  );
}
