import { redirect } from 'next/navigation';

import { Welcome } from '@/components/email-templates/Welcome';
import { createAuthenticationDataSource } from '@/data/authentication';
import { SignUpProps, SignUpResponse, auth } from '@/models/authentication';
import { emailService } from '@/models/email';
import { feedbackMessage } from '@/src/utils/feedbackMessage';
import { form } from '@/src/utils/form';

let signUpResponse: SignUpResponse;

async function signUpAction(formData: FormData) {
  'use server';

  const sanitizedData = form.sanitizeData<SignUpProps>(formData);

  const authDataSource = createAuthenticationDataSource();
  signUpResponse = await auth.signUp(authDataSource, sanitizedData);

  if (signUpResponse.data) {
    const { userName, email, name } = signUpResponse.data;

    await emailService.sendWelcomeMessage({
      from: 'Onde Ir <onboarding@resend.dev>',
      to: email,
      content: Welcome({
        userFirstname: name,
      }),
    });

    feedbackMessage.setFeedbackMessage({
      type: 'success',
      content: 'Usuário cadastrado com sucesso!',
    });

    redirect(`/auth/signin?userName=${userName}`);
  }

  feedbackMessage.setFeedbackMessage({
    type: 'error',
    content: signUpResponse.error.message,
  });
}

export function getSignUpResponse() {
  return Object.freeze({
    signUpResponse,
  });
}

export const store = Object.freeze({
  signUpAction,
  getSignUpResponse,
});
