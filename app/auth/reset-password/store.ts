'use server';

import { redirect } from 'next/navigation';

import { createAuthenticationDataSource } from '@/data/authentication';
import {
  type ResetPasswordInput,
  type ResetPasswordOutput,
  password,
} from '@/models/password';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

export type ResetPasswordActionResponse = ResetPasswordOutput & {
  inputs?: Partial<ResetPasswordInput>;
};

export async function resetPasswordAction(
  _prevState: ResetPasswordActionResponse,
  formData: FormData,
): Promise<ResetPasswordActionResponse> {
  const data = form.sanitizeData<ResetPasswordInput>(formData);

  const authDataSource = createAuthenticationDataSource();
  const responseMessage = await password.reset(authDataSource, data);

  if (responseMessage.error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: responseMessage.error.message,
    });

    return {
      data: responseMessage.data,
      error: responseMessage.error,
      inputs: {
        resetPasswordTokenId: data.resetPasswordTokenId,
        confirmPassword: data.confirmPassword,
        password: data.password,
      },
    };
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Senha atualizada com sucesso',
  });

  redirect('/auth/signin');
}
