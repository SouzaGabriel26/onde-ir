import Link from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { auth } from '@/models/authentication';

import { store } from './store';

type Props = {
  searchParams: {
    tokenId: string;
  };
};

export default function Page({ searchParams }: Props) {
  const { responseMessage } = store.getResponseMessage();

  const { tokenId } = searchParams;

  const hasAuthenticationError =
    !responseMessage?.data && responseMessage?.error?.fields.length === 0;

  if (hasAuthenticationError) {
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

      <form
        action={store.resetPasswordAction}
        key={Date.toString()}
        className="flex flex-col space-y-3"
      >
        <Input
          required
          id="password"
          type="password"
          name="password"
          placeholder="Digite uma nova senha"
          error={auth.setInputError('password', responseMessage as any)}
        />
        <Input
          required
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirmação de senha"
          error={auth.setInputError('confirmPassword', responseMessage as any)}
        />
        <input type="hidden" value={tokenId} name="resetPasswordTokenId" />
        <SubmitButton>Enviar</SubmitButton>
      </form>

      {hasAuthenticationError && (
        <p className="text-center text-red-400">
          {responseMessage.error?.message}
        </p>
      )}
    </div>
  );
}
