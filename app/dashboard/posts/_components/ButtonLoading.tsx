'use client';

import { Loader2Icon } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';

import type { JSX } from 'react';

type ButtonLoadingProps = JSX.IntrinsicElements['button'];
export function ButtonLoading({ children, ...props }: ButtonLoadingProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={pending}>
      {pending ? <Loader2Icon className="mr-2 animate-spin" /> : ''}
      {children}
    </Button>
  );
}
