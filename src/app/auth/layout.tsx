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
        title="navigate home"
        href="/"
        className="absolute left-4 top-4 rounded-md border bg-white transition-opacity hover:opacity-70"
      >
        <ArrowLeft />
      </Link>
    </div>
  );
}
