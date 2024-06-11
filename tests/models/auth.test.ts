import { createAuthenticationDataSource } from '../../data/authentication';
import { database } from '../../infra/database';
import { auth, SignUpProps } from '../../models/authentication';
import { orchestrator } from '../orchestrator';

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
          message: 'O e-mail é obrigatório',
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
});
