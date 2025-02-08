import Link from 'next/link';

import { SigninForm } from './SigninForm';

type Props = {
  searchParams: Promise<{
    user_name?: string;
    redirect_reason?: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  const { user_name, redirect_reason } = searchParams;

  return (
    <div className="space-y-4 md:w-80">
      {user_name && <p>Faça login para o usuário {user_name}</p>}
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

      <SigninForm />

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
