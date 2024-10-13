import { SignJWT, jwtVerify } from 'jose';

import type { AuthenticationDataSource } from '@/data/authentication';
import { password } from '@/models/password';
import { type ValidationSchema, validator } from '@/models/validator';
import { env } from '@/utils/env';
import {
  type Failure,
  type Success,
  operationResult,
} from '@/utils/operationResult';

type AvailableSignUpFields = keyof SignUpProps;
type AvailableSignInFields = keyof SignInProps;

type AvailableFields = AvailableSignUpFields | AvailableSignInFields;

export type FailureAuthResponse<T = unknown> = {
  message: string;
  fields: Array<AvailableFields | keyof T>;
};

type SuccessAuthSignUpResponse = {
  email: string;
  name: string;
  userName: string;
};

type Payload = {
  sub: string;
  iat: number;
  exp: number;
};

export type SignUpResponse =
  | Failure<FailureAuthResponse>
  | Success<SuccessAuthSignUpResponse>;

export type SignInResponse =
  | Failure<FailureAuthResponse>
  | Success<{
      accessToken: string;
    }>;

type VerifyTokenProps = {
  token: string;
  secret: string;
};

type TokenProps = {
  id: string;
  secretKey: string;
  expiresIn?: string;
};

export const auth = Object.freeze({
  signIn,
  signUp,
  verifyToken,
  generateAccessToken,
});

export type SignUpProps = {
  email: ValidationSchema['email'];
  name: ValidationSchema['name'];
  userName: ValidationSchema['userName'];
  password: ValidationSchema['password'];
  confirmPassword: ValidationSchema['confirmPassword'];
};

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

  const insecureInput = {
    email: input.email,
    name: input.name,
    userName: input.userName,
    password: input.password,
    confirmPassword: input.confirmPassword,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    name: 'required',
    email: 'required',
    userName: 'required',
    password: 'required',
    confirmPassword: 'required',
  });

  if (error) {
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableSignUpFields[],
    });
  }

  const { email, name, password: userPassword, userName } = secureInput;

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

  const hashedPassword = password.hash(userPassword);

  await authDataSource.signUp({
    email,
    name,
    password: hashedPassword,
    userName,
  });

  return operationResult.success({ email, name, userName });
}

export type SignInProps = {
  email: ValidationSchema['email'];
  password: ValidationSchema['password'];
};

async function signIn(
  authDataSource: AuthenticationDataSource,
  input: SignInProps,
): Promise<SignInResponse> {
  const insecureInput = {
    email: input.email,
    password: input.password,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    email: 'required',
    password: 'required',
  });

  if (error) {
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableSignInFields[],
    });
  }

  const { email, password: userPassword } = secureInput;

  const user = await authDataSource.findUserByEmail({ email });
  if (!user) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Credenciais inválidas',
      fields: ['email', 'password'],
    });
  }

  const isPasswordValid = password.compare(userPassword, user.password);
  if (!isPasswordValid) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Credenciais inválidas',
      fields: ['email', 'password'],
    });
  }

  const accessToken = await generateAccessToken({
    id: user.id,
    secretKey: env.jwt_secret,
    expiresIn: '7d',
  });

  return operationResult.success({
    accessToken,
  });
}

// TODO: move to `tokens` model
async function generateAccessToken({
  id,
  secretKey,
  expiresIn = '1 day',
}: TokenProps) {
  const token = await new SignJWT({ sub: id })
    .setProtectedHeader({
      alg: 'HS256',
      typ: 'JWT',
    })
    .setExpirationTime(expiresIn)
    .setIssuedAt()
    .sign(new TextEncoder().encode(secretKey));

  return token;
}

async function verifyToken({ token, secret }: VerifyTokenProps) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    return payload as Payload;
  } catch {
    return null;
  }
}
