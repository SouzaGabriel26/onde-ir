import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/SubmitButton';
import { form } from '@/utils/form';

import { createAuthenticationDataSource } from '../../../../data/authentication';
import {
  auth,
  AvailableSignUpFields,
  SignUpResponse,
} from '../../../../models/authentication';
import { SignUpProps } from '../../../../types';

let signUpResponse: SignUpResponse;

async function signUpAction(formData: FormData) {
  'use server';

  const sanitizedData = form.sanitizeData<SignUpProps>(formData);

  const authDataSource = createAuthenticationDataSource();
  signUpResponse = await auth.signUp(authDataSource, sanitizedData);

  if (signUpResponse.data) {
    redirect(`/auth/signin?userName=${signUpResponse.data.userName}`);
  }

  return revalidatePath('/auth/signup');
}

export default function Page() {
  function setInputError(inputName: AvailableSignUpFields) {
    if (!signUpResponse?.error) return '';

    const { message, fields } = signUpResponse.error;

    const inputHasError = fields.includes(inputName);

    return inputHasError ? message : '';
  }

  return (
    <div className="w-80 space-y-4">
      <h1 className="text-2xl">Cadastre-se</h1>
      <p>
        Já possui uma conta?{' '}
        <Link href="/auth/signin" className="underline">
          Fazer login
        </Link>
      </p>

      <form action={signUpAction} className="flex flex-col gap-3">
        <Input
          required
          id="name"
          label="Nome*"
          name="name"
          autoComplete="off"
          error={setInputError('name')}
        />
        <Input
          required
          id="email"
          label="Email*"
          name="email"
          error={setInputError('email')}
        />
        <Input
          required
          id="userName"
          label="Username*"
          name="userName"
          autoComplete="off"
          error={setInputError('userName')}
        />
        <Input
          required
          id="password"
          label="Senha*"
          type="password"
          name="password"
          autoComplete="off"
          error={setInputError('password')}
        />
        <Input
          required
          id="confirmPassword"
          label="Confirmar Senha*"
          type="password"
          name="confirmPassword"
          autoComplete="off"
          error={setInputError('confirmPassword')}
        />
        <SubmitButton>Cadastrar</SubmitButton>
      </form>
    </div>
  );
}
