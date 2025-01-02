import Link from 'next/link';

import { SignupForm } from './SignupForm';

export default function Page() {
  return (
    <div className="space-y-4 md:w-80">
      <h1 className="text-2xl">Cadastre-se</h1>
      <p className="text-gray-400">
        Já possui uma conta?{' '}
        <Link
          href="/auth/signin"
          className="underline transition-colors hover:brightness-125"
        >
          Fazer login
        </Link>
      </p>

      <SignupForm />
    </div>
  );
}
