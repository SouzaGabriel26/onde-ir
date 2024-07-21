import bcrypt from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';

import { AuthenticationDataSource } from '@/data/authentication';
import { createUserDataSource } from '@/data/user';
import { ValidationSchema, validator } from '@/models/validator';
import { env } from '@/src/utils/env';
import { Failure, operationResult, Success } from '@/src/utils/operationResult';

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

export type ForgetPasswordOutput = Awaited<ReturnType<typeof forgetPassword>>;

type TokenProps = {
  id: string;
  secretKey: string;
  expiresIn?: string;
};

export type ResetPasswordInput = {
  resetPasswordTokenId: string;
  password: string;
  confirmPassword: string;
};

type ChangePasswordInput = {
  userId: string;
  actualPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const auth = Object.freeze({
  signIn,
  signUp,
  verifyToken,
  forgetPassword,
  resetPassword,
  changePassword,
  setInputError,
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

  const { email, name, password, userName } = secureInput;

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

  const { email, password } = secureInput;

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

  const accessToken = await generateAccessToken({
    id: user.id,
    secretKey: env.jwt_secret,
  });

  return operationResult.success({
    accessToken,
  });
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

export type ForgetPasswordInput = {
  email: string;
};

async function forgetPassword(
  authDataSource: AuthenticationDataSource,
  input: ForgetPasswordInput,
) {
  const { data: secureInput, error } = validator(
    {
      email: input.email,
    },
    {
      email: 'required',
    },
  );

  if (error) {
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableFields[],
    });
  }

  const { email } = secureInput;

  const userFoundByEmail = await authDataSource.findUserByEmail({ email });
  if (!userFoundByEmail) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Este e-mail não está cadastrado',
      fields: ['email'],
    });
  }

  const forgetPasswordToken = await generateAccessToken({
    id: userFoundByEmail.id,
    secretKey: env.reset_password_jwt_secret,
    expiresIn: '5min',
  });

  const { resetPasswordTokenId } =
    await authDataSource.createResetPasswordToken({
      userId: userFoundByEmail.id,
      resetPasswordToken: forgetPasswordToken,
    });

  return operationResult.success({
    resetPasswordTokenId,
    name: userFoundByEmail.name,
  });
}

async function changePassword(
  authDataSource: AuthenticationDataSource,
  input: ChangePasswordInput,
) {
  const insecureInput = {
    userId: input.userId,
    actualPassword: input.actualPassword,
    newPassword: input.newPassword,
    confirmNewPassword: input.confirmNewPassword,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    userId: 'required',
    actualPassword: 'required',
    newPassword: 'required',
    confirmNewPassword: 'required',
  });

  if (error) {
    return operationResult.failure(error);
  }

  const { userId, actualPassword, newPassword, confirmNewPassword } =
    secureInput;

  const areNewPasswordsEqual = newPassword === confirmNewPassword;
  if (!areNewPasswordsEqual) {
    return operationResult.failure<FailureAuthResponse<ChangePasswordInput>>({
      message: 'As novas senhas precisam ser iguais',
      fields: ['newPassword', 'confirmNewPassword'],
    });
  }

  const userDataSource = createUserDataSource();
  const user = await userDataSource.findById({
    id: userId,
    select: ['password'],
  });

  if (!user) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Usuário não encontrado',
      fields: [],
    });
  }

  const isPasswordValid = bcrypt.compareSync(actualPassword, user.password!);
  if (!isPasswordValid) {
    return operationResult.failure<FailureAuthResponse<ChangePasswordInput>>({
      message: 'Senha atual inválida',
      fields: ['actualPassword'],
    });
  }

  const SALT = 12;

  const hashedPassword = bcrypt.hashSync(newPassword, SALT);

  await authDataSource.resetPassword({
    password: hashedPassword,
    userId,
  });

  return operationResult.success({});
}

async function resetPassword(
  authDataSource: AuthenticationDataSource,
  input: ResetPasswordInput,
) {
  const insecureInput = {
    resetPasswordTokenId: input.resetPasswordTokenId,
    password: input.password,
    confirmPassword: input.confirmPassword,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    password: 'required',
    confirmPassword: 'required',
    resetPasswordTokenId: 'required',
  });

  if (error) {
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableFields[],
    });
  }

  const { password, confirmPassword, resetPasswordTokenId } = secureInput;

  if (password !== confirmPassword) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'As senhas precisam ser iguais.',
      fields: ['password', 'confirmPassword'],
    });
  }

  const resetTokenFoundFromId = await authDataSource.findResetPasswordToken({
    where: {
      id: resetPasswordTokenId,
    },
  });

  if (!resetTokenFoundFromId) {
    return operationResult.failure<FailureAuthResponse>({
      message: '"resetPasswordTokenId" inválido.',
      fields: [],
    });
  }

  const { reset_token } = resetTokenFoundFromId;

  const tokenPayload = await verifyToken({
    token: reset_token,
    secret: env.reset_password_jwt_secret,
  });

  if (!tokenPayload) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Token inválido',
      fields: [],
    });
  }

  const SALT = 12;
  const hashedPassword = bcrypt.hashSync(password, SALT);

  await authDataSource.resetPassword({
    password: hashedPassword,
    userId: tokenPayload.sub,
  });

  await authDataSource.deleteResetPasswordToken({
    id: input.resetPasswordTokenId,
  });

  return operationResult.success({});
}

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

function setInputError(
  inputName: AvailableFields,
  responseMessage: Success<unknown> | Failure<FailureAuthResponse>,
) {
  if (!responseMessage?.error) return '';

  const { message, fields } = responseMessage.error;
  const inputHasError = fields.includes(inputName);

  return inputHasError ? message : '';
}
