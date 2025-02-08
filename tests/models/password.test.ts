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
          reset_password_token_id: expect.any(String),
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
          message: '"reset_password_token_id" é obrigatório.',
          fields: ['reset_password_token_id'],
        },
      });
    });

    test('Providing invalid "reset_password_token_id" property', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await password.reset(authDataSource, {
        password: '123456',
        confirm_password: '123456',
        reset_password_token_id: 'invalid_token_id',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"reset_password_token_id" precisa ser um UUID válido.',
          fields: ['reset_password_token_id'],
        },
      });
    });

    test('Without providing "password" property', async () => {
      const authDataSource = createAuthenticationDataSource();

      const input = {
        confirm_password: '123456',
        reset_password_token_id: uuid,
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
        reset_password_token_id: uuid,
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
        reset_password_token_id: uuid,
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
        reset_password_token_id: uuid,
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
        reset_password_token_id: data!.reset_password_token_id,
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
            id: data!.reset_password_token_id,
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
        reset_password_token_id: data!.reset_password_token_id,
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

    test('Providing invalid "reset_password_token_id" property', async () => {
      const authDataSource = createAuthenticationDataSource();
      const result = await password.reset(authDataSource, {
        password: '123456',
        confirm_password: '123456',
        reset_password_token_id: uuid,
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
    test('Providing invalid format "user_id" property', async () => {
      const input = {
        user_id: 'invalid_id',
        current_password: '123123',
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      const authDataSource = createAuthenticationDataSource();

      const result = await password.change(authDataSource, input);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_id" precisa ser um UUID válido.',
          fields: ['user_id'],
        },
      });
    });

    test('Without providing "user_id" property', async () => {
      const input = {
        current_password: '123123',
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
          message: '"user_id" é obrigatório.',
          fields: ['user_id'],
        },
      });
    });

    test('Providing a non-existent "user_id" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        user_id: fakeUserId,
        current_password: '123123',
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

    test('Without providing "current_password" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        user_id: fakeUserId,
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
          message: '"current_password" é obrigatório.',
          fields: ['current_password'],
        },
      });
    });

    test('Providing an invalid "current_password" property', async () => {
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
        current_password: 'invalid_password',
        newPassword: '123456',
        confirmNewPassword: '123456',
        user_id: createdUser!.id,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Senha atual inválida',
          fields: ['current_password'],
        },
      });
    });

    test('Without providing "newPassword" property', async () => {
      const fakeUserId = '123e4567-e89b-12d3-a456-426614174000';

      const input = {
        user_id: fakeUserId,
        current_password: '123123',
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
        user_id: fakeUserId,
        current_password: '123123',
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
        user_id: fakeUserId,
        current_password: '123123',
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
        user_id: fakeUserId,
        current_password: '123123',
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
        user_id: fakeUserId,
        current_password: '123123',
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
        user_id: createdUser!.id,
        current_password: userInput.password,
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
        user_id: createdUser!.id,
        current_password: input.password,
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
