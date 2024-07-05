import Link from 'next/link';

import { ArrowLeft } from '@/components/icons/ArrowLeft';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative grid h-screen place-items-center">
      {children}
      <Link
        title="Página inicial"
        href="/"
        className="absolute left-4 top-4 rounded-md border p-1 transition-colors hover:bg-muted dark:border-white"
      >
        <ArrowLeft className="stroke-slate-900 dark:stroke-white" />
      </Link>
    </div>
  );
}
