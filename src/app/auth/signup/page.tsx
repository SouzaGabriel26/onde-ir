import Link from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { auth } from '@/models/authentication';

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
          error={auth.setInputError('name', signUpResponse)}
        />
        <Input
          required
          id="email"
          placeholder="Email*"
          name="email"
          error={auth.setInputError('email', signUpResponse)}
        />
        <Input
          required
          id="userName"
          placeholder="Username*"
          name="userName"
          autoComplete="off"
          error={auth.setInputError('userName', signUpResponse)}
        />
        <Input
          required
          id="password"
          placeholder="Senha*"
          type="password"
          name="password"
          autoComplete="off"
          error={auth.setInputError('password', signUpResponse)}
        />
        <Input
          required
          id="confirmPassword"
          placeholder="Confirmar Senha*"
          type="password"
          name="confirmPassword"
          autoComplete="off"
          error={auth.setInputError('confirmPassword', signUpResponse)}
        />
        <SubmitButton>Cadastrar</SubmitButton>
      </form>
    </div>
  );
}
