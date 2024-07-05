import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/SubmitButton';
import { createAuthenticationDataSource } from '@/data/authentication';
import { auth, SignInProps, SignInResponse } from '@/models/authentication';
import { constants } from '@/src/utils/constants';
import { form } from '@/src/utils/form';

let signInResponse: SignInResponse;

async function signInAction(formData: FormData) {
  'use server';

  const sanitizedData = form.sanitizeData<SignInProps>(formData);

  const authDataSource = createAuthenticationDataSource();
  signInResponse = await auth.signIn(authDataSource, sanitizedData);

  if (signInResponse.data) {
    const { accessToken } = signInResponse.data;

    const sevenDaysInMilliseconds = 60 * 60 * 24 * 7 * 1000;

    cookies().set(constants.accessTokenKey, accessToken, {
      expires: new Date(Date.now() + sevenDaysInMilliseconds),
      httpOnly: true,
    });
  }

  return redirect('/dashboard');
}

type Props = {
  searchParams: {
    userName?: string;
  };
};

export default function Page({ searchParams }: Props) {
  const { userName } = searchParams;

  return (
    <div className="space-y-4 md:w-80">
      {userName && <p>Faça login para o usuário {userName}</p>}
      <h1 className="text-2xl">Entrar</h1>
      <p className="text-gray-400">
        Não possui uma conta?{' '}
        <Link
          href="/auth/signup"
          className="underline transition-all hover:brightness-125"
        >
          Cadastre-se
        </Link>
      </p>

      <form action={signInAction} className="flex flex-col gap-2">
        <Input
          id="email"
          name="email"
          label="Email*"
          required
          error={auth.setInputError('email', signInResponse)}
        />
        <Input
          id="password"
          name="password"
          label="Senha*"
          type="password"
          required
          error={auth.setInputError('password', signInResponse)}
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
