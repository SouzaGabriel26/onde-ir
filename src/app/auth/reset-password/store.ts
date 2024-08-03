import { redirect } from 'next/navigation';

import { createAuthenticationDataSource } from '@/data/authentication';
import {
  FailureAuthResponse,
  ResetPasswordInput,
  auth,
} from '@/models/authentication';
import { feedbackMessage } from '@/src/utils/feedbackMessage';
import { form } from '@/src/utils/form';
import { Failure, Success } from '@/src/utils/operationResult';

let responseMessage: Success<{}> | Failure<FailureAuthResponse>;

async function resetPasswordAction(formData: FormData) {
  'use server';

  const data = form.sanitizeData<ResetPasswordInput>(formData);

  const authDataSource = createAuthenticationDataSource();
  responseMessage = await auth.resetPassword(authDataSource, data);

  if (responseMessage.error) {
    feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: responseMessage.error.message,
    });

    return;
  }

  feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Senha atualizada com sucesso',
  });

  redirect('/auth/signin');
}

function getResponseMessage() {
  return Object.freeze({ responseMessage });
}

export const store = Object.freeze({
  resetPasswordAction,
  getResponseMessage,
});
