import { Button } from '@nextui-org/react';
import { Route } from 'next';
import Link from 'next/link';

type NavButtonProps = {
  href: Route;
  title: string;
};

export function NavButton({ href, title }: NavButtonProps) {
  return (
    <Button className="group rounded-lg px-0">
      <Link className="px-2 py-1" href={href}>
        {title}
      </Link>
      <div className="hidden h-px animate-crescent-line bg-black group-hover:block dark:bg-white" />
    </Button>
  );
}
