import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { createAuthenticationDataSource } from '@/data/authentication';
import { auth, SignInProps, SignInResponse } from '@/models/authentication';
import { constants } from '@/src/utils/constants';
import { form } from '@/src/utils/form';
import { operationResult } from '@/src/utils/operationResult';

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

    return operationResult.success({
      message: 'Login efetuado com sucesso!',
      redirectLink: '/dashboard',
    });
  }

  revalidatePath('/auth/signin');

  return operationResult.failure({
    message: signInResponse.error.message,
  });
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

      <form className="flex flex-col gap-2">
        <Input
          placeholder="Email*"
          id="email"
          name="email"
          required
          autoComplete="email"
          error={auth.setInputError('email', signInResponse)}
        />
        <Input
          placeholder="Senha*"
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          error={auth.setInputError('password', signInResponse)}
        />
        <SubmitButton action={signInAction}>Entrar</SubmitButton>
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
