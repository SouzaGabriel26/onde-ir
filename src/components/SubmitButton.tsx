import { Button } from '@nextui-org/react';

import { sanitizeClassName } from '@/src/utils/sanitizeClassName';

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function SubmitButton({ className, children }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={sanitizeClassName(
        `rounded bg-zinc-300 px-2 py-1 text-sm text-[#333] transition-opacity hover:opacity-75`,
        className,
      )}
    >
      {children}
    </Button>
  );
}
