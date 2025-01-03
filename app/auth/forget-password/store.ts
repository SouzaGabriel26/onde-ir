'use server';

import { revalidatePath } from 'next/cache';

import { ForgetPasswordEmail } from '@/components/email-templates/ForgetPassword';
import { createAuthenticationDataSource } from '@/data/authentication';
import { emailService } from '@/models/email';
import {
  type ForgotPasswordInput,
  type ForgotPasswordOutput,
  password,
} from '@/models/password';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

export type ForgetPasswordActionResponse = ForgotPasswordOutput & {
  inputs?: Partial<ForgotPasswordInput>;
};

export async function forgetPasswordAction(
  _initialState: ForgetPasswordActionResponse,
  formData: FormData,
): Promise<ForgetPasswordActionResponse> {
  'use server';

  const { email } = form.sanitizeData<ForgotPasswordInput>(formData);

  const authDataSource = createAuthenticationDataSource();
  const responseMessage = await password.forgot(authDataSource, {
    email,
  });

  if (responseMessage.data) {
    const { resetPasswordTokenId, name } = responseMessage.data;

    await emailService.sendResetPasswordEmail({
      from: 'Onde Ir <onboarding@resend.dev>',
      to: email,
      content: ForgetPasswordEmail({
        userFirstname: name,
        resetPasswordTokenId,
      }),
    });

    await feedbackMessage.setFeedbackMessage({
      type: 'success',
      content: 'Instruções enviadas para o email informado',
    });

    return {
      data: responseMessage.data,
      error: responseMessage.error,
      inputs: {
        email,
      },
    };
  }

  revalidatePath('/auth/forget-password');

  await feedbackMessage.setFeedbackMessage({
    type: 'error',
    content: responseMessage.error.message,
  });

  return {
    data: responseMessage.data,
    error: responseMessage.error,
    inputs: {
      email,
    },
  };
}
