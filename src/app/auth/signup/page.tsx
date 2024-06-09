import Link from 'next/link';

import { Input } from '@/components/Input';
import { SubmitButton } from '@/components/SubmitButton';

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Cadastre-se</h1>
      <p>
        Já possui uma conta?{' '}
        <Link href="/auth/signin" className="underline">
          Fazer login
        </Link>
      </p>

      <form className="flex flex-col gap-2">
        <Input id="name" label="Nome*" required />
        <Input id="email" label="Email*" required />
        <Input id="password" label="Senha*" type="password" required />
        <Input
          id="confirm_password"
          label="Confirmar Senha*"
          type="password"
          required
        />
        <SubmitButton>Cadastrar</SubmitButton>
      </form>
    </div>
  );
}
