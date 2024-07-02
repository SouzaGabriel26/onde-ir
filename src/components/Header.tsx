import { User } from '@/types';

import { Avatar } from './Avatar';
import { NavButton } from './NavButton';

type HeaderProps = {
  userData?: Partial<User> | null;
};

export function Header({ userData = null }: HeaderProps) {
  return (
    <header
      className={`
        flex
        h-16
        items-center
        justify-between
        px-4
        shadow-sm
        md:px-40
      `}
    >
      <h1 className="text-2xl font-medium">Onde Ir?</h1>

      <nav className="flex items-center gap-2 text-sm md:gap-4 md:text-base">
        {!userData && (
          <>
            <NavButton href="/auth/signin" title="Entrar" />
          </>
        )}

        {userData && <Avatar name={userData.name!} />}
      </nav>
    </header>
  );
}
