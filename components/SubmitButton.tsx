'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';

import type { JSX } from 'react';

type SubmitButtonProps = JSX.IntrinsicElements['button'] & {
  children: React.ReactNode;
};

export function SubmitButton({ className, children }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={className}>
      {children}
    </Button>
  );
}
