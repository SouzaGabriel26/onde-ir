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
});

//TODO:
// data/authentication.ts:

// testar o método findResetPasswordToken

// refatorar os métodos de fundUser para um só, podendo ser flexível quanto aos
// inputs: id, email, userName
