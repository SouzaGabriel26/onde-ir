'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function SubmitButton({ className, children }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className={className}>
      {children}
    </Button>
  );
}
