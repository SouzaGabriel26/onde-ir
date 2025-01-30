'use client';

import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { ListTodo, MenuIcon, SquareX } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const currentStatusFilter = searchParams.get('status');

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
      <div
        className="px-2 py-4 absolute bottom-2 left-0"
        title="Gerenciamento de conteúdo"
      >
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="px-1"
              onClick={() => setIsSheetOpen(true)}
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-2 md:p-4">
            <SheetHeader className="space-y-8">
              <SheetTitle>Gerenciamento de conteúdo para ADMINS</SheetTitle>
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
      <span>Gerenciamento de conteúdo para ADMINS</span>

      <SidebarItems />
    </aside>
  );

  function SidebarItems() {
    return (
      <ul className="text-secondary-foreground text-sm space-y-2">
        <ListItem isSelected={currentStatusFilter === 'admin-pendings'}>
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
          <Link
            href="/dashboard"
            as="/dashboard"
            className="flex gap-2 items-center flex-1 "
          >
            <SquareX />
            <span>Limpar filtros</span>
          </Link>
        </ListItem>
      </ul>
    );
  }

  type ListItemProps = {
    children: JSX.Element;
    isSelected?: boolean;
  };

  function ListItem({ children, isSelected }: ListItemProps) {
    return (
      <li
        className={sanitizeClassName(
          'transition-all',
          isSelected && 'bg-accent text-blue-600 rounded',
        )}
      >
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
