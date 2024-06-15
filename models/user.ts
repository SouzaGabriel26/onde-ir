import { z } from 'zod';

import { UserDataSource } from '@/data/user';
import { operationResult } from '@/src/utils/operationResult';
import { User } from '@/types';

export const user = Object.freeze({
  findById,
});

type FindByIdInput = {
  id: string;
  select?: Array<keyof User>;
};

const findByIdSchema = z.object({
  id: z
    .string({
      required_error: 'A proprietade "id" é obrigatória',
      invalid_type_error: 'A propriedade "id" deve ser uma string',
    })
    .uuid({
      message: 'A propriedade "id" deve ser um UUID',
    }),
  select: z
    .array(
      z.enum(
        [
          'id',
          'email',
          'name',
          'userName',
          'userRole',
          'createdAt',
          'updatedAt',
        ],
        {
          errorMap: () => {
            return {
              message:
                'A propriedade "select" deve conter apenas propriedades válidas',
            };
          },
        },
      ),
    )
    .optional(),
});

async function findById(userDataSource: UserDataSource, input: FindByIdInput) {
  const validatedInput = findByIdSchema.safeParse(input);

  if (!validatedInput.success) {
    return operationResult.failure({
      message: validatedInput.error?.errors[0].message,
    });
  }

  const foundUser = await userDataSource.findById({
    id: input.id,
    select: input.select ?? [],
  });

  return operationResult.success(foundUser);
}
