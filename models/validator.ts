import { z } from 'zod';

import { operationResult } from '@/utils/operationResult';

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
export type ValidationSchemaKeys = keyof ValidationSchema;

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
  user_name: z
    .string({
      required_error: '"user_name" é obrigatório.',
      invalid_type_error: '"user_name" precisa ser uma string.',
    })
    .refine((s) => !s.includes(' '), '"user_name" não pode ter espaços.'),
  password: z
    .string({
      required_error: '"password" é obrigatório.',
      invalid_type_error: '"password" precisa ser uma string.',
    })
    .min(6, {
      message: '"password" precisa ter no mínimo 6 caracteres.',
    }),
  confirm_password: z
    .string({
      required_error: '"confirm_password" é obrigatório.',
      invalid_type_error: '"confirm_password" precisa ser uma string.',
    })
    .min(6, {
      message: '"confirm_password" precisa ter no mínimo 6 caracteres.',
    }),
  avatar_url: z
    .string({
      required_error: '"avatar_url" é obrigatório.',
      invalid_type_error: '"avatar_url" precisa ser uma string.',
    })
    .url({
      message: '"avatar_url" precisa ser uma URL válida.',
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
  currentPassword: z.string({
    required_error: '"currentPassword" é obrigatório.',
    invalid_type_error: '"currentPassword" precisa ser uma string.',
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
            'user_name',
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
  stateId: z
    .number({
      required_error: '"stateId" é obrigatório.',
      invalid_type_error: '"stateId" precisa ser um número.',
    })
    .min(1, {
      message: '"stateId" precisa ser um número maior que 0.',
    }),
  page: z
    .number({
      invalid_type_error: '"page" precisa ser um número.',
      required_error: '"page" é obrigatório.',
    })
    .min(1, {
      message: '"page" precisa ser um número maior que 0.',
    })
    .int({
      message: '"page" precisa ser um número inteiro.',
    }),
  limit: z
    .number({
      invalid_type_error: '"limit" precisa ser um número.',
      required_error: '"limit" é obrigatório.',
    })
    .min(1, {
      message: '"limit" precisa ser um número maior que 0.',
    })
    .int({
      message: '"limit" precisa ser um número inteiro.',
    }),
  state: z
    .string({
      invalid_type_error: '"state" precisa ser uma string.',
      required_error: '"state" é obrigatório.',
    })
    .trim()
    .min(2, {
      message: '"state" precisa ter no mínimo 2 caracteres.',
    }),
  country: z
    .string({
      invalid_type_error: '"country" precisa ser uma string.',
      required_error: '"country" é obrigatório.',
    })
    .trim()
    .min(3, {
      message: '"country" precisa ter no mínimo 3 caracteres.',
    }),
  city: z
    .string({
      invalid_type_error: '"city" precisa ser uma string.',
      required_error: '"city" é obrigatório.',
    })
    .trim()
    .min(2, {
      message: '"city" precisa ter no mínimo 2 caracteres.',
    }),
  street: z
    .string({
      invalid_type_error: '"street" precisa ser uma string.',
      required_error: '"street" é obrigatório.',
    })
    .trim()
    .min(2, {
      message: '"street" precisa ter no mínimo 2 caracteres.',
    }),
  num_place: z
    .number({
      invalid_type_error: '"num_place" precisa ser um número.',
      required_error: '"num_place" é obrigatório.',
    })
    .min(1, {
      message: '"num_place" precisa ser um número maior que 0.',
    }),
  place_id: z
    .string({
      required_error: '"place_id" é obrigatório.',
      invalid_type_error: '"place_id" precisa ser uma string.',
    })
    .uuid({
      message: '"place_id" precisa ser um UUID válido.',
    }),
  urls: z
    .array(
      z.string({
        message: '"urls" precisa ser um array de strings.',
      }),
      {
        invalid_type_error: '"urls" precisa ser um array de strings.',
        required_error: '"urls" é obrigatório.',
      },
    )
    .min(1, {
      message: '"urls" precisa ter no mínimo 1 item.',
    }),
  complement: z
    .string({
      invalid_type_error: '"complement" precisa ser uma string.',
      required_error: '"complement" é obrigatório.',
    })
    .trim()
    .min(2, {
      message: '"complement" precisa ter no mínimo 2 caracteres.',
    }),
  description: z
    .string({
      invalid_type_error: '"description" precisa ser uma string.',
      required_error: '"description" é obrigatório.',
    })
    .trim()
    .min(2, {
      message: '"description" precisa ter no mínimo 2 caracteres.',
    }),
  category_id: z
    .string({
      invalid_type_error: '"category_id" precisa ser uma string.',
      required_error: '"category_id" é obrigatório.',
    })
    .trim()
    .uuid({
      message: '"category_id" precisa ser um UUID válido.',
    }),
  latitude: z
    .number({
      invalid_type_error: '"latitude" precisa ser um número.',
      required_error: '"latitude" é obrigatório.',
    })
    .min(-90, {
      message: '"latitude" precisa ser um número maior ou igual a -90.',
    })
    .max(90, {
      message: '"latitude" precisa ser um número menor ou igual a 90.',
    }),
  longitude: z
    .number({
      invalid_type_error: '"longitude" precisa ser um número.',
      required_error: '"longitude" é obrigatório.',
    })
    .min(-180, {
      message: '"longitude" precisa ser um número maior ou igual a -180.',
    })
    .max(180, {
      message: '"longitude" precisa ser um número menor ou igual a 180.',
    }),
  created_by: z
    .string({
      invalid_type_error: '"created_by" precisa ser uma string.',
      required_error: '"created_by" é obrigatório.',
    })
    .trim()
    .uuid({
      message: '"created_by" precisa ser um UUID válido.',
    }),
  status: z.enum(['APPROVED', 'PENDING', 'REJECTED'], {
    errorMap: (issue) => {
      const error = {
        message: '"status" é obrigatório.',
      };
      if (issue.code === 'invalid_enum_value') {
        error.message = '"status" deve ser APPROVED, PENDING ou REJECTED.';
      }
      return error;
    },
  }),
  searchTerm: z
    .string({
      invalid_type_error: '"searchTerm" precisa ser uma string.',
      required_error: '"searchTerm" é obrigatório.',
    })
    .trim()
    .min(1, {
      message: '"searchTerm" precisa ter no mínimo 1 caractere.',
    }),
  categoryName: z
    .string({
      invalid_type_error: '"categoryName" precisa ser uma string.',
      required_error: '"categoryName" é obrigatório.',
    })
    .trim()
    .min(1, {
      message: '"categoryName" precisa ter no mínimo 1 caractere.',
    }),
});
