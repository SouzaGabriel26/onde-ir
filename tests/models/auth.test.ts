import { createAuthenticationDataSource } from '@/data/authentication';
import { database } from '@/infra/database';
import { auth } from '@/models/authentication';
import { orchestrator } from '@/tests/orchestrator';
import { SignInProps, SignUpProps } from '@/types';

beforeAll(async () => {
  await orchestrator.resetDatabase();
});

afterAll(async () => {
  await database.endAllPools();
});

describe('> models/authentication', () => {
  describe('Invoking "signUp" method', () => {
    test('Passing correctly props', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input: SignUpProps = {
        email: 'gabriel+1@email.com',
        name: 'Gabriel',
        userName: 'gabriel26',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = await auth.signUp(authDataSource, input);

      expect(result).toStrictEqual({
        error: null,
        data: {
          email: 'gabriel+1@email.com',
          name: 'Gabriel',
          userName: 'gabriel26',
        },
      });
    });

    test('Passing "password" different from "confirmPassword"', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input: SignUpProps = {
        email: 'gabriel@mail.com',
        name: 'Gabriel',
        userName: 'gabriel26',
        password: '123456',
        confirmPassword: '1234567',
      };

      const result = await auth.signUp(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'As senhas precisam ser iguais',
          fields: ['password', 'confirmPassword'],
        },
      });
    });

    test('Passing invalid "email"', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input: SignUpProps = {
        email: 'gabrielmail.com',
        name: 'Gabriel',
        userName: 'gabriel26',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = await auth.signUp(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O e-mail precisa ser válido',
          fields: ['email'],
        },
      });
    });

    test('Passing "name" with less than 3 characters', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input: SignUpProps = {
        email: 'gabriel@mail.com',
        name: 'ga',
        userName: 'gabriel26',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = await auth.signUp(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O nome precisa ter no mínimo 3 caracteres',
          fields: ['name'],
        },
      });
    });

    test('Passing "userName" with spaces', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input: SignUpProps = {
        email: 'gabriel@mail.com',
        name: 'Gabriel',
        userName: 'gabriel 26',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = await auth.signUp(authDataSource, input);
      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O nome de usuário não pode ter espaços',
          fields: ['userName'],
        },
      });
    });

    test('Passing "password" with less than 6 characters', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input: SignUpProps = {
        email: 'gabriel@mail.com',
        name: 'Gabriel',
        userName: 'gabriel26',
        password: '1234',
        confirmPassword: '1234',
      };

      const result = await auth.signUp(authDataSource, input);
      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'A senha precisa ter no mínimo 6 caracteres',
          fields: ['password'],
        },
      });
    });

    test('Passing an empty object', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await auth.signUp(authDataSource, {} as SignUpProps);
      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O nome é obrigatório',
          fields: ['name'],
        },
      });
    });

    test('Without passing some of required properties (email)', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input = {
        name: 'Gabriel',
        userName: 'gabriel26',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = await auth.signUp(authDataSource, input as SignUpProps);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O e-mail é obrigatório',
          fields: ['email'],
        },
      });
    });

    test('Trying to sign up a user with an existant e-mail', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input: SignUpProps = {
        email: 'gabriel@email.com',
        name: 'Gabriel',
        userName: 'gabrielNovo',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = await auth.signUp(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O e-mail já está em uso',
          fields: ['email'],
        },
      });
    });

    test('Trying to sign up a user with an existant userName', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input: SignUpProps = {
        email: 'gabrie+1@email.com',
        name: 'Gabriel',
        userName: 'gbsouza',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = await auth.signUp(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O nome de usuário já está em uso',
          fields: ['userName'],
        },
      });
    });
  });

  describe('Invoking "signIn" method', () => {
    test('Providing an empty object', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await auth.signIn(authDataSource, {} as SignInProps);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O e-mail é obrigatório',
          fields: ['email'],
        },
      });
    });

    test('Providing no "email" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await auth.signIn(authDataSource, {
        password: '123456',
      } as SignInProps);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O e-mail é obrigatório',
          fields: ['email'],
        },
      });
    });

    test('Providing no "password" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await auth.signIn(authDataSource, {
        email: 'gabriel@email.com',
      } as SignInProps);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'A senha é obrigatória',
          fields: ['password'],
        },
      });
    });

    test('Providing invalid "email"', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await auth.signIn(authDataSource, {
        email: 'example@mail.com',
        password: '123456',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Credenciais inválidas',
          fields: ['email', 'password'],
        },
      });
    });

    test('Providing invalid "password"', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await auth.signIn(authDataSource, {
        email: 'gabriel@email.com',
        password: 'invalid',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Credenciais inválidas',
          fields: ['email', 'password'],
        },
      });
    });

    test('Providing correctly properties', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await auth.signIn(authDataSource, {
        email: 'gabriel@email.com',
        password: '123456',
      });

      expect(result).toStrictEqual({
        error: null,
        data: {
          accessToken: expect.any(String),
        },
      });

      expect(result.data?.accessToken.split('.').length).toBe(3);
    });

    test('Providing email without following the pattern', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.signIn(authDataSource, {
        email: 'gabrielmail.com',
        password: '123456',
      });

      expect(result).toStrictEqual({
        error: {
          message: 'O e-mail precisa ser válido',
          fields: ['email'],
        },
        data: null,
      });
    });
  });

  describe('Invoking "forgetPassword" method', () => {
    test('Providing invalid "email" property', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.forgetPassword(authDataSource, {
        email: 'Gabriel a',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O e-mail precisa ser válido',
          fields: ['email'],
        },
      });
    });

    test('Providing an empty object', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.forgetPassword(authDataSource, {} as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'O e-mail é obrigatório',
          fields: ['email'],
        },
      });
    });

    test('Providing a non existent "email', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.forgetPassword(authDataSource, {
        email: 'teste@mail.com',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Este e-mail não está cadastrado',
          fields: ['email'],
        },
      });
    });

    test('Providing an existent "email"', async () => {
      const existentEmail = 'gabriel@email.com';

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.forgetPassword(authDataSource, {
        email: existentEmail,
      });

      expect(result).toStrictEqual({
        error: null,
        data: {
          forgetPasswordToken: expect.any(String),
          userId: expect.any(String),
        },
      });
    });

    test('Verifying if the token is valid', async () => {
      const existentEmail = 'gabriel@email.com';

      const authDataSource = createAuthenticationDataSource();
      const { data } = await auth.forgetPassword(authDataSource, {
        email: existentEmail,
      });

      expect(data).toStrictEqual({
        forgetPasswordToken: expect.any(String),
        userId: expect.any(String),
      });

      const payload = auth.verifyResetPasswordToken({
        resetPasswordToken: data!.forgetPasswordToken,
      });

      expect(Object.keys(payload!)).toStrictEqual(['sub', 'iat', 'exp']);
    });
  });

  describe('Invoking "resetPassword" method after calling "forgetPassword"', () => {
    test('Providing an empty object', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.resetPassword(authDataSource, {} as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Token é obrigatório',
          fields: [],
        },
      });
    });

    test('Providing invalid "token" property', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.resetPassword(authDataSource, {
        password: '123456',
        confirmPassword: '123456',
        resetPasswordToken: 'invalid_token',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Token inválido',
          fields: [],
        },
      });
    });

    test('Without providing "password" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input = {
        confirmPassword: '123456',
        resetPasswordToken: 'token',
      };

      const result = await auth.resetPassword(authDataSource, input as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'A senha é obrigatória',
          fields: ['password', 'confirmPassword'],
        },
      });
    });

    test('Without providing "confirmPassword" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input = {
        password: '123456',
        resetPasswordToken: 'token',
      };

      const result = await auth.resetPassword(authDataSource, input as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'A confirmação de senha é obrigatória',
          fields: ['password', 'confirmPassword'],
        },
      });
    });

    test('Providing "password" with less than 3 characters', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.resetPassword(authDataSource, {
        resetPasswordToken: 'token',
        password: '12',
        confirmPassword: '12',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'A senha precisa ter no mínimo 6 caracteres',
          fields: ['password', 'confirmPassword'],
        },
      });
    });

    test('Providing "password" different from "confirmPassword"', async () => {
      const authDataSource = createAuthenticationDataSource();
      const { data } = await auth.forgetPassword(authDataSource, {
        email: 'gabriel@email.com',
      });

      const result = await auth.resetPassword(authDataSource, {
        password: '123456',
        confirmPassword: '111222333',
        resetPasswordToken: data!.forgetPasswordToken,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'As senhas precisam ser iguais',
          fields: ['password', 'confirmPassword'],
        },
      });
    });

    test('Providing valid parameters and trying to signin with the new password', async () => {
      const authDataSource = createAuthenticationDataSource();

      const userEmail = 'gabriel@email.com';

      const { data } = await auth.forgetPassword(authDataSource, {
        email: userEmail,
      });

      const input = {
        password: 'gabriel123',
        confirmPassword: 'gabriel123',
        resetPasswordToken: data!.forgetPasswordToken,
      };

      const result = await auth.resetPassword(authDataSource, input);

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });

      const signInResult = await auth.signIn(authDataSource, {
        email: userEmail,
        password: input.password,
      });

      expect(signInResult).toStrictEqual({
        error: null,
        data: {
          accessToken: expect.any(String),
        },
      });
    });
  });
});
