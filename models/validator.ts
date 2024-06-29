import { z } from 'zod';

import { operationResult } from '@/src/utils/operationResult';

export function validator<T extends Partial<ValidationSchema>>(
  payload: T,
  keys: Record<keyof T, ValidationKeysOptions>,
) {
  if (Object.keys(payload).length === 0) {
    return operationResult.failure({
      message: 'O input não pode ser vazio.',
      fields: [],
    });
  }

  type ResponseMessage = {
    message: string;
    fields: string[];
  } | null;

  let responseMessage = {} as ResponseMessage;
  let output = {} as T;

  for (const [key, value] of Object.entries(payload)) {
    const validationKey = key as ValidationSchemaKeys;

    const keySchema = schema.pick({ [validationKey]: true as never });

    const validationOption = keys[validationKey];

    if (validationOption === 'optional' && value === undefined) continue;

    if (validationOption === 'optional') {
      keySchema.optional();
    }

    const { success, error, data } = keySchema.safeParse({
      [validationKey]: value,
    });

    if (!success) {
      responseMessage = {
        message: error.errors[0].message,
        fields: [String(error.errors[0].path[0])],
      };
      break;
    }

    output = { ...output, ...data };
  }

  if (responseMessage?.message) {
    return operationResult.failure<ResponseMessage>(responseMessage);
  }

  return operationResult.success(output);
}

export type ValidationSchema = z.infer<typeof schema>;
type ValidationKeysOptions = 'required' | 'optional';
type ValidationSchemaKeys = keyof ValidationSchema;

const schema = z.object({
  name: z
    .string({
      required_error: '"name" é obrigatório.',
      invalid_type_error: '"name" precisa ser uma string.',
    })
    .trim()
    .min(3, {
      message: '"name" precisa ter no mínimo 3 caracteres.',
    }),
  email: z
    .string({
      required_error: '"email" é obrigatório.',
      invalid_type_error: '"email" precisa ser uma string.',
    })
    .email({
      message: '"email" precisa ser um email válido.',
    }),
  userName: z
    .string({
      required_error: '"userName" é obrigatório.',
      invalid_type_error: '"userName" precisa ser uma string.',
    })
    .refine((s) => !s.includes(' '), '"userName" não pode ter espaços.'),
  password: z
    .string({
      required_error: '"password" é obrigatório.',
      invalid_type_error: '"password" precisa ser uma string.',
    })
    .min(6, {
      message: '"password" precisa ter no mínimo 6 caracteres.',
    }),
  confirmPassword: z
    .string({
      required_error: '"confirmPassword" é obrigatório.',
      invalid_type_error: '"confirmPassword" precisa ser uma string.',
    })
    .min(6, {
      message: '"confirmPassword" precisa ter no mínimo 6 caracteres.',
    }),
  resetPasswordTokenId: z
    .string({
      required_error: '"resetPasswordTokenId" é obrigatório.',
      invalid_type_error: '"resetPasswordTokenId" precisa ser uma string.',
    })
    .uuid({
      message: '"resetPasswordTokenId" precisa ser um UUID válido.',
    }),
  userId: z
    .string({
      required_error: '"userId" é obrigatório.',
      invalid_type_error: '"userId" precisa ser uma string.',
    })
    .uuid({
      message: '"userId" precisa ser um UUID válido.',
    }),
  actualPassword: z.string({
    required_error: '"actualPassword" é obrigatório.',
    invalid_type_error: '"actualPassword" precisa ser uma string.',
  }),
  newPassword: z
    .string({
      required_error: '"newPassword" é obrigatório.',
      invalid_type_error: '"newPassword" precisa ser uma string.',
    })
    .min(6, {
      message: '"newPassword" precisa ter no mínimo 6 caracteres.',
    }),
  confirmNewPassword: z
    .string({
      required_error: '"confirmNewPassword" é obrigatório.',
      invalid_type_error: '"confirmNewPassword" precisa ser uma string.',
    })
    .min(6, {
      message: '"confirmNewPassword" precisa ter no mínimo 6 caracteres.',
    }),
  selectUserFields: z.array(
    z
      .string({
        invalid_type_error:
          '"selectUserFields" precisa ser um array de strings.',
        required_error: '"selectUserFields" é obrigatório.',
      })
      .refine(
        (field) =>
          [
            'id',
            'email',
            'name',
            'password',
            'userName',
            'userRole',
            'createdAt',
            'updatedAt',
          ].includes(field),
        '"selectUserFields" precisa conter apenas propriedades válidas.',
      ),
    {
      invalid_type_error: '"selectUserFields" precisa ser um array de strings.',
      required_error: '"selectUserFields" é obrigatório.',
    },
  ),
});
