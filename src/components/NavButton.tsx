import { Button } from '@nextui-org/react';
import { Route } from 'next';
import Link from 'next/link';

type NavButtonProps = {
  href: Route;
  title: string;
};

export function NavButton({ href, title }: NavButtonProps) {
  return (
    <Button className="group rounded-lg bg-[#DDE9F0] px-0">
      <Link className="px-4" href={href}>
        {title}
      </Link>
      <div className="hidden h-[2px] animate-crescent-line rounded bg-secondary group-hover:block" />
    </Button>
  );
}
