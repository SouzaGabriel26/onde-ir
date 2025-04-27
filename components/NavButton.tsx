import type { Route } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { AnimatedComponent } from './AnimatedComponent';

type NavButtonProps = {
  href: Route;
  title: string;
};

export function NavButton({ href, title }: NavButtonProps) {
  return (
    <Button asChild variant="default" size="sm">
      <AnimatedComponent variant="button">
        <Link className="px-2 text-sm lg:text-base w-fit flex" href={href}>
          {title}
        </Link>
      </AnimatedComponent>
    </Button>
  );
}
