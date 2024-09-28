import { redirect } from 'next/navigation';

import { createAuthenticationDataSource } from '@/data/authentication';
import {
  type ResetPasswordInput,
  type ResetPasswordOutput,
  password,
} from '@/models/password';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

let responseMessage: ResetPasswordOutput;

async function resetPasswordAction(formData: FormData) {
  'use server';

  const data = form.sanitizeData<ResetPasswordInput>(formData);

  const authDataSource = createAuthenticationDataSource();
  responseMessage = await password.reset(authDataSource, data);

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
