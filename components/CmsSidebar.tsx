'use client';

import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { Check, ListTodo, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { type JSX, useEffect, useState } from 'react';
import { Button } from './ui/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/Sheet';

export type CmsSidebarProps = JSX.IntrinsicElements['aside'];

export function CmsSidebar({ className, ...props }: CmsSidebarProps) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function toggleSheetState() {
    setIsSheetOpen((prevState) => !prevState);
  }

  const MOBILE_BREAKPOINT = 1200;
  const isMobile = screenWidth < MOBILE_BREAKPOINT;

  if (isMobile) {
    return (
      <div className="mt-16 p-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="px-2"
              onClick={() => setIsSheetOpen(true)}
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="space-y-8">
              <SheetTitle>Gerenciamento de conteúdo</SheetTitle>
              <SidebarItems />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <aside
      className={sanitizeClassName(
        'border h-full p-4 text-muted-foreground space-y-8 text-center mt-16',
        className,
      )}
      {...props}
    >
      <span>Gerenciamento de conteúdo</span>

      <SidebarItems />
    </aside>
  );

  function SidebarItems() {
    return (
      <ul className="text-secondary-foreground text-sm space-y-2">
        <ListItem>
          <Link
            href={{
              href: '/dashboard',
              query: { status: 'admin-pendings' },
            }}
            className="flex gap-2 items-center flex-1 "
          >
            <ListTodo />
            <span>Posts pendentes de aprovação</span>
          </Link>
        </ListItem>

        <ListItem>
          {/* TODO: Implement this */}
          <Link
            href="/dashboard/"
            as="/dashboard/"
            className="flex gap-2 items-center flex-1 "
          >
            <Check />
            <span>Posts aprovados por você</span>
          </Link>
        </ListItem>
      </ul>
    );
  }

  function ListItem({ children }: { children: JSX.Element }) {
    return (
      <li>
        <Button
          onClick={isMobile ? toggleSheetState : undefined}
          variant="ghost"
          className="w-full justify-start"
        >
          {children}
        </Button>
      </li>
    );
  }
}
