import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { ForgetPasswordEmail } from '@/components/email-templates/ForgetPassword';
import { SubmitButton } from '@/components/SubmitButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createAuthenticationDataSource } from '@/data/authentication';
import {
  auth,
  ForgetPasswordInput,
  ForgetPasswordOutput,
} from '@/models/authentication';
import { emailService } from '@/models/email';
import { feedbackMessage } from '@/src/utils/feedbackMessage';
import { form } from '@/src/utils/form';

let responseMessage: ForgetPasswordOutput;
let successMessage: {
  email: string;
};

async function forgetPassword(formData: FormData) {
  'use server';

  const { email } = form.sanitizeData<ForgetPasswordInput>(formData);

  const authDataSource = createAuthenticationDataSource();
  responseMessage = await auth.forgetPassword(authDataSource, {
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

export default function Page() {
  return (
    <div className="space-y-4 px-5 md:w-96">
      <h1 className="text-center text-2xl">
        Esqueceu sua senha? Não se preocupe!
      </h1>
      <h2>
        Digite seu email para enviarmos as instruções de recuperação de senha
      </h2>

      <form action={forgetPassword} className="flex flex-col space-y-3">
        <Input
          id="email"
          placeholder="Email*"
          name="email"
          required
          error={auth.setInputError('email', responseMessage)}
        />
        <SubmitButton>Enviar</SubmitButton>
      </form>

      {successMessage && (
        <>
          <p className="mt-4 text-center text-sm text-green-400">
            Instruções enviadas para <strong>{successMessage.email}</strong>
          </p>

          <Button>
            <Link className="hover:underline" href="/">
              Voltar para página principal
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
