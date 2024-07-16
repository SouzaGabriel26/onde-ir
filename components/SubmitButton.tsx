'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Failure, Success } from '@/src/utils/operationResult';

type ActionResponse = Promise<
  Success<{ message: string; redirectLink?: string }> | Failure
>;

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  action?: (formData: FormData) => ActionResponse;
};

export function SubmitButton({
  className,
  children,
  action,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const [state, formAction] = useFormState(
    async (_prev: unknown, formData: FormData) => {
      return await action?.(formData);
    },
    null,
  );

  useEffect(() => {
    if (!state) return;

    const { data, error } = state;

    if (data) {
      toast.success(data.message);
      data.redirectLink && redirect(data.redirectLink);
    } else {
      toast.error(error.message);
    }
  }, [state]);

  return (
    <Button
      type="submit"
      disabled={pending}
      className={className}
      formAction={formAction}
    >
      {children}
    </Button>
  );
}
