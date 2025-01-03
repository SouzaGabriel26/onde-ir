'use client';

import Link from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { setInputError } from '@/utils/inputError';
import { useActionState } from 'react';
import {
  type ForgetPasswordActionResponse,
  forgetPasswordAction,
} from './store';

const initialState: ForgetPasswordActionResponse = {
  data: null,
  error: {
    message: '',
    fields: [],
  },
};

export default function Page() {
  const [state, action, _isPending] = useActionState(
    forgetPasswordAction,
    initialState,
  );

  return (
    <div className="space-y-4 px-5 md:w-96">
      <h1 className="text-center text-2xl">
        Esqueceu sua senha? Não se preocupe!
      </h1>
      <h2>
        Digite seu email para enviarmos as instruções de recuperação de senha
      </h2>

      <form action={action} className="flex flex-col space-y-3">
        <Input
          id="email"
          defaultValue={state.inputs?.email}
          placeholder="Email*"
          type="email"
          name="email"
          required
          error={setInputError('email', {
            fields: state?.error?.fields,
            message: state?.error?.message,
          })}
        />
        <SubmitButton>Enviar</SubmitButton>
      </form>

      {state.data?.name && (
        <>
          <p className="mt-4 text-center text-sm text-green-400">
            Instruções enviadas para <strong>{state.inputs?.email}</strong>
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
