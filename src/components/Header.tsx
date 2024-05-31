import { Menu } from './icons/Menu';
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
      <div className="md:w-56">
        <label
          htmlFor="sidebar"
          className="block w-fit cursor-pointer transition-transform hover:scale-105"
        >
          <Menu className="dark:stroke-white" />
          <input type="checkbox" id="sidebar" className="hidden" />
        </label>
      </div>

      <h1 className="text-2xl">Onde Ir?</h1>

      <nav className="flex items-center">
        <NavButton href="/signin" title="Entrar" />
        <NavButton href="/signup" title="Cadastrar" />
        <ToggleThemeButton />
      </nav>
    </header>
  );
}
