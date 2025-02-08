import crypto from 'node:crypto';

import { validator } from '@/models/validator';

describe('> models/validator', () => {
  test('Providing an empty object', () => {
    const result = validator({}, {});

    expect(result).toStrictEqual({
      data: null,
      error: {
        message: 'O input não pode ser vazio.',
        fields: [],
      },
    });
  });

  test('Providing a undefined value to optional parameter', () => {
    const result = validator(
      {
        name: undefined,
      },
      {
        name: 'optional',
      },
    );

    expect(result).toStrictEqual({
      data: {},
      error: null,
    });
  });

  test('Providing a null value to optional parameter', () => {
    const result = validator(
      {
        name: null as unknown as string,
      },
      {
        name: 'optional',
      },
    );

    expect(result).toStrictEqual({
      data: null,
      error: {
        message: '"name" precisa ser uma string.',
        fields: ['name'],
      },
    });
  });

  test('Providing a null value to required parameter', () => {
    const result = validator(
      {
        name: null as unknown as string,
      },
      {
        name: 'required',
      },
    );

    expect(result).toStrictEqual({
      data: null,
      error: {
        message: '"name" precisa ser uma string.',
        fields: ['name'],
      },
    });
  });

  test('Providing a undefined value to required parameter', () => {
    const result = validator(
      {
        name: undefined,
      },
      {
        name: 'required',
      },
    );

    expect(result).toStrictEqual({
      data: null,
      error: {
        message: '"name" é obrigatório.',
        fields: ['name'],
      },
    });
  });

  describe('Testing "name"', () => {
    test('Providing a valid value to optional parameter', () => {
      const result = validator(
        {
          name: 'Gabriel',
        },
        {
          name: 'optional',
        },
      );

      expect(result).toStrictEqual({
        error: null,
        data: {
          name: 'Gabriel',
        },
      });
    });

    test('Providing a invalid type to optional parameter', () => {
      const result = validator(
        {
          name: 123 as unknown as string,
        },
        {
          name: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"name" precisa ser uma string.',
          fields: ['name'],
        },
      });
    });

    test('Providing name with less than 3 characters and optional parameter', () => {
      const result = validator(
        {
          name: 'ga',
        },
        {
          name: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"name" precisa ter no mínimo 3 caracteres.',
          fields: ['name'],
        },
      });
    });

    test('Providing a invalid type to required parameter', () => {
      const result = validator(
        {
          name: 123 as unknown as string,
        },
        {
          name: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"name" precisa ser uma string.',
          fields: ['name'],
        },
      });
    });

    test('Providing name with less than 3 characters and required parameter', () => {
      const result = validator(
        {
          name: 'ga',
        },
        {
          name: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"name" precisa ter no mínimo 3 caracteres.',
          fields: ['name'],
        },
      });
    });

    test('Providing a untrimmed name', () => {
      const untrimmedName = '  Gabriel  ';

      const result = validator(
        {
          name: untrimmedName,
        },
        {
          name: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          name: 'Gabriel',
        },
        error: null,
      });
    });
  });

  describe('Testing "email"', () => {
    test('Providing valid value to optional parameter', () => {
      const email = 'teste@email.com';

      const result = validator(
        {
          email: email,
        },
        {
          email: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          email: email,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter', () => {
      const result = validator(
        {
          email: 123 as unknown as string,
        },
        {
          email: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"email" precisa ser uma string.',
          fields: ['email'],
        },
      });
    });

    test('Providing a invalid email to optional parameter', () => {
      const result = validator(
        {
          email: 'testeemail.com',
        },
        {
          email: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"email" precisa ser um email válido.',
          fields: ['email'],
        },
      });
    });

    test('Providing a invalid type to required parameter', () => {
      const result = validator(
        {
          email: 123 as unknown as string,
        },
        {
          email: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"email" precisa ser uma string.',
          fields: ['email'],
        },
      });
    });

    test('Providing a invalid email to required parameter', () => {
      const result = validator(
        {
          email: 'testeemail.com',
        },
        {
          email: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"email" precisa ser um email válido.',
          fields: ['email'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const email = 'teste@email.com';

      const result = validator(
        {
          email: email,
        },
        {
          email: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          email: email,
        },
        error: null,
      });
    });
  });

  describe('Testing "user_name"', () => {
    test('Providing valid value to optional parameter', () => {
      const user_name = 'testeusername';

      const result = validator(
        {
          user_name,
        },
        {
          user_name: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          user_name,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter', () => {
      const result = validator(
        {
          user_name: 123 as unknown as string,
        },
        {
          user_name: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_name" precisa ser uma string.',
          fields: ['user_name'],
        },
      });
    });

    test('Providing a invalid user_name (with spaces) to optional parameter', () => {
      const result = validator(
        {
          user_name: 'user name',
        },
        {
          user_name: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_name" não pode ter espaços.',
          fields: ['user_name'],
        },
      });
    });

    test('Providing a invalid type to required parameter', () => {
      const result = validator(
        {
          user_name: 123 as unknown as string,
        },
        {
          user_name: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_name" precisa ser uma string.',
          fields: ['user_name'],
        },
      });
    });

    test('Providing a invalid user_name (with spaces) to required parameter', () => {
      const result = validator(
        {
          user_name: 'user name',
        },
        {
          user_name: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_name" não pode ter espaços.',
          fields: ['user_name'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const user_name = 'testeusername';

      const result = validator(
        {
          user_name,
        },
        {
          user_name: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          user_name,
        },
        error: null,
      });
    });
  });

  describe('Testing "password"', () => {
    test('Providing valid value to optional parameter', () => {
      const password = 'password';

      const result = validator(
        {
          password,
        },
        {
          password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          password,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter', () => {
      const result = validator(
        {
          password: 123 as unknown as string,
        },
        {
          password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"password" precisa ser uma string.',
          fields: ['password'],
        },
      });
    });

    test('Providing a "password" with less than 6 characters to optional parameter', () => {
      const result = validator(
        {
          password: 'pass',
        },
        {
          password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"password" precisa ter no mínimo 6 caracteres.',
          fields: ['password'],
        },
      });
    });

    test('Providing valid value to optional parameter', () => {
      const password = 'password';

      const result = validator(
        {
          password,
        },
        {
          password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          password,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter', () => {
      const result = validator(
        {
          password: 123 as unknown as string,
        },
        {
          password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"password" precisa ser uma string.',
          fields: ['password'],
        },
      });
    });

    test('Providing a "password" with less than 6 characters to optional parameter', () => {
      const result = validator(
        {
          password: 'pass',
        },
        {
          password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"password" precisa ter no mínimo 6 caracteres.',
          fields: ['password'],
        },
      });
    });
  });

  describe('Testing "confirm_password"', () => {
    test('Providing valid value to optional parameter', () => {
      const confirm_password = 'confirm_password';

      const result = validator(
        {
          confirm_password,
        },
        {
          confirm_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          confirm_password,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter', () => {
      const result = validator(
        {
          confirm_password: 123 as unknown as string,
        },
        {
          confirm_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_password" precisa ser uma string.',
          fields: ['confirm_password'],
        },
      });
    });

    test('Providing a "confirm_password" with less than 6 characters to optional parameter', () => {
      const result = validator(
        {
          confirm_password: 'pass',
        },
        {
          confirm_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_password" precisa ter no mínimo 6 caracteres.',
          fields: ['confirm_password'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const confirm_password = 'confirm_password';

      const result = validator(
        {
          confirm_password,
        },
        {
          confirm_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          confirm_password,
        },
        error: null,
      });
    });

    test('Providing a invalid type to required parameter', () => {
      const result = validator(
        {
          confirm_password: 123 as unknown as string,
        },
        {
          confirm_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_password" precisa ser uma string.',
          fields: ['confirm_password'],
        },
      });
    });

    test('Providing a "confirm_password" with less than 6 characters to required parameter', () => {
      const result = validator(
        {
          confirm_password: 'pass',
        },
        {
          confirm_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_password" precisa ter no mínimo 6 caracteres.',
          fields: ['confirm_password'],
        },
      });
    });
  });

  describe('Testing "reset_password_token_id"', () => {
    test('Providing valid value to optional parameter', () => {
      const reset_password_token_id = '00000000-0000-0000-0000-000000000000';

      const result = validator(
        {
          reset_password_token_id,
        },
        {
          reset_password_token_id: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          reset_password_token_id,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter (number)', () => {
      const result = validator(
        {
          reset_password_token_id: 123 as unknown as string,
        },
        {
          reset_password_token_id: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"reset_password_token_id" precisa ser uma string.',
          fields: ['reset_password_token_id'],
        },
      });
    });

    test('Providing a invalid type to optional parameter (not UUID)', () => {
      const result = validator(
        {
          reset_password_token_id: '123' as unknown as string,
        },
        {
          reset_password_token_id: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"reset_password_token_id" precisa ser um UUID válido.',
          fields: ['reset_password_token_id'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const reset_password_token_id = '00000000-0000-0000-0000-000000000000';

      const result = validator(
        {
          reset_password_token_id,
        },
        {
          reset_password_token_id: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          reset_password_token_id,
        },
        error: null,
      });
    });

    test('Providing a invalid type to required parameter (number)', () => {
      const result = validator(
        {
          reset_password_token_id: 123 as unknown as string,
        },
        {
          reset_password_token_id: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"reset_password_token_id" precisa ser uma string.',
          fields: ['reset_password_token_id'],
        },
      });
    });

    test('Providing a invalid type to required parameter (not UUID)', () => {
      const result = validator(
        {
          reset_password_token_id: '123' as unknown as string,
        },
        {
          reset_password_token_id: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"reset_password_token_id" precisa ser um UUID válido.',
          fields: ['reset_password_token_id'],
        },
      });
    });
  });

  describe('Testing "user_id"', () => {
    test('Providing valid value to optional parameter', () => {
      const user_id = '00000000-0000-0000-0000-000000000000';

      const result = validator(
        {
          user_id,
        },
        {
          user_id: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          user_id,
        },
        error: null,
      });
    });

    test('Providing invalid type (number) to optional parameter', () => {
      const result = validator(
        {
          user_id: 123 as unknown as string,
        },
        {
          user_id: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_id" precisa ser uma string.',
          fields: ['user_id'],
        },
      });
    });

    test('Providing invalid type (not UUID) to optional parameter', () => {
      const result = validator(
        {
          user_id: '123' as unknown as string,
        },
        {
          user_id: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_id" precisa ser um UUID válido.',
          fields: ['user_id'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const user_id = '00000000-0000-0000-0000-000000000000';

      const result = validator(
        {
          user_id,
        },
        {
          user_id: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          user_id,
        },
        error: null,
      });
    });

    test('Providing invalid type (number) to required parameter', () => {
      const result = validator(
        {
          user_id: 123 as unknown as string,
        },
        {
          user_id: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_id" precisa ser uma string.',
          fields: ['user_id'],
        },
      });
    });

    test('Providing invalid type (not UUID) to required parameter', () => {
      const result = validator(
        {
          user_id: '123' as unknown as string,
        },
        {
          user_id: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"user_id" precisa ser um UUID válido.',
          fields: ['user_id'],
        },
      });
    });
  });

  describe('Testing "current_password"', () => {
    test('Providing valid value to optional parameter', () => {
      const current_password = 'password';

      const result = validator(
        {
          current_password,
        },
        {
          current_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          current_password,
        },
        error: null,
      });
    });

    test('Providing invalid type (number) to optional parameter', () => {
      const result = validator(
        {
          current_password: 123 as unknown as string,
        },
        {
          current_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"current_password" precisa ser uma string.',
          fields: ['current_password'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const current_password = 'password';

      const result = validator(
        {
          current_password,
        },
        {
          current_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          current_password,
        },
        error: null,
      });
    });

    test('Providing invalid type (number) to required parameter', () => {
      const result = validator(
        {
          current_password: 123 as unknown as string,
        },
        {
          current_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"current_password" precisa ser uma string.',
          fields: ['current_password'],
        },
      });
    });
  });

  describe('Testing "new_password"', () => {
    test('Providing valid value to optional parameter', () => {
      const new_password = 'new_password';

      const result = validator(
        {
          new_password,
        },
        {
          new_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          new_password,
        },
        error: null,
      });
    });

    test('Providing invalid type (number) to optional parameter', () => {
      const result = validator(
        {
          new_password: 123 as unknown as string,
        },
        {
          new_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"new_password" precisa ser uma string.',
          fields: ['new_password'],
        },
      });
    });

    test('Providing a "new_password" with less than 6 characters to optional parameter', () => {
      const result = validator(
        {
          new_password: 'pass',
        },
        {
          new_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"new_password" precisa ter no mínimo 6 caracteres.',
          fields: ['new_password'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const new_password = 'new_password';

      const result = validator(
        {
          new_password,
        },
        {
          new_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          new_password,
        },
        error: null,
      });
    });

    test('Providing invalid type (number) to required parameter', () => {
      const result = validator(
        {
          new_password: 123 as unknown as string,
        },
        {
          new_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"new_password" precisa ser uma string.',
          fields: ['new_password'],
        },
      });
    });

    test('Providing a "new_password" with less than 6 characters to required parameter', () => {
      const result = validator(
        {
          new_password: 'pass',
        },
        {
          new_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"new_password" precisa ter no mínimo 6 caracteres.',
          fields: ['new_password'],
        },
      });
    });
  });

  describe('Testing "confirm_new_password"', () => {
    test('Providing valid value to optional parameter', () => {
      const confirm_new_password = 'new_password';

      const result = validator(
        {
          confirm_new_password,
        },
        {
          confirm_new_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          confirm_new_password,
        },
        error: null,
      });
    });

    test('Providing invalid type (number) to optional parameter', () => {
      const result = validator(
        {
          confirm_new_password: 123 as unknown as string,
        },
        {
          confirm_new_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_new_password" precisa ser uma string.',
          fields: ['confirm_new_password'],
        },
      });
    });

    test('Providing a "confirm_new_password" with less than 6 characters to optional parameter', () => {
      const result = validator(
        {
          confirm_new_password: 'pass',
        },
        {
          confirm_new_password: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_new_password" precisa ter no mínimo 6 caracteres.',
          fields: ['confirm_new_password'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const confirm_new_password = 'new_password';

      const result = validator(
        {
          confirm_new_password,
        },
        {
          confirm_new_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          confirm_new_password,
        },
        error: null,
      });
    });

    test('Providing invalid type (number) to required parameter', () => {
      const result = validator(
        {
          confirm_new_password: 123 as unknown as string,
        },
        {
          confirm_new_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_new_password" precisa ser uma string.',
          fields: ['confirm_new_password'],
        },
      });
    });

    test('Providing a "confirm_new_password" with less than 6 characters to required parameter', () => {
      const result = validator(
        {
          confirm_new_password: 'pass',
        },
        {
          confirm_new_password: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirm_new_password" precisa ter no mínimo 6 caracteres.',
          fields: ['confirm_new_password'],
        },
      });
    });
  });

  describe('Testing "select_user_fields"', () => {
    test('Providing valid value to optional parameter', () => {
      const result = validator(
        {
          select_user_fields: ['name', 'email', 'user_name'],
        },
        {
          select_user_fields: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          select_user_fields: ['name', 'email', 'user_name'],
        },
        error: null,
      });
    });

    test('Providing undefined to optional parameter', () => {
      const result = validator(
        {
          select_user_fields: undefined,
        },
        {
          select_user_fields: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });
    });

    test('Providing a invalid property to optional parameter', () => {
      const result = validator(
        {
          select_user_fields: ['name', 'email', 'user_name', 'invalid'],
        },
        {
          select_user_fields: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message:
            '"select_user_fields" precisa conter apenas propriedades válidas.',
          fields: ['select_user_fields'],
        },
      });
    });

    test('Providing invalid type value to optional parameter', () => {
      const result = validator(
        {
          select_user_fields: 123 as unknown as string[],
        },
        {
          select_user_fields: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"select_user_fields" precisa ser um array de strings.',
          fields: ['select_user_fields'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const result = validator(
        {
          select_user_fields: ['name', 'email', 'user_name'],
        },
        {
          select_user_fields: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          select_user_fields: ['name', 'email', 'user_name'],
        },
        error: null,
      });
    });

    test('Providing undefined to required parameter', () => {
      const result = validator(
        {
          select_user_fields: undefined,
        },
        {
          select_user_fields: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"select_user_fields" é obrigatório.',
          fields: ['select_user_fields'],
        },
      });
    });

    test('Providing a invalid property to required parameter', () => {
      const result = validator(
        {
          select_user_fields: ['name', 'email', 'user_name', 'invalid'],
        },
        {
          select_user_fields: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message:
            '"select_user_fields" precisa conter apenas propriedades válidas.',
          fields: ['select_user_fields'],
        },
      });
    });

    test('Providing invalid type value to required parameter', () => {
      const result = validator(
        {
          select_user_fields: 123 as unknown as string[],
        },
        {
          select_user_fields: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"select_user_fields" precisa ser um array de strings.',
          fields: ['select_user_fields'],
        },
      });
    });
  });

  describe('Testing "stateId"', () => {
    test('Providing valid value to optional parameter', () => {
      const result = validator(
        {
          stateId: 32,
        },
        {
          stateId: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          stateId: 32,
        },
        error: null,
      });
    });

    test('Providing undefined to optional parameter', () => {
      const result = validator(
        {
          stateId: undefined,
        },
        {
          stateId: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });
    });

    test('Providing invalid type to optional parameter', () => {
      const result = validator(
        {
          stateId: '32' as unknown as number,
        },
        {
          stateId: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"stateId" precisa ser um número.',
          fields: ['stateId'],
        },
      });
    });

    test('Providing a "stateId" less than 1 to optional parameter', () => {
      const result = validator(
        {
          stateId: 0,
        },
        {
          stateId: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"stateId" precisa ser um número maior que 0.',
          fields: ['stateId'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const result = validator(
        {
          stateId: 32,
        },
        {
          stateId: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          stateId: 32,
        },
        error: null,
      });
    });

    test('Providing undefined to required parameter', () => {
      const result = validator(
        {
          stateId: undefined,
        },
        {
          stateId: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"stateId" é obrigatório.',
          fields: ['stateId'],
        },
      });
    });

    test('Providing invalid type to required parameter', () => {
      const result = validator(
        {
          stateId: '32' as unknown as number,
        },
        {
          stateId: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"stateId" precisa ser um número.',
          fields: ['stateId'],
        },
      });
    });

    test('Providing a "stateId" less than 1 to required parameter', () => {
      const result = validator(
        {
          stateId: 0,
        },
        {
          stateId: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"stateId" precisa ser um número maior que 0.',
          fields: ['stateId'],
        },
      });
    });
  });

  describe('Testing "page"', () => {
    test('Providing valid value to optional parameter', () => {
      const result = validator(
        {
          page: 1,
        },
        {
          page: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          page: 1,
        },
        error: null,
      });
    });

    test('Providing undefined to optional parameter', () => {
      const result = validator(
        {
          page: undefined,
        },
        {
          page: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });
    });

    test('Providing invalid type to optional parameter', () => {
      const result = validator(
        {
          page: '1' as unknown as number,
        },
        {
          page: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" precisa ser um número.',
          fields: ['page'],
        },
      });
    });

    test('Providing negative value to optional parameter', () => {
      const result = validator(
        {
          page: -1,
        },
        {
          page: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" precisa ser um número maior que 0.',
          fields: ['page'],
        },
      });
    });

    test('Providing float value to optional parameter', () => {
      const result = validator(
        {
          page: 1.5,
        },
        {
          page: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" precisa ser um número inteiro.',
          fields: ['page'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const result = validator(
        {
          page: 1,
        },
        {
          page: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          page: 1,
        },
        error: null,
      });
    });

    test('Providing undefined to required parameter', () => {
      const result = validator(
        {
          page: undefined,
        },
        {
          page: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" é obrigatório.',
          fields: ['page'],
        },
      });
    });

    test('Providing invalid type to required parameter', () => {
      const result = validator(
        {
          page: '1' as unknown as number,
        },
        {
          page: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" precisa ser um número.',
          fields: ['page'],
        },
      });
    });

    test('Providing negative value to required parameter', () => {
      const result = validator(
        {
          page: -1,
        },
        {
          page: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" precisa ser um número maior que 0.',
          fields: ['page'],
        },
      });
    });

    test('Providing float value to required parameter', () => {
      const result = validator(
        {
          page: 1.5,
        },
        {
          page: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" precisa ser um número inteiro.',
          fields: ['page'],
        },
      });
    });
  });

  describe('Testing "limit"', () => {
    test('Providing valid value to optional parameter', () => {
      const result = validator(
        {
          limit: 1,
        },
        {
          limit: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          limit: 1,
        },
        error: null,
      });
    });

    test('Providing undefined to optional parameter', () => {
      const result = validator(
        {
          limit: undefined,
        },
        {
          limit: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });
    });

    test('Providing invalid type to optional parameter', () => {
      const result = validator(
        {
          limit: '1' as unknown as number,
        },
        {
          limit: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número.',
          fields: ['limit'],
        },
      });
    });

    test('Providing negative value to optional parameter', () => {
      const result = validator(
        {
          limit: -1,
        },
        {
          limit: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número maior que 0.',
          fields: ['limit'],
        },
      });
    });

    test('Providing float value to optional parameter', () => {
      const result = validator(
        {
          limit: 1.5,
        },
        {
          limit: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número inteiro.',
          fields: ['limit'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const result = validator(
        {
          limit: 1,
        },
        {
          limit: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          limit: 1,
        },
        error: null,
      });
    });

    test('Providing undefined to required parameter', () => {
      const result = validator(
        {
          limit: undefined,
        },
        {
          limit: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" é obrigatório.',
          fields: ['limit'],
        },
      });
    });

    test('Providing invalid type to required parameter', () => {
      const result = validator(
        {
          limit: '1' as unknown as number,
        },
        {
          limit: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número.',
          fields: ['limit'],
        },
      });
    });

    test('Providing negative value to required parameter', () => {
      const result = validator(
        {
          limit: -1,
        },
        {
          limit: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número maior que 0.',
          fields: ['limit'],
        },
      });
    });

    test('Providing float value to required parameter', () => {
      const result = validator(
        {
          limit: 1.5,
        },
        {
          limit: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número inteiro.',
          fields: ['limit'],
        },
      });
    });
  });

  describe('Testing "country"', () => {
    test('Providing country with less than 3 characters to optional parameter', () => {
      const result = validator(
        {
          country: 'BR',
        },
        {
          country: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"country" precisa ter no mínimo 3 caracteres.',
          fields: ['country'],
        },
      });
    });

    test('Providing country with less than 3 characters to optional parameter', () => {
      const result = validator(
        {
          country: 'BR',
        },
        {
          country: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"country" precisa ter no mínimo 3 caracteres.',
          fields: ['country'],
        },
      });
    });
  });

  describe('Testing "city"', () => {
    test('Providing city with less than 2 characters to optional parameter', () => {
      const result = validator(
        {
          city: 'S',
        },
        {
          city: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"city" precisa ter no mínimo 2 caracteres.',
          fields: ['city'],
        },
      });
    });

    test('Providing city with less than 2 characters to required parameter', () => {
      const result = validator(
        {
          city: 'S',
        },
        {
          city: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"city" precisa ter no mínimo 2 caracteres.',
          fields: ['city'],
        },
      });
    });
  });

  describe('Testing "street"', () => {
    test('Providing street with less than 2 characters to optional parameter', () => {
      const result = validator(
        {
          street: 'S',
        },
        {
          street: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"street" precisa ter no mínimo 2 caracteres.',
          fields: ['street'],
        },
      });
    });

    test('Providing street with less than 2 characters to required parameter', () => {
      const result = validator(
        {
          street: 'S',
        },
        {
          street: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"street" precisa ter no mínimo 2 caracteres.',
          fields: ['street'],
        },
      });
    });
  });

  describe('Testing "num_place"', () => {
    test('Providing num_place with less than 1 to optional parameter', () => {
      const result = validator(
        {
          num_place: 0,
        },
        {
          num_place: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"num_place" precisa ser um número maior que 0.',
          fields: ['num_place'],
        },
      });
    });

    test('Providing num_place with less than 1 to required parameter', () => {
      const result = validator(
        {
          num_place: 0,
        },
        {
          num_place: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"num_place" precisa ser um número maior que 0.',
          fields: ['num_place'],
        },
      });
    });
  });

  describe('Testing "complement" and "description"', () => {
    test('Providing complement with less than 2 characters', () => {
      const result = validator(
        {
          complement: 'S',
        },
        {
          complement: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"complement" precisa ter no mínimo 2 caracteres.',
          fields: ['complement'],
        },
      });
    });

    test('Providing description with less than 2 characters', () => {
      const result = validator(
        {
          description: 'S',
        },
        {
          description: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"description" precisa ter no mínimo 2 caracteres.',
          fields: ['description'],
        },
      });
    });
  });

  describe('Testing "category_id" and "created_by"', () => {
    const uuid = crypto.randomUUID();

    test('Providing valid uuid to category_id', () => {
      const result = validator(
        {
          category_id: uuid,
        },
        {
          category_id: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          category_id: uuid,
        },
        error: null,
      });
    });

    test('Providing invalid uuid to category_id', () => {
      const result = validator(
        {
          category_id: 'invalid',
        },
        {
          category_id: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"category_id" precisa ser um UUID válido.',
          fields: ['category_id'],
        },
      });
    });

    test('Providing valid uuid to created_by', () => {
      const result = validator(
        {
          created_by: uuid,
        },
        {
          created_by: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          created_by: uuid,
        },
        error: null,
      });
    });

    test('Providing invalid uuid to created_by', () => {
      const result = validator(
        {
          created_by: 'invalid',
        },
        {
          created_by: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"created_by" precisa ser um UUID válido.',
          fields: ['created_by'],
        },
      });
    });
  });

  describe('Testing "latitude" and "longitude"', () => {
    test('Providing valid value to latitude ', () => {
      const result = validator(
        {
          latitude: -23.55052,
        },
        {
          latitude: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          latitude: -23.55052,
        },
        error: null,
      });
    });

    test('Providing value greater than 90 to latitude ', () => {
      const result = validator(
        {
          latitude: 91,
        },
        {
          latitude: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"latitude" precisa ser um número menor ou igual a 90.',
          fields: ['latitude'],
        },
      });
    });

    test('Providing value less than -90 to latitude ', () => {
      const result = validator(
        {
          latitude: -91,
        },
        {
          latitude: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"latitude" precisa ser um número maior ou igual a -90.',
          fields: ['latitude'],
        },
      });
    });

    test('Providing valid value to longitude ', () => {
      const result = validator(
        {
          longitude: -23.55052,
        },
        {
          longitude: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          longitude: -23.55052,
        },
        error: null,
      });
    });

    test('Providing value greater than 180 to longitude ', () => {
      const result = validator(
        {
          longitude: 181,
        },
        {
          longitude: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"longitude" precisa ser um número menor ou igual a 180.',
          fields: ['longitude'],
        },
      });
    });

    test('Providing value less than -180 to longitude ', () => {
      const result = validator(
        {
          longitude: -181,
        },
        {
          longitude: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"longitude" precisa ser um número maior ou igual a -180.',
          fields: ['longitude'],
        },
      });
    });
  });
});
