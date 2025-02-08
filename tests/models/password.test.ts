import { randomUUID } from 'node:crypto';

import { createAuthenticationDataSource } from '@/data/authentication';
import { auth } from '@/models/authentication';
import {
  type ChangePasswordInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  password,
} from '@/models/password';

import { orchestrator } from '../orchestrator';

beforeAll(async () => {
  await orchestrator.resetDatabase();
});

describe('> models/password', () => {
  describe('Invoking "forgot" method', () => {
    test('Providing invalid "email" property', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await password.forgot(authDataSource, {
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
      const result = await password.forgot(
        authDataSource,
        {} as ForgotPasswordInput,
      );

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
      const result = await password.forgot(authDataSource, {
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
      const existentEmail = 'admin@email.com';

      const authDataSource = createAuthenticationDataSource();
      const result = await password.forgot(authDataSource, {
        email: existentEmail,
      });

      expect(result).toStrictEqual({
        error: null,
        data: {
          name: 'Admin user',
          resetPasswordTokenId: expect.any(String),
        },
      });
    });
  });

  describe('Invoking "reset" method after calling "forgot"', () => {
    const uuid = randomUUID();
    const userEmail = 'admin@email.com';

    test('Providing an empty object', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await password.reset(
        authDataSource,
        {} as ResetPasswordInput,
      );

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
      const result = await password.reset(authDataSource, {
        password: '123456',
        confirm_password: '123456',
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
        confirm_password: '123456',
        resetPasswordTokenId: uuid,
      };

      const result = await password.reset(
        authDataSource,
        input as ResetPasswordInput,
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"password" é obrigatório.',
          fields: ['password'],
        },
      });
    });

    test('Without providing "confirm_password" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input = {
        password: '123456',
        resetPasswordTokenId: uuid,
      };

      const result = await password.reset(
        authDataSource,
        input as ResetPasswordInput,
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_password" é obrigatório.',
          fields: ['confirm_password'],
        },
      });
    });

    test('Providing "password" with less than 3 characters', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await password.reset(authDataSource, {
        resetPasswordTokenId: uuid,
        password: '12',
        confirm_password: '12',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"password" precisa ter no mínimo 6 caracteres.',
          fields: ['password'],
        },
      });
    });

    test('Providing "password" different from "confirm_password"', async () => {
      const authDataSource = createAuthenticationDataSource();

      const result = await password.reset(authDataSource, {
        password: '123456',
        confirm_password: '111222333',
        resetPasswordTokenId: uuid,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'As senhas precisam ser iguais.',
          fields: ['password', 'confirm_password'],
        },
      });
    });

    test('Providing valid parameters and trying to signin with the new password', async () => {
      const authDataSource = createAuthenticationDataSource();
      const { data } = await password.forgot(authDataSource, {
        email: userEmail,
      });

      const input: ResetPasswordInput = {
        password: 'gabriel123',
        confirm_password: 'gabriel123',
        resetPasswordTokenId: data!.resetPasswordTokenId,
      };

      const result = await password.reset(authDataSource, input);

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

      expect(resetPasswordTokenAfterReset?.used).toBe(true);
    });

    test('Providing valid parameters and trying to reset password again with the same tokenId', async () => {
      const authDataSource = createAuthenticationDataSource();

      const { data } = await password.forgot(authDataSource, {
        email: userEmail,
      });

      const input = {
        password: 'newPassword',
        confirm_password: 'newPassword',
        resetPasswordTokenId: data!.resetPasswordTokenId,
      };

      const result = await password.reset(authDataSource, input);

      expect(result).toStrictEqual({
        error: null,
        data: {},
      });

      const resultWithUsedToken = await password.reset(authDataSource, input);
      expect(resultWithUsedToken).toStrictEqual({
        data: null,
        error: {
          message: 'Token inválido.',
          fields: [],
        },
      });
    });

    test('Providing invalid "resetPasswordTokenId" property', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await password.reset(authDataSource, {
        password: '123456',
        confirm_password: '123456',
        resetPasswordTokenId: uuid,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Token inválido.',
          fields: [],
        },
      });
    });
  });

  describe('Invoking "change" method', () => {
    test('Providing invalid format "userId" property', async () => {
      const input = {
        userId: 'invalid_id',
        currentPassword: '123123',
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();

      const result = await password.change(authDataSource, input);

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
        currentPassword: '123123',
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await password.change(
        authDataSource,
        input as ChangePasswordInput,
      );

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
        currentPassword: '123123',
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await password.change(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Usuário não encontrado',
          fields: [],
        },
      });
    });

    test('Without providing "currentPassword" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await password.change(
        authDataSource,
        input as ChangePasswordInput,
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"currentPassword" é obrigatório.',
          fields: ['currentPassword'],
        },
      });
    });

    test('Providing an invalid "currentPassword" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const userInput = {
        name: 'Test user',
        email: 'testuser@mail.com',
        password: 'test_user',
        confirm_password: 'test_user',
        user_name: 'testuser',
      };

      await auth.signUp(authDataSource, userInput);

      const createdUser = await authDataSource.findUserByEmail({
        email: userInput.email,
      });

      const result = await password.change(authDataSource, {
        currentPassword: 'invalid_password',
        newPassword: '123456',
        confirmNewPassword: '123456',
        userId: createdUser!.id,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Senha atual inválida',
          fields: ['currentPassword'],
        },
      });
    });

    test('Without providing "newPassword" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        userId: fakeUserId,
        currentPassword: '123123',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await password.change(
        authDataSource,
        input as ChangePasswordInput,
      );

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
        currentPassword: '123123',
        newPassword: '123',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await password.change(authDataSource, input);

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
        currentPassword: '123123',
        newPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await password.change(
        authDataSource,
        input as ChangePasswordInput,
      );

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
        currentPassword: '123123',
        newPassword: '123456',
        confirmNewPassword: '123',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await password.change(authDataSource, input);

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
        currentPassword: '123123',
        newPassword: '1234567',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();
      const result = await password.change(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'As novas senhas precisam ser iguais',
          fields: ['newPassword', 'confirmNewPassword'],
        },
      });
    });

    test('Trying to signin with the old password after changing it', async () => {
      await orchestrator.resetDatabase();

      const authDataSource = createAuthenticationDataSource();

      const userInput = {
        name: 'Testing 02',
        email: 'testing-02@email.com',
        password: 'password123',
        confirm_password: 'password123',
        user_name: 'testing_02',
      };
      await auth.signUp(authDataSource, userInput);

      const createdUser = await authDataSource.findUserByEmail({
        email: userInput.email,
      });

      const result = await password.change(authDataSource, {
        userId: createdUser!.id,
        currentPassword: userInput.password,
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
      await orchestrator.resetDatabase();

      const input = {
        name: 'test',
        email: 'randomtest@mail.com',
        password: '123456',
        confirm_password: '123456',
        user_name: 'user123',
      };

      const authDataSource = createAuthenticationDataSource();
      await auth.signUp(authDataSource, input);

      const createdUser = await authDataSource.findUserByEmail({
        email: input.email,
      });

      const newPassword = 'newPassword';

      const result = await password.change(authDataSource, {
        userId: createdUser!.id,
        currentPassword: input.password,
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
