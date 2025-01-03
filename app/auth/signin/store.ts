'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createAuthenticationDataSource } from '@/data/authentication';
import {
  type SignInProps,
  type SignInResponse,
  auth,
} from '@/models/authentication';
import { constants } from '@/utils/constants';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

export type SignInResponseAction = SignInResponse & {
  inputs?: Partial<SignInProps>;
};

export async function signInAction(
  _prevState: SignInResponseAction,
  formData: FormData,
): Promise<SignInResponseAction> {
  const sanitizedData = form.sanitizeData<SignInProps>(formData);

  const authDataSource = createAuthenticationDataSource();
  const signInResponse = await auth.signIn(authDataSource, sanitizedData);

  if (signInResponse.data) {
    const { accessToken } = signInResponse.data;

    const sevenDaysInMilliseconds = 60 * 60 * 24 * 7 * 1000;

    (await cookies()).set(constants.accessTokenKey, accessToken, {
      expires: new Date(Date.now() + sevenDaysInMilliseconds),
      httpOnly: true,
    });

    await feedbackMessage.setFeedbackMessage({
      type: 'success',
      content: 'Login efetuado com sucesso!',
    });

    redirect('/dashboard');
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'error',
    content: signInResponse.error.message,
  });

  return {
    data: signInResponse.data,
    error: signInResponse.error,
    inputs: {
      email: sanitizedData.email,
      password: sanitizedData.password,
    },
  };
}
