import Link from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { setInputError } from '@/utils/inputError';

import { store } from './store';

export default function Page() {
  const { signUpResponse } = store.getSignUpResponse();

  return (
    <div className="space-y-4 md:w-80">
      <h1 className="text-2xl">Cadastre-se</h1>
      <p className="text-gray-400">
        Já possui uma conta?{' '}
        <Link
          href="/auth/signin"
          className="underline transition-colors hover:brightness-125"
        >
          Fazer login
        </Link>
      </p>

      <form className="flex flex-col gap-3" action={store.signUpAction}>
        <Input
          required
          id="name"
          placeholder="Nome*"
          name="name"
          autoComplete="off"
          error={setInputError('name', {
            fields: signUpResponse?.error?.fields,
            message: signUpResponse?.error?.message,
          })}
        />
        <Input
          required
          id="email"
          placeholder="Email*"
          name="email"
          error={setInputError('email', {
            fields: signUpResponse?.error?.fields,
            message: signUpResponse?.error?.message,
          })}
        />
        <Input
          required
          id="userName"
          placeholder="Username*"
          name="userName"
          autoComplete="off"
          error={setInputError('userName', {
            fields: signUpResponse?.error?.fields,
            message: signUpResponse?.error?.message,
          })}
        />
        <Input
          required
          id="password"
          placeholder="Senha*"
          type="password"
          name="password"
          autoComplete="off"
          error={setInputError('password', {
            fields: signUpResponse?.error?.fields,
            message: signUpResponse?.error?.message,
          })}
        />
        <Input
          required
          id="confirmPassword"
          placeholder="Confirmar Senha*"
          type="password"
          name="confirmPassword"
          autoComplete="off"
          error={setInputError('confirmPassword', {
            fields: signUpResponse?.error?.fields,
            message: signUpResponse?.error?.message,
          })}
        />
        <SubmitButton>Cadastrar</SubmitButton>
      </form>
    </div>
  );
}
