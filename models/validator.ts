import { z } from 'zod';

import { operationResult } from '@/src/utils/operationResult';

export function validator<T extends Partial<ValidationSchema>>(
  payload: T,
  keys: Record<keyof T, ValidationKeysOptions>,
) {
  if (Object.keys(payload).length === 0) {
    return operationResult.failure({
      message: 'input must not be empty.',
    });
  }

  let message = '';
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
      message = error.errors[0].message;
      break;
    }

    output[validationKey] = data[validationKey];
  }

  if (message) {
    return operationResult.failure({
      message,
    });
  }

  return operationResult.success(output);
}

type ValidationSchema = z.infer<typeof schema>;
type ValidationKeysOptions = 'required' | 'optional';
type ValidationSchemaKeys = keyof ValidationSchema;

const schema = z.object({
  name: z
    .string({
      required_error: '"name" é obrigatório.',
      invalid_type_error: '"name" precisa ser uma string.',
    })
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
});
