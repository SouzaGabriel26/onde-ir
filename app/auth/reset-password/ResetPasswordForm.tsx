'use client';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { setInputError } from '@/utils/inputError';
import Link from 'next/link';
import { useActionState } from 'react';
import { type ResetPasswordActionResponse, resetPasswordAction } from './store';

const initialState: ResetPasswordActionResponse = {
  data: {},
  error: null,
};

export function ResetPasswordForm({ tokenId }: { tokenId: string }) {
  const [state, action, _isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  const hasAuthenticationError =
    !state?.data && state?.error?.fields.length === 0;

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
    <form
      action={action}
      key={Date.toString()}
      className="flex flex-col space-y-3"
    >
      <Input
        required
        id="password"
        defaultValue={state?.inputs?.password}
        type="password"
        name="password"
        placeholder="Digite uma nova senha"
        error={setInputError('password', {
          fields: state?.error?.fields,
          message: state?.error?.message.replace('password', 'senha'),
        })}
      />
      <Input
        required
        id="confirmPassword"
        defaultValue={state?.inputs?.confirmPassword}
        type="password"
        name="confirmPassword"
        placeholder="Confirmação de senha"
        error={setInputError('confirmPassword', {
          fields: state?.error?.fields,
          message: state?.error?.message.replace(
            'confirmPassword',
            'confirmação de senha',
          ),
        })}
      />
      <input type="hidden" value={tokenId} name="resetPasswordTokenId" />
      <SubmitButton>Enviar</SubmitButton>
    </form>
  );
}
