import { Button } from '@nextui-org/react';

import { Menu } from './icons/Menu';
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
      `}
    >
      <Button className="h-fit w-fit p-2">
        <Menu className="dark:stroke-white" />
      </Button>
      <h1 className="text-2xl">Onde Ir?</h1>
      <ToggleThemeButton />
    </header>
  );
}
