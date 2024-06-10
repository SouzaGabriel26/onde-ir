import bcrypt from 'bcrypt';
import z from 'zod';

import { operationResult } from '@/utils/operationResult';

import { AuthenticationDataSource } from '../data/authentication';

type FailureAuthResponse = {
  message: string;
  fields: string[];
};

export type SignUpProps = {
  email: string;
  name: string;
  userName: string;
  password: string;
  confirmPassword: string;
};

export const auth = Object.freeze({
  signUp,
});

const signUpSchema = z.object({
  email: z
    .string({
      required_error: 'O e-mail é obrigatório',
    })
    .email({
      message: 'O e-mail precisa ser válido',
    }),
  name: z
    .string({
      required_error: 'O nome é obrigatório',
    })
    .min(3, {
      message: 'O nome precisa ter no mínimo 3 caracteres',
    }),
  userName: z
    .string({
      required_error: 'O nome de usuário é obrigatório',
    })
    .refine((s) => !s.includes(' '), 'O nome de usuário não pode ter espaços'),
  password: z
    .string({
      required_error: 'A senha é obrigatória',
    })
    .min(6, {
      message: 'A senha precisa ter no mínimo 6 caracteres',
    }),
  confirmPassword: z
    .string({
      required_error: 'A confirmação de senha é obrigatória',
    })
    .min(6, {
      message: 'A confirmação de senha precisa ter no mínimo 6 caracteres',
    }),
});

async function signUp(
  authDataSource: AuthenticationDataSource,
  input: SignUpProps,
) {
  const isPasswordConfirmationValid = input.password === input.confirmPassword;

  if (!isPasswordConfirmationValid) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'As senhas precisam ser iguais',
      fields: ['password', 'confirmPassword'],
    });
  }

  const validatedInput = signUpSchema.safeParse(input);

  if (!validatedInput.success) {
    return operationResult.failure<FailureAuthResponse>({
      message: validatedInput.error.issues[0].message,
      fields: validatedInput.error.errors[0].path as string[],
    });
  }

  const { email, name, password, userName } = validatedInput.data;

  const isEmailAlreadyInUse = await authDataSource.findUserByEmail({ email });

  if (isEmailAlreadyInUse) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'O e-mail já está em uso',
      fields: ['email'],
    });
  }

  const isUserNameAlreadyInUse = await authDataSource.findUserByUserName({
    userName,
  });

  if (isUserNameAlreadyInUse) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'O nome de usuário já está em uso',
      fields: ['userName'],
    });
  }

  const SALT = 12;

  const hashedPassword = bcrypt.hashSync(password, SALT);

  await authDataSource.signUp({
    email,
    name,
    password: hashedPassword,
    userName,
  });

  return operationResult.success({ email, name, userName });
}
