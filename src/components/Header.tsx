import { NavButton } from './NavButton';
import { ToggleThemeButton } from './ToggleThemeButton';

type HeaderProps = {
  signedIn?: boolean;
};

export function Header({ signedIn = false }: HeaderProps) {
  return (
    <header
      className={`
        flex
        h-16
        items-center
        justify-between
        border-b
        bg-[#eeeeee]
        px-4
        dark:border-zinc-700
        dark:bg-zinc-800
        md:px-10
      `}
    >
      <h1 className="text-2xl">Onde Ir?</h1>

      <nav className="flex items-center gap-2 text-sm md:gap-4 md:text-base">
        {!signedIn && (
          <>
            <NavButton href="/auth/signin" title="Entrar" />
            <NavButton href="/auth/signup" title="Cadastrar" />
          </>
        )}
        <ToggleThemeButton />
      </nav>
    </header>
  );
}
