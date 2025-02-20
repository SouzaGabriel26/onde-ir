import type { PlaceComment, PlaceDataSource, PlaceStatus } from '@/data/place';
import type { UserDataSource } from '@/data/user';
import { operationResult } from '@/utils/operationResult';

import { type ValidationSchema, validator } from './validator';

export const place = Object.freeze({
  findAll,
  findById,
  create,
  createImages,
  findCategories,
  update,
  findComments,
});

type FindAllInput = {
  page?: ValidationSchema['page'];
  limit?: ValidationSchema['limit'];
  where?: {
    searchTerm?: string;
    status?: PlaceStatus;
    state?: string;
    name?: string;
    categoryName?: string;
    createdBy?: string;
  };
};

export type FormattedComment = PlaceComment & {
  child_comments?: Array<PlaceComment>;
};

async function findAll(
  placeDataSource: PlaceDataSource,
  input: FindAllInput = {},
) {
  input.page = input.page ?? 1;
  input.limit = input.limit ?? 10;

  const { data: secureInput, error } = validator(
    {
      page: input.page,
      limit: input.limit,
      search_term: input.where?.searchTerm,
      state: input.where?.state,
      name: input.where?.name,
      status: input.where?.status,
      category_name: input.where?.categoryName,
      created_by: input.where?.createdBy,
    },
    {
      limit: 'required',
      page: 'required',
      search_term: 'optional',
      state: 'optional',
      name: 'optional',
      status: 'optional',
      category_name: 'optional',
      created_by: 'optional',
    },
  );

  if (error) return operationResult.failure(error);

  const { page, limit } = secureInput;
  const offset = (page - 1) * limit;

  const places = await placeDataSource.findAll({
    offset,
    limit,
    where: input.where,
  });

  return operationResult.success(places);
}

async function findById(placeDataSource: PlaceDataSource, id: string) {
  const validationResult = validator(
    { place_id: id },
    { place_id: 'required' },
  );

  if (validationResult.error) return validationResult;

  const place = await placeDataSource.findById(id);

  if (!place) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  return operationResult.success(place);
}
export type CreatePlaceInput = {
  name: string;
  country: string;
  state: string;
  city: string;
  street: string;
  num_place?: number;
  complement?: string;
  description?: string;
  category_id: string;
  latitude?: number;
  longitude?: number;
  created_by: string;
};

async function create(
  userDataSource: UserDataSource,
  placeDataSource: PlaceDataSource,
  props: CreatePlaceInput,
) {
  const { data: validatedInput, error } = validator(
    { ...props },
    {
      name: 'required',
      country: 'required',
      state: 'required',
      city: 'required',
      street: 'required',
      category_id: 'required',
      created_by: 'required',
      num_place: 'optional',
      complement: 'optional',
      description: 'optional',
      latitude: 'optional',
      longitude: 'optional',
    },
  );

  if (error) return operationResult.failure(error);

  const categories = await placeDataSource.findCategories();
  const categoryExists = categories.some(
    (c) => c.id === validatedInput.category_id,
  );

  if (!categoryExists) {
    return operationResult.failure({
      message: 'ID da categoria não encontrada.',
      fields: ['category_id'],
    });
  }

  const userExists = await userDataSource.checkById({
    id: validatedInput.created_by,
  });

  if (!userExists) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
      fields: ['created_by'],
    });
  }

  const { data: places } = await findAll(placeDataSource, {
    limit: 1,
    where: {
      name: validatedInput.name,
    },
  });

  if (places && places.length > 0) {
    return operationResult.failure({
      message: `Já existe um local registrado com o nome ${validatedInput.name}.`,
      fields: ['name'],
    });
  }

  const createdPlace = await placeDataSource.create(validatedInput);

  return operationResult.success(createdPlace);
}

export type CreatePlaceImagesInput = {
  place_id: string;
  urls: Array<string>;
  description: string;
};

async function createImages(
  placeDataSource: PlaceDataSource,
  input: CreatePlaceImagesInput,
) {
  const { data: validatedInput, error } = validator(
    { ...input },
    {
      place_id: 'required',
      urls: 'required',
      description: 'required',
    },
  );

  if (error) return operationResult.failure(error);

  const placeExists = await placeDataSource.findById(input.place_id);
  if (!placeExists) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  await placeDataSource.createImages(validatedInput);

  return operationResult.success({});
}

export type FindCategoriesInput = {
  where?: {
    is_active?: boolean;
  };
};

async function findCategories(
  placeDataSource: PlaceDataSource,
  input?: FindCategoriesInput,
) {
  const categories = await placeDataSource.findCategories(input);

  return operationResult.success(categories);
}

export type UpdateInput = {
  placeId: ValidationSchema['place_id'];
  reviewedBy: ValidationSchema['user_id'];
  status: ValidationSchema['status'];
};

async function update(
  userDataSource: UserDataSource,
  placeDataSource: PlaceDataSource,
  input: UpdateInput,
) {
  const validationResult = validator(
    {
      place_id: input.placeId,
      user_id: input.reviewedBy,
      status: input.status,
    },
    {
      place_id: 'required',
      user_id: 'required',
      status: 'required',
    },
  );

  if (validationResult.error) return validationResult;

  const { place_id, status, user_id: reviewedBy } = validationResult.data;

  const place = await placeDataSource.findById(place_id);

  if (!place) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  const adminUserExists = await userDataSource.findById({
    id: reviewedBy,
    select: ['userRole'],
  });

  if (!adminUserExists) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
      fields: ['user_id'],
    });
  }

  if (adminUserExists.userRole !== 'ADMIN') {
    return operationResult.failure({
      message: 'Você não tem permissão para alterar o status do local.',
      fields: ['user_id'],
    });
  }

  if (place.created_by === reviewedBy) {
    return operationResult.failure({
      message: 'Você não pode alterar o status do seu próprio local.',
      fields: ['user_id'],
    });
  }

  await placeDataSource.update({
    placeId: place_id,
    status,
    reviewedBy,
  });

  return operationResult.success({});
}

async function findComments(placeDataSource: PlaceDataSource, placeId: string) {
  const validationResult = validator(
    { place_id: placeId },
    { place_id: 'required' },
  );

  if (validationResult.error) return validationResult;

  const comments = await placeDataSource.findComments(placeId);

  const commentsWithoutParent = comments.filter(
    (comment) => !comment.parent_comment_id,
  );
  const commentsWithParent = comments.filter(
    (comment) => comment.parent_comment_id,
  );

  const formattedComments: FormattedComment[] = commentsWithoutParent;

  for (const comment of commentsWithParent) {
    const parentComment = formattedComments.find(
      (c) => c.id === comment.parent_comment_id,
    );

    if (parentComment) {
      if (!parentComment.child_comments) {
        parentComment.child_comments = [];
      }

      parentComment.child_comments.push(comment);
    }
  }

  return operationResult.success(formattedComments);
}
