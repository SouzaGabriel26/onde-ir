import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import z from 'zod';

import { AuthenticationDataSource } from '@/data/authentication';
import { constants } from '@/src/utils/constants';
import { env } from '@/src/utils/env';
import { Failure, operationResult, Success } from '@/src/utils/operationResult';
import { SignInProps, SignUpProps } from '@/types';

type FailureAuthResponse = {
  message: string;
  fields: Array<AvailableSignUpFields | AvailableSignInFields>;
};

type SuccessAuthSignUpResponse = {
  email: string;
  name: string;
  userName: string;
};

export type AvailableSignUpFields = keyof SignUpProps;
export type AvailableSignInFields = keyof SignInProps;

export const auth = Object.freeze({
  signIn,
  signUp,
  verifyAccessToken,
});

const signUpSchema = z.object({
  name: z
    .string({
      required_error: 'O nome é obrigatório',
    })
    .min(3, {
      message: 'O nome precisa ter no mínimo 3 caracteres',
    }),
  email: z
    .string({
      required_error: 'O e-mail é obrigatório',
    })
    .email({
      message: 'O e-mail precisa ser válido',
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

export type SignUpResponse =
  | Failure<FailureAuthResponse>
  | Success<SuccessAuthSignUpResponse>;

async function signUp(
  authDataSource: AuthenticationDataSource,
  input: SignUpProps,
): Promise<SignUpResponse> {
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
      fields: validatedInput.error.errors[0].path as AvailableSignUpFields[],
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

const signInSchema = z.object({
  email: z
    .string({
      required_error: 'O e-mail é obrigatório',
    })
    .email({
      message: 'O e-mail precisa ser válido',
    }),
  password: z.string({
    required_error: 'A senha é obrigatória',
  }),
});

export type SignInResponse =
  | Failure<FailureAuthResponse>
  | Success<{
      accessToken: string;
    }>;

async function signIn(
  authDataSource: AuthenticationDataSource,
  input: SignInProps,
): Promise<SignInResponse> {
  const validatedInput = signInSchema.safeParse(input);

  if (!validatedInput.success) {
    return operationResult.failure<FailureAuthResponse>({
      message: validatedInput.error.issues[0].message,
      fields: validatedInput.error.errors[0].path as AvailableSignUpFields[],
    });
  }

  const { email, password } = validatedInput.data;

  const user = await authDataSource.findUserByEmail({ email });

  if (!user) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Credenciais inválidas',
      fields: ['email', 'password'],
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Credenciais inválidas',
      fields: ['email', 'password'],
    });
  }

  const { accessToken } = generateAccessToken({
    id: user.id,
  });

  return operationResult.success({
    accessToken,
  });
}

type TokenPayload = {
  id: string;
};

function generateAccessToken({ id }: TokenPayload) {
  const accessToken = jwt.sign(
    {
      sub: id,
    },
    env.jwt_secret,
    {
      expiresIn: '1d',
    },
  );

  return { accessToken };
}

type VerifyAccessTokenProps = {
  accessToken?: string;
};

function verifyAccessToken({ accessToken }: VerifyAccessTokenProps) {
  if (!accessToken) return null;

  try {
    type Payload = {
      sub: string;
      iat: number;
      exp: number;
    };

    const payload = jwt.verify(accessToken, env.jwt_secret);

    return payload as Payload;
  } catch {
    cookies().delete(constants.accessTokenKey);
    return null;
  }
}
