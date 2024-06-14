import Link from 'next/link';

import { Input } from '@/src/components/Input';
import { SubmitButton } from '@/src/components/SubmitButton';

type Props = {
  searchParams: {
    userName?: string;
  };
};

export default function Page({ searchParams }: Props) {
  const { userName } = searchParams;

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

      <form className="flex flex-col gap-2">
        <Input id="email" label="Email*" required />
        <Input id="password" label="Senha*" type="password" required />
        <SubmitButton>Entrar</SubmitButton>
      </form>
    </div>
  );
}
