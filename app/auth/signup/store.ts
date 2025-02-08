'use server';

import { redirect } from 'next/navigation';

import { Welcome } from '@/components/email-templates/Welcome';
import { createAuthenticationDataSource } from '@/data/authentication';
import { getPresignedURL, uploadFileToS3 } from '@/data/lambda';
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
  const sanitizedData = form.sanitizeData<
    SignUpProps & {
      avatar_file?: File;
    }
  >(formData);

  let userAvatarURL = '';

  if (sanitizedData.avatar_file) {
    try {
      const { file_url, presigned_url } = await getPresignedURL(
        sanitizedData.avatar_file,
      );
      await uploadFileToS3(presigned_url, sanitizedData.avatar_file!);

      userAvatarURL = file_url;
    } catch {
      feedbackMessage.setFeedbackMessage({
        content: 'Erro ao enviar a imagem',
        type: 'error',
      });
    }
  }

  const authDataSource = createAuthenticationDataSource();
  const signUpResponse = await auth.signUp(authDataSource, {
    ...sanitizedData,
    avatarUrl: userAvatarURL ? userAvatarURL : undefined,
  });

  if (signUpResponse.data) {
    const { user_name, email, name } = signUpResponse.data;

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

    redirect(`/auth/signin?user_name=${user_name}`);
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
      user_name: sanitizedData.user_name,
    },
  };
}
