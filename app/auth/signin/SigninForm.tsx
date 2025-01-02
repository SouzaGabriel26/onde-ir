'use client';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { setInputError } from '@/utils/inputError';
import { useActionState } from 'react';
import { type SignInResponseAction, signInAction } from './store';

const initialState: SignInResponseAction = {
  data: null,
  error: {
    message: '',
    fields: [],
  },
};

export function SigninForm() {
  const [state, action, _isPending] = useActionState(
    signInAction,
    initialState,
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <Input
        placeholder="Email*"
        id="email"
        defaultValue={state.inputs?.email}
        name="email"
        type="email"
        required
        autoComplete="email"
        error={setInputError('email', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />
      <Input
        placeholder="Senha*"
        id="password"
        defaultValue={state.inputs?.password}
        name="password"
        type="password"
        required
        autoComplete="current-password"
        error={setInputError('password', {
          fields: state?.error?.fields,
          message: state?.error?.message.replace('password', 'senha'),
        })}
      />
      <SubmitButton>Entrar</SubmitButton>
    </form>
  );
}
