'use client';

import { Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

import { sanitizeClassName } from '@/src/utils/sanitizeClassName';

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function SubmitButton({ className, children }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className={sanitizeClassName(
        `
          rounded
          bg-zinc-300
          px-2
          py-1
          text-sm
          text-[#333]
          transition-opacity
          hover:opacity-75
          disabled:cursor-not-allowed
          disabled:opacity-50
        `,
        className,
      )}
    >
      {children}
    </Button>
  );
}
