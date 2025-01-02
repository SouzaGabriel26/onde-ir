import Link from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { setInputError } from '@/utils/inputError';

import { store } from './store';

type Props = {
  searchParams: Promise<{
    userName?: string;
    redirect_reason?: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const { signInResponse } = store.getSignInResponse();

  const { userName, redirect_reason } = searchParams;

  return (
    <div className="space-y-4 md:w-80">
      {userName && <p>Faça login para o usuário {userName}</p>}
      {redirect_reason === 'not-authenticated' && (
        <p className="text-center">
          Faça login para conseguir utilizar os recursos completos
        </p>
      )}
      <h1 className="text-2xl">Entrar</h1>
      <p className="text-center text-gray-400">
        Não possui uma conta?{' '}
        <Link
          href="/auth/signup"
          className="underline transition-all hover:brightness-125"
        >
          Cadastre-se
        </Link>
        <br />
        Ou
        <br />
        <Link
          href="/dashboard"
          className="underline transition-all hover:brightness-125"
        >
          Entre sem logar
        </Link>
      </p>

      <form action={store.signInAction} className="flex flex-col gap-2">
        <Input
          placeholder="Email*"
          id="email"
          name="email"
          required
          autoComplete="email"
          error={setInputError('email', {
            fields: signInResponse?.error?.fields,
            message: signInResponse?.error?.message,
          })}
        />
        <Input
          placeholder="Senha*"
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          error={setInputError('password', {
            fields: signInResponse?.error?.fields,
            message: signInResponse?.error?.message,
          })}
        />
        <SubmitButton>Entrar</SubmitButton>
      </form>

      <p className="text-center text-sm text-gray-400">
        Esqueceu sua senha?{' '}
        <Link
          href="/auth/forget-password"
          className="underline transition-colors hover:brightness-125"
        >
          clique aqui
        </Link>
      </p>
    </div>
  );
}
