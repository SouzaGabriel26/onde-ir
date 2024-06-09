import { Input } from './Input';
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
      `}
    >
      <h1 className="text-2xl">Onde Ir?</h1>

      <Input
        id="input_search"
        label="Search for resturants"
        className="md:w-96"
      />

      <nav className="flex items-center gap-4">
        <NavButton href="/auth/signin" title="Entrar" />
        <NavButton href="/auth/signup" title="Cadastrar" />
        <ToggleThemeButton />
      </nav>
    </header>
  );
}
