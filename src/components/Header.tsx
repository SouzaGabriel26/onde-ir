import { Button } from "@nextui-org/react";
import { ToggleThemeButton } from "./ToggleThemeButton";
import { Menu } from "./icons/Menu";

export function Header() {
  return (
    <header
      className={`
        flex
        justify-between
        items-center
        px-4
        h-16
        border-b
      `}
    >
      <Button className="w-fit h-fit p-2">
        <Menu className="dark:stroke-white" />
      </Button>
      <h1 className="text-2xl">Onde Ir?</h1>
      <ToggleThemeButton />
    </header>
  )
}

