'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Toaster as Sonner, toast } from 'sonner';

import { FeedbackMessage } from '@/utils/feedbackMessage';

type ToasterProps = React.ComponentProps<typeof Sonner> & {
  message?: FeedbackMessage | null;
};

const Toaster = ({ message, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  useEffect(() => {
    if (!!message) {
      toast[message.type](message.content, {
        className:
          message.type === 'error' ? '!text-red-500' : '!text-green-500',
      });
    }
  }, [message]);

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
