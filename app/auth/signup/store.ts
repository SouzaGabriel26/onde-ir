'use server';

import { redirect } from 'next/navigation';

import { Welcome } from '@/components/email-templates/Welcome';
import { createAuthenticationDataSource } from '@/data/authentication';
import {
  type SignUpProps,
  type SignUpResponse,
  auth,
} from '@/models/authentication';
import { emailService } from '@/models/email';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

export type SignUpActionResponse = SignUpResponse & {
  inputs?: Partial<SignUpProps>;
};

export async function signUpAction(
  _prevState: SignUpActionResponse,
  formData: FormData,
): Promise<SignUpActionResponse> {
  const sanitizedData = form.sanitizeData<SignUpProps>(formData);

  const authDataSource = createAuthenticationDataSource();
  const signUpResponse = await auth.signUp(authDataSource, sanitizedData);

  if (signUpResponse.data) {
    const { userName, email, name } = signUpResponse.data;

    await emailService.sendWelcomeMessage({
      from: 'Onde Ir <onboarding@resend.dev>',
      to: email,
      content: Welcome({
        userFirstname: name,
      }),
    });

    await feedbackMessage.setFeedbackMessage({
      type: 'success',
      content: 'Usuário cadastrado com sucesso!',
    });

    redirect(`/auth/signin?userName=${userName}`);
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'error',
    content: signUpResponse.error.message,
  });

  return {
    data: signUpResponse.data,
    error: signUpResponse.error,
    inputs: {
      confirmPassword: sanitizedData.confirmPassword,
      email: sanitizedData.email,
      name: sanitizedData.name,
      password: sanitizedData.password,
      userName: sanitizedData.userName,
    },
  };
}
