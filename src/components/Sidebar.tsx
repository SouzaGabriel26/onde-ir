import Link from 'next/link';

import { sanitizeClassName } from '@/utils/sanitizeClassName';

import { About } from './icons/About';
import { Contact } from './icons/Contact';
import { Home } from './icons/Home';

type SidebarProps = React.JSX.IntrinsicElements['aside'];

export function Sidebar({ className, ...props }: SidebarProps) {
  const options = [
    { title: 'Home', href: '#', icon: <Home /> },
    { title: 'Sobre', href: '#about', icon: <About /> },
    { title: 'Contato', href: '#contact', icon: <Contact /> },
  ];

  return (
    <aside
      className={sanitizeClassName(
        `
          flex
          h-full
          flex-col
          gap-8
          border-r
          py-4
          pl-3
          transition-all
          dark:border-zinc-700
        `,
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <Link
          href={option.href}
          key={option.href}
          title={option.title}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span>{option.icon}</span>
          <span className="hidden group-has-[:checked]/root:block">
            {option.title}
          </span>
        </Link>
      ))}
    </aside>
  );
}
