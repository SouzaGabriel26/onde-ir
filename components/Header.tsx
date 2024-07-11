import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { User } from '@/types';

import { NavButton } from './NavButton';
import { UserAvatar } from './UserAvatar';

type HeaderProps = {
  userData?: Partial<User> | null;
};

export function Header({ userData = null }: HeaderProps) {
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
      <h1 className="text-2xl font-medium">Onde Ir?</h1>

      <nav className="flex items-center gap-2 text-sm md:gap-4 md:text-base">
        {!userData && (
          <>
            <NavButton href="/auth/signin" title="Entrar" />
          </>
        )}

        <ThemeSwitcher />

        {userData && (
          <Sheet>
            <SheetTrigger>
              <UserAvatar
                name="Gabriel"
                imageUrl="https://github.com/souzagabriel26.png"
              />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Perfil</SheetTitle>
                <SheetDescription>Configurações da conta</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        )}
      </nav>
    </header>
  );
}
