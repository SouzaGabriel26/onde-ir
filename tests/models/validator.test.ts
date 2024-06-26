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
        name: null as any,
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
        name: null as any,
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
          name: 123 as any,
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
          name: 123 as any,
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
          email: 123 as any,
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
          email: 123 as any,
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

  describe('Testing "userName"', () => {
    test('Providing valid value to optional parameter', () => {
      const userName = 'testeusername';

      const result = validator(
        {
          userName,
        },
        {
          userName: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          userName,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter', () => {
      const result = validator(
        {
          userName: 123 as any,
        },
        {
          userName: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userName" precisa ser uma string.',
          fields: ['userName'],
        },
      });
    });

    test('Providing a invalid userName (with spaces) to optional parameter', () => {
      const result = validator(
        {
          userName: 'user name',
        },
        {
          userName: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userName" não pode ter espaços.',
          fields: ['userName'],
        },
      });
    });

    test('Providing a invalid type to required parameter', () => {
      const result = validator(
        {
          userName: 123 as any,
        },
        {
          userName: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userName" precisa ser uma string.',
          fields: ['userName'],
        },
      });
    });

    test('Providing a invalid userName (with spaces) to required parameter', () => {
      const result = validator(
        {
          userName: 'user name',
        },
        {
          userName: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userName" não pode ter espaços.',
          fields: ['userName'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const userName = 'testeusername';

      const result = validator(
        {
          userName,
        },
        {
          userName: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          userName,
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
          password: 123 as any,
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
          password: 123 as any,
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

  describe('Testing "confirmPassword"', () => {
    test('Providing valid value to optional parameter', () => {
      const confirmPassword = 'confirmPassword';

      const result = validator(
        {
          confirmPassword,
        },
        {
          confirmPassword: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          confirmPassword,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter', () => {
      const result = validator(
        {
          confirmPassword: 123 as any,
        },
        {
          confirmPassword: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirmPassword" precisa ser uma string.',
          fields: ['confirmPassword'],
        },
      });
    });

    test('Providing a "confirmPassword" with less than 6 characters to optional parameter', () => {
      const result = validator(
        {
          confirmPassword: 'pass',
        },
        {
          confirmPassword: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirmPassword" precisa ter no mínimo 6 caracteres.',
          fields: ['confirmPassword'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const confirmPassword = 'confirmPassword';

      const result = validator(
        {
          confirmPassword,
        },
        {
          confirmPassword: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          confirmPassword,
        },
        error: null,
      });
    });

    test('Providing a invalid type to required parameter', () => {
      const result = validator(
        {
          confirmPassword: 123 as any,
        },
        {
          confirmPassword: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirmPassword" precisa ser uma string.',
          fields: ['confirmPassword'],
        },
      });
    });

    test('Providing a "confirmPassword" with less than 6 characters to required parameter', () => {
      const result = validator(
        {
          confirmPassword: 'pass',
        },
        {
          confirmPassword: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"confirmPassword" precisa ter no mínimo 6 caracteres.',
          fields: ['confirmPassword'],
        },
      });
    });
  });

  describe('Testing "resetPasswordTokenId"', () => {
    test('Providing valid value to optional parameter', () => {
      const resetPasswordTokenId = '00000000-0000-0000-0000-000000000000';

      const result = validator(
        {
          resetPasswordTokenId,
        },
        {
          resetPasswordTokenId: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: {
          resetPasswordTokenId,
        },
        error: null,
      });
    });

    test('Providing a invalid type to optional parameter (number)', () => {
      const result = validator(
        {
          resetPasswordTokenId: 123 as any,
        },
        {
          resetPasswordTokenId: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"resetPasswordTokenId" precisa ser uma string.',
          fields: ['resetPasswordTokenId'],
        },
      });
    });

    test('Providing a invalid type to optional parameter (not UUID)', () => {
      const result = validator(
        {
          resetPasswordTokenId: '123' as any,
        },
        {
          resetPasswordTokenId: 'optional',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"resetPasswordTokenId" precisa ser um UUID válido.',
          fields: ['resetPasswordTokenId'],
        },
      });
    });

    test('Providing valid value to required parameter', () => {
      const resetPasswordTokenId = '00000000-0000-0000-0000-000000000000';

      const result = validator(
        {
          resetPasswordTokenId,
        },
        {
          resetPasswordTokenId: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: {
          resetPasswordTokenId,
        },
        error: null,
      });
    });

    test('Providing a invalid type to required parameter (number)', () => {
      const result = validator(
        {
          resetPasswordTokenId: 123 as any,
        },
        {
          resetPasswordTokenId: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"resetPasswordTokenId" precisa ser uma string.',
          fields: ['resetPasswordTokenId'],
        },
      });
    });

    test('Providing a invalid type to required parameter (not UUID)', () => {
      const result = validator(
        {
          resetPasswordTokenId: '123' as any,
        },
        {
          resetPasswordTokenId: 'required',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"resetPasswordTokenId" precisa ser um UUID válido.',
          fields: ['resetPasswordTokenId'],
        },
      });
    });
  });
});
