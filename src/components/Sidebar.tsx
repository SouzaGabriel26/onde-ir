import Link from 'next/link';

import { sanitizeClassName } from '@/utils/sanitizeClassName';

import { About } from './icons/About';
import { ArrowLeft } from './icons/ArrowLeft';
import { ArrowRight } from './icons/ArrowRight';
import { Contact } from './icons/Contact';
import { Home } from './icons/Home';

type SidebarProps = React.JSX.IntrinsicElements['aside'];

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <aside
      className={sanitizeClassName(
        `
          group/sidebar
          flex
          h-full
          w-12
          flex-col
          gap-8
          border-r
          py-4
          pl-3
          transition-all
          has-[:checked]/sidebar:w-32
          dark:border-zinc-700
        `,
        className,
      )}
      {...props}
    >
      <label
        htmlFor="sidebar"
        className={`
          flex
          w-fit
          cursor-pointer
          rounded
          border
          transition-all
          hover:border-slate-300
          hover:opacity-80
          group-has-[:checked]/sidebar:mr-3
          group-has-[:checked]/sidebar:self-end
          dark:bg-slate-300
        `}
        title="Expandir/Recolher menu lateral"
      >
        <ArrowRight className="group-has-[:checked]/sidebar:hidden" />
        <ArrowLeft className="hidden group-has-[:checked]/sidebar:block" />
        <input type="checkbox" id="sidebar" className="hidden" />
      </label>

      {NAVIGATION_OPTIONS.map((option) => (
        <Link
          href={option.href}
          key={option.href}
          title={option.title}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span>{option.icon}</span>
          <span className="hidden group-has-[:checked]/sidebar:block">
            {option.title}
          </span>
        </Link>
      ))}
    </aside>
  );
}

const NAVIGATION_OPTIONS = [
  { title: 'Home', href: '#', icon: <Home /> },
  { title: 'Sobre', href: '#about', icon: <About /> },
  { title: 'Contato', href: '#contact', icon: <Contact /> },
];
