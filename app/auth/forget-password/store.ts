import { revalidatePath } from 'next/cache';

import { ForgetPasswordEmail } from '@/components/email-templates/ForgetPassword';
import { createAuthenticationDataSource } from '@/data/authentication';
import { emailService } from '@/models/email';
import {
  ForgotPasswordInput,
  ForgotPasswordOutput,
  password,
} from '@/models/password';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

let responseMessage: ForgotPasswordOutput;
let successMessage: {
  email: string;
};

async function forgetPassword(formData: FormData) {
  'use server';

  const { email } = form.sanitizeData<ForgotPasswordInput>(formData);

  const authDataSource = createAuthenticationDataSource();
  responseMessage = await password.forgot(authDataSource, {
    email,
  });

  if (responseMessage.data) {
    successMessage = { email };
    const { resetPasswordTokenId, name } = responseMessage.data;

    await emailService.sendResetPasswordEmail({
      from: 'Onde Ir <onboarding@resend.dev>',
      to: email,
      content: ForgetPasswordEmail({
        userFirstname: name,
        resetPasswordTokenId,
      }),
    });

    feedbackMessage.setFeedbackMessage({
      type: 'success',
      content: 'Instruções enviadas para o email informado',
    });

    return;
  }

  revalidatePath('/auth/forget-password');

  feedbackMessage.setFeedbackMessage({
    type: 'error',
    content: responseMessage.error.message,
  });
}

function getForgetPasswordResponse() {
  return Object.freeze({
    responseMessage,
    successMessage,
  });
}

export const store = Object.freeze({
  forgetPassword,
  getForgetPasswordResponse,
});
