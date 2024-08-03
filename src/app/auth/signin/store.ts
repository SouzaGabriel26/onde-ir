import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createAuthenticationDataSource } from '@/data/authentication';
import { auth, SignInProps, SignInResponse } from '@/models/authentication';
import { constants } from '@/src/utils/constants';
import { feedbackMessage } from '@/src/utils/feedbackMessage';
import { form } from '@/src/utils/form';

let signInResponse: SignInResponse;

async function signInAction(formData: FormData) {
  'use server';

  const sanitizedData = form.sanitizeData<SignInProps>(formData);

  const authDataSource = createAuthenticationDataSource();
  signInResponse = await auth.signIn(authDataSource, sanitizedData);

  if (signInResponse.data) {
    const { accessToken } = signInResponse.data;

    const sevenDaysInMilliseconds = 60 * 60 * 24 * 7 * 1000;

    cookies().set(constants.accessTokenKey, accessToken, {
      expires: new Date(Date.now() + sevenDaysInMilliseconds),
      httpOnly: true,
    });

    feedbackMessage.setFeedbackMessage({
      type: 'success',
      content: 'Login efetuado com sucesso!',
    });

    redirect('/dashboard');
  }

  feedbackMessage.setFeedbackMessage({
    type: 'error',
    content: signInResponse.error.message,
  });
}

function getSignInResponse() {
  return Object.freeze({
    signInResponse,
  });
}
export const store = Object.freeze({
  signInAction,
  getSignInResponse,
});
