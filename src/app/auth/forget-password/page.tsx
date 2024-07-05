import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/SubmitButton';
import { Button } from '@/components/ui/Button';
import { createAuthenticationDataSource } from '@/data/authentication';
import {
  auth,
  ForgetPasswordInput,
  ForgetPasswordOutput,
} from '@/models/authentication';
import { form } from '@/src/utils/form';

let responseMessage: ForgetPasswordOutput;
let successMessage: {
  email: string;
};

async function forgetPassword(formData: FormData) {
  'use server';

  const { email } = form.sanitizeData<ForgetPasswordInput>(formData);

  const authDataSource = createAuthenticationDataSource();
  responseMessage = await auth.forgetPassword(authDataSource, {
    email,
  });

  if (responseMessage.data) {
    successMessage = { email };
  }

  return revalidatePath('/auth/forget-password');
}

export default function Page() {
  return (
    <div className="space-y-4 px-5 md:w-96">
      <h1 className="text-center text-2xl">
        Esqueceu sua senha? Não se preocupe!
      </h1>
      <h2>
        Digite seu email para enviarmos as instruções de recuperação de senha
      </h2>

      <form action={forgetPassword} className="flex flex-col space-y-3">
        <Input
          id="email"
          label="Email*"
          name="email"
          required
          error={auth.setInputError('email', responseMessage)}
        />
        <SubmitButton className="">Enviar</SubmitButton>
      </form>

      {successMessage && (
        <>
          <p className="mt-4 text-center text-sm text-green-400">
            Instruções enviadas para <strong>{successMessage.email}</strong>
          </p>

          <Button>
            <Link className="hover:underline" href="/">
              Voltar para página principal
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
