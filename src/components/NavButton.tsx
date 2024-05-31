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
      <div className="animate-crescent-line hidden h-px bg-black group-hover:block dark:bg-white" />
    </Button>
  );
}
