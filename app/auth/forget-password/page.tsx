import Link from 'next/link';

import { SubmitButton } from '@/components/SubmitButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { setInputError } from '@/utils/inputError';

import { store } from './store';

export default function Page() {
  const { responseMessage, successMessage } = store.getForgetPasswordResponse();

  return (
    <div className="space-y-4 px-5 md:w-96">
      <h1 className="text-center text-2xl">
        Esqueceu sua senha? Não se preocupe!
      </h1>
      <h2>
        Digite seu email para enviarmos as instruções de recuperação de senha
      </h2>

      <form action={store.forgetPassword} className="flex flex-col space-y-3">
        <Input
          id="email"
          placeholder="Email*"
          name="email"
          required
          error={setInputError('email', {
            fields: responseMessage?.error?.fields,
            message: responseMessage?.error?.message,
          })}
        />
        <SubmitButton>Enviar</SubmitButton>
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
