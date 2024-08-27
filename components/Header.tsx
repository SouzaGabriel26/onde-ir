import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
import { constants } from '@/utils/constants';

import { NavButton } from './NavButton';
import { Button } from './ui/Button';
import { UserAvatar } from './UserAvatar';

type HeaderProps = {
  userData?: Partial<User> | null;
};

async function signOut() {
  'use server';

  cookies().delete(constants.accessTokenKey);

  return redirect('/auth/signin');
}

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
        {!userData && (
          <>
            <NavButton href="/auth/signin" title="Entrar" />
          </>
        )}

        <ThemeSwitcher />

        {userData && (
          <Sheet>
            <SheetTrigger>
              {/* TODO: search dynamically */}
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

              <div className="mt-4 flex flex-col gap-2">
                <form action={signOut}>
                  <Button type="submit">Sair</Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </nav>
    </header>
  );
}
