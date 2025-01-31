import Link from 'next/link';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import type { User } from '@/types';

import { NavButton } from './NavButton';
import { UserOptions } from './UserOptions';

type HeaderProps = {
  userData?: Partial<User> | null;
};

export function Header({ userData }: HeaderProps) {
  return (
    <header
      className={`
        fixed
        z-50
        flex
        h-16
        w-full
        items-center
        justify-between
        bg-background
        px-4
        py-6
        shadow-sm
        dark:shadow-white
        md:px-40
      `}
    >
      <Link href="/" className="text-2xl font-medium">
        Onde Ir?
      </Link>

      <nav className="flex items-center gap-2 text-sm md:gap-4 md:text-base">
        {!userData && <NavButton href="/auth/signin" title="Entrar" />}

        <ThemeSwitcher />

        {userData && <UserOptions user={userData} />}
      </nav>
    </header>
  );
}
