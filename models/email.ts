import { ReactNode } from 'react';

import { resend } from '@/libs/resend';

type EmailInput = {
  from: string;
  to: string;
  content: ReactNode;
};

async function sendWelcomeMessage(input: EmailInput) {
  const { from, to, content } = input;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: 'Bem vindo à plataforma Onde ir!',
    react: content,
    text: '',
  });

  console.log({ data });
  console.log({ error });
}

export const emailService = Object.freeze({
  sendWelcomeMessage,
});
