import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { createAuthenticationDataSource } from '@/data/authentication';
import {
  auth,
  FailureAuthResponse,
  ResetPasswordInput,
} from '@/models/authentication';
import { form } from '@/src/utils/form';
import { Failure, operationResult, Success } from '@/src/utils/operationResult';

let responseMessage: Success<{}> | Failure<FailureAuthResponse>;

async function resetPasswordAction(formData: FormData) {
  'use server';

  const data = form.sanitizeData<ResetPasswordInput>(formData);

  const authDataSource = createAuthenticationDataSource();
  responseMessage = await auth.resetPassword(authDataSource, data);

  if (responseMessage.error) {
    revalidatePath('/auth/reset-password');

    return operationResult.failure({
      message: responseMessage.error.message,
    });
  }

  return operationResult.success({
    message: 'Senha atualizada com sucesso',
    redirectLink: '/auth/signin',
  });
}

type Props = {
  searchParams: {
    tokenId: string;
  };
};

export default function Page({ searchParams }: Props) {
  const { tokenId } = searchParams;

  const result = true;

  const hasAuthenticationErrorMessage =
    !responseMessage?.data && responseMessage?.error?.fields.length === 0;

  const errorMessage =
    hasAuthenticationErrorMessage &&
    responseMessage.error?.message.replace('resetPasswordTokenId', 'Acesso');

  if (!result) {
    return (
      <div>
        <h1>
          Token inválido ou expirado. Por favor, solicite uma nova recuperação
          de senha.
        </h1>

        <br />

        <Link href="/auth/forget-password" className="underline">
          Solicitar nova recuperação de senha
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:w-80">
      <h1>Atualização de senha</h1>

      <form key={Date.toString()} className="flex flex-col space-y-3">
        <Input
          required
          id="password"
          type="password"
          name="password"
          placeholder="Digite uma nova senha"
          error={auth.setInputError('password', responseMessage)}
        />
        <Input
          required
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirmação de senha"
          error={auth.setInputError('confirmPassword', responseMessage)}
        />
        <input type="hidden" value={tokenId} name="resetPasswordTokenId" />
        <SubmitButton action={resetPasswordAction}>Enviar</SubmitButton>
      </form>

      {errorMessage && (
        <p className="text-center text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
