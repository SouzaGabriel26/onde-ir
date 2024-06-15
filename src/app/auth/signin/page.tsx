import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createAuthenticationDataSource } from '@/data/authentication';
import {
  auth,
  AvailableSignInFields,
  SignInResponse,
} from '@/models/authentication';
import { Input } from '@/src/components/Input';
import { SubmitButton } from '@/src/components/SubmitButton';
import { constants } from '@/src/utils/constants';
import { form } from '@/src/utils/form';
import { SignInProps } from '@/types';

type Props = {
  searchParams: {
    userName?: string;
  };
};

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

export default function Page({ searchParams }: Props) {
  const { userName } = searchParams;

  function setInputError(inputName: AvailableSignInFields) {
    if (!signInResponse?.error) return '';

    const { fields, message } = signInResponse.error;
    const inputHasError = fields.includes(inputName);

    return inputHasError ? message : '';
  }

  return (
    <div className="space-y-4">
      {userName && <p>Faça login para o usuário {userName}</p>}
      <h1 className="text-2xl">Entrar</h1>
      <p>
        Não possui uma conta?{' '}
        <Link href="/auth/signup" className="underline">
          Cadastre-se
        </Link>
      </p>

      <form action={signInAction} className="flex flex-col gap-2">
        <Input
          id="email"
          name="email"
          label="Email*"
          required
          error={setInputError('email')}
        />
        <Input
          id="password"
          name="password"
          label="Senha*"
          type="password"
          required
          error={setInputError('password')}
        />
        <SubmitButton>Entrar</SubmitButton>
      </form>
    </div>
  );
}
