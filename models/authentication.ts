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
  forgetPassword,
  verifyResetPasswordToken,
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
    secretKey: env.jwt_secret,
  });

  return operationResult.success({
    accessToken,
  });
}

type Payload = {
  sub: string;
  iat: number;
  exp: number;
};

type VerifyAccessTokenProps = {
  accessToken?: string;
};

function verifyAccessToken({ accessToken }: VerifyAccessTokenProps) {
  if (!accessToken) return null;

  try {
    const payload = jwt.verify(accessToken, env.jwt_secret);

    return payload as Payload;
  } catch {
    cookies().delete(constants.accessTokenKey);
    return null;
  }
}

type ForgetPasswordInput = {
  email: string;
};

const forgetPasswordSchema = signUpSchema.pick({ email: true });

async function forgetPassword(
  authDataSource: AuthenticationDataSource,
  { email }: ForgetPasswordInput,
) {
  const validatedInput = forgetPasswordSchema.safeParse({
    email,
  });

  if (!validatedInput.success) {
    return operationResult.failure<FailureAuthResponse>({
      message: validatedInput.error.issues[0].message,
      fields: ['email'],
    });
  }

  const userFoundByEmail = await authDataSource.findUserByEmail({ email });

  if (!userFoundByEmail) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Este e-mail não está cadastrado',
      fields: ['email'],
    });
  }

  const { accessToken: forgetPasswordToken } = generateAccessToken({
    id: userFoundByEmail.id,
    secretKey: env.reset_password_jwt_secret,
    expiresIn: '5min',
  });

  await authDataSource.createResetPassword({
    userId: userFoundByEmail.id,
    resetPasswordToken: forgetPasswordToken,
  });

  // TODO: send email with userId or token.
  // Sending only userId i can search for the token in database
  // when user click on the link in the email
  return operationResult.success({
    forgetPasswordToken,
    userId: userFoundByEmail.id,
  });
}

type VerifyResetPasswordTokenInput = {
  resetPasswordToken: string;
};

function verifyResetPasswordToken({
  resetPasswordToken,
}: VerifyResetPasswordTokenInput) {
  try {
    const payload = jwt.verify(
      resetPasswordToken,
      env.reset_password_jwt_secret,
    );

    return payload as Payload;
  } catch {
    return null;
  }
}

type TokenProps = {
  id: string;
  secretKey: string;
  expiresIn?: string;
};

function generateAccessToken({ id, secretKey, expiresIn }: TokenProps) {
  const accessToken = jwt.sign(
    {
      sub: id,
    },
    secretKey,
    {
      expiresIn: expiresIn ?? '1d',
    },
  );

  return { accessToken };
}
