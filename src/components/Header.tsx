import { NavButton } from './NavButton';
import { ToggleThemeButton } from './ToggleThemeButton';

export function Header() {
  return (
    <header
      className={`
        flex
        h-16
        items-center
        justify-between
        border-b
        px-4
        dark:border-zinc-700
        md:px-10
      `}
    >
      <h1 className="text-2xl">Onde Ir?</h1>

      <nav className="flex items-center gap-2 text-sm md:gap-4 md:text-base">
        <NavButton href="/auth/signin" title="Entrar" />
        <NavButton href="/auth/signup" title="Cadastrar" />
        <ToggleThemeButton />
      </nav>
    </header>
  );
}
