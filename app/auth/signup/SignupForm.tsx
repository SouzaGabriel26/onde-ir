'use client';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { setInputError } from '@/utils/inputError';
import { useActionState } from 'react';
import { type SignUpActionResponse, signUpAction } from './store';

const initialState: SignUpActionResponse = {
  data: null,
  error: {
    message: '',
    fields: [],
  },
};

export function SignupForm() {
  const [state, action, _isPending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <form className="flex flex-col gap-3" action={action}>
      <Input
        required
        id="name"
        defaultValue={state.inputs?.name}
        placeholder="Nome*"
        name="name"
        autoComplete="off"
        error={setInputError('name', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />
      <Input
        required
        id="email"
        type="email"
        defaultValue={state.inputs?.email}
        placeholder="Email*"
        name="email"
        error={setInputError('email', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />
      <Input
        required
        id="user_name"
        defaultValue={state.inputs?.user_name}
        placeholder="Username*"
        name="user_name"
        autoComplete="off"
        error={setInputError('user_name', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />
      <Input
        required
        id="password"
        defaultValue={state.inputs?.password}
        placeholder="Senha*"
        type="password"
        name="password"
        autoComplete="off"
        error={setInputError('password', {
          fields: state?.error?.fields,
          message: state?.error?.message.replace('password', 'senha'),
        })}
      />
      <Input
        required
        id="confirmPassword"
        defaultValue={state.inputs?.confirmPassword}
        placeholder="Confirmar Senha*"
        type="password"
        name="confirmPassword"
        autoComplete="off"
        error={setInputError('confirmPassword', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />

      <Input
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        name="avatar_file"
        className="cursor-pointer hover:bg-primary-foreground transition-all"
      />

      <SubmitButton>Cadastrar</SubmitButton>
    </form>
  );
}
