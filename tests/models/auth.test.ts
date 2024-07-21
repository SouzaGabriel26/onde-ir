import { randomUUID } from 'node:crypto';

import { createAuthenticationDataSource } from '@/data/authentication';
import { database } from '@/infra/database';
import { SignInProps, SignUpProps, auth } from '@/models/authentication';
import { orchestrator } from '@/tests/orchestrator';

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
          message: '"email" precisa ser um email válido.',
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
          message: '"name" precisa ter no mínimo 3 caracteres.',
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
          message: '"userName" não pode ter espaços.',
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
          message: '"password" precisa ter no mínimo 6 caracteres.',
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
          message: '"email" é obrigatório.',
          fields: ['email'],
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
          message: '"email" é obrigatório.',
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
          message: '"email" é obrigatório.',
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
          message: '"email" é obrigatório.',
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
          message: '"password" é obrigatório.',
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
          message: '"email" precisa ser um email válido.',
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
          message: '"email" precisa ser um email válido.',
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
          message: '"email" é obrigatório.',
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
          name: 'Gabriel',
          resetPasswordTokenId: expect.any(String),
        },
      });
    });
  });

  describe('Invoking "resetPassword" method after calling "forgetPassword"', () => {
    const uuid = randomUUID();

    test('Providing an empty object', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.resetPassword(authDataSource, {} as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"resetPasswordTokenId" é obrigatório.',
          fields: ['resetPasswordTokenId'],
        },
      });
    });

    test('Providing invalid "resetPasswordTokenId" property', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.resetPassword(authDataSource, {
        password: '123456',
        confirmPassword: '123456',
        resetPasswordTokenId: 'invalid_token_id',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"resetPasswordTokenId" precisa ser um UUID válido.',
          fields: ['resetPasswordTokenId'],
        },
      });
    });

    test('Without providing "password" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input = {
        confirmPassword: '123456',
        resetPasswordTokenId: uuid,
      };

      const result = await auth.resetPassword(authDataSource, input as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"password" é obrigatório.',
          fields: ['password'],
        },
      });
    });

    test('Without providing "confirmPassword" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input = {
        password: '123456',
        resetPasswordTokenId: uuid,
      };

      const result = await auth.resetPassword(authDataSource, input as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirmPassword" é obrigatório.',
          fields: ['confirmPassword'],
        },
      });
    });

    test('Providing "password" with less than 3 characters', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await auth.resetPassword(authDataSource, {
        resetPasswordTokenId: uuid,
        password: '12',
        confirmPassword: '12',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"password" precisa ter no mínimo 6 caracteres.',
          fields: ['password'],
        },
      });
    });

    test('Providing "password" different from "confirmPassword"', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await auth.resetPassword(authDataSource, {
        password: '123456',
        confirmPassword: '111222333',
        resetPasswordTokenId: uuid,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'As senhas precisam ser iguais.',
          fields: ['password', 'confirmPassword'],
        },
      });
    });

    test('Providing valid parameters and trying to signin with the new password', async () => {
      const userEmail = 'gabriel@email.com';

      const authDataSource = createAuthenticationDataSource();
      const { data } = await auth.forgetPassword(authDataSource, {
        email: userEmail,
      });

      const input = {
        password: 'gabriel123',
        confirmPassword: 'gabriel123',
        resetPasswordTokenId: data!.resetPasswordTokenId,
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

      const resetPasswordTokenAfterReset =
        await authDataSource.findResetPasswordToken({
          where: {
            id: data!.resetPasswordTokenId,
          },
        });

      expect(resetPasswordTokenAfterReset).toBeNull();
    });
  });

  describe('Invoking "changePassword" method', () => {
    test('Providing invalid format "userId" property', async () => {
      const input = {
        userId: 'invalid_id',
        actualPassword: '123123',
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();

      const result = await auth.changePassword(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userId" precisa ser um UUID válido.',
          fields: ['userId'],
        },
      });
    });

    test('Without providing "userId" property', async () => {
      const input = {
        actualPassword: '123123',
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.changePassword(authDataSource, input as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userId" é obrigatório.',
          fields: ['userId'],
        },
      });
    });

    test('Providing a non-existent "userId" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        actualPassword: '123123',
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.changePassword(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Usuário não encontrado',
          fields: [],
        },
      });
    });

    test('Without providing "actualPassword" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.changePassword(authDataSource, input as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"actualPassword" é obrigatório.',
          fields: ['actualPassword'],
        },
      });
    });

    test('Providing an invalid "actualPassword" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const userInput = {
        name: 'Test user',
        email: 'testuser@mail.com',
        password: 'test_user',
        confirmPassword: 'test_user',
        userName: 'testuser',
      };

      await auth.signUp(authDataSource, userInput);

      const createdUser = await authDataSource.findUserByEmail({
        email: userInput.email,
      });

      const result = await auth.changePassword(authDataSource, {
        actualPassword: 'invalid_password',
        newPassword: '123456',
        confirmNewPassword: '123456',
        userId: createdUser!.id,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Senha atual inválida',
          fields: ['actualPassword'],
        },
      });
    });

    test('Without providing "newPassword" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        actualPassword: '123123',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.changePassword(authDataSource, input as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"newPassword" é obrigatório.',
          fields: ['newPassword'],
        },
      });
    });

    test('Providing "newPassword" with less than 6 characters', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        actualPassword: '123123',
        newPassword: '123',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.changePassword(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"newPassword" precisa ter no mínimo 6 caracteres.',
          fields: ['newPassword'],
        },
      });
    });

    test('Without providing "confirmNewPassword" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        actualPassword: '123123',
        newPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.changePassword(authDataSource, input as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirmNewPassword" é obrigatório.',
          fields: ['confirmNewPassword'],
        },
      });
    });

    test('Providing "confirmNewPassword" with less than 6 characters', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        actualPassword: '123123',
        newPassword: '123456',
        confirmNewPassword: '123',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.changePassword(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirmNewPassword" precisa ter no mínimo 6 caracteres.',
          fields: ['confirmNewPassword'],
        },
      });
    });

    test('Providing "newPassword" different from "confirmNewPassword"', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        actualPassword: '123123',
        newPassword: '1234567',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await auth.changePassword(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'As novas senhas precisam ser iguais',
          fields: ['newPassword', 'confirmNewPassword'],
        },
      });
    });

    test('Trying to signin with the old password after changing it', async () => {
      const authDataSource = createAuthenticationDataSource();

      const userInput = {
        name: 'Testing 02',
        email: 'testing-02@email.com',
        password: 'password123',
        confirmPassword: 'password123',
        userName: 'testing_02',
      };
      await auth.signUp(authDataSource, userInput);

      const createdUser = await authDataSource.findUserByEmail({
        email: userInput.email,
      });

      const result = await auth.changePassword(authDataSource, {
        userId: createdUser!.id,
        actualPassword: userInput.password,
        confirmNewPassword: 'newPassword123',
        newPassword: 'newPassword123',
      });

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });

      const signInWithOldPassword = await auth.signIn(authDataSource, {
        email: userInput.email,
        password: userInput.password,
      });

      expect(signInWithOldPassword).toStrictEqual({
        data: null,
        error: {
          message: 'Credenciais inválidas',
          fields: ['email', 'password'],
        },
      });
    });

    test('Trying to signin with the new password after changing it', async () => {
      const input = {
        name: 'Gabriel',
        email: 'teste1@mail.com',
        password: '123456',
        confirmPassword: '123456',
        userName: 'gabriel2608',
      };

      const authDataSource = createAuthenticationDataSource();
      await auth.signUp(authDataSource, input);

      const createdUser = await authDataSource.findUserByEmail({
        email: input.email,
      });

      const newPassword = 'newPassword';

      const result = await auth.changePassword(authDataSource, {
        userId: createdUser!.id,
        actualPassword: input.password,
        newPassword: newPassword,
        confirmNewPassword: newPassword,
      });

      expect(result).toStrictEqual({
        error: null,
        data: {},
      });

      const signInWithNewPassword = await auth.signIn(authDataSource, {
        email: input.email,
        password: newPassword,
      });

      expect(signInWithNewPassword).toStrictEqual({
        error: null,
        data: {
          accessToken: expect.any(String),
        },
      });
    });
  });
});

//TODO:
// data/authentication.ts:

// testar o método findResetPasswordToken

// refatorar os métodos de fundUser para um só, podendo ser flexível quanto aos
// inputs: id, email, userName
