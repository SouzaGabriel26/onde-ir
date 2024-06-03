import { Button } from '@nextui-org/react';
import Link from 'next/link';

type NavButtonProps = {
  href: string;
  title: string;
};

export function NavButton({ href, title }: NavButtonProps) {
  return (
    <Button className="group rounded-sm">
      <Link href={href}>{title}</Link>
      <div className="hidden h-px animate-crescent-line bg-black group-hover:block dark:bg-white" />
    </Button>
  );
}
