import type { Route } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';

type NavButtonProps = {
  href: Route;
  title: string;
};

export function NavButton({ href, title }: NavButtonProps) {
  return (
    <Button asChild variant="default" size="sm">
      <Link className="px-4 text-sm lg:text-base" href={href}>
        {title}
      </Link>
    </Button>
  );
}
