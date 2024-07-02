import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createAuthenticationDataSource } from '@/data/authentication';
import { auth, SignUpProps, SignUpResponse } from '@/models/authentication';
import { Input } from '@/src/components/Input';
import { SubmitButton } from '@/src/components/SubmitButton';
import { form } from '@/src/utils/form';

let signUpResponse: SignUpResponse;

async function signUpAction(formData: FormData) {
  'use server';

  const sanitizedData = form.sanitizeData<SignUpProps>(formData);

  const authDataSource = createAuthenticationDataSource();
  signUpResponse = await auth.signUp(authDataSource, sanitizedData);

  if (signUpResponse.data) {
    const { userName } = signUpResponse.data;

    redirect(`/auth/signin?userName=${userName}`);
  }

  return revalidatePath('/auth/signup');
}

export default function Page() {
  return (
    <div className="space-y-4 md:w-80">
      <h1 className="text-2xl">Cadastre-se</h1>
      <p className="text-gray-400">
        Já possui uma conta?{' '}
        <Link
          href="/auth/signin"
          className="underline transition-colors hover:text-primary"
        >
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
          error={auth.setInputError('name', signUpResponse)}
        />
        <Input
          required
          id="email"
          label="Email*"
          name="email"
          error={auth.setInputError('email', signUpResponse)}
        />
        <Input
          required
          id="userName"
          label="Username*"
          name="userName"
          autoComplete="off"
          error={auth.setInputError('userName', signUpResponse)}
        />
        <Input
          required
          id="password"
          label="Senha*"
          type="password"
          name="password"
          autoComplete="off"
          error={auth.setInputError('password', signUpResponse)}
        />
        <Input
          required
          id="confirmPassword"
          label="Confirmar Senha*"
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
