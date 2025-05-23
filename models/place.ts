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
  createComment,
  deleteComment,
  updateComment,
  evaluate,
  findUserRating,
  likeComment,
  unlikeComment,
});

type FindAllInput = {
  page?: ValidationSchema['page'];
  limit?: ValidationSchema['limit'];
  rank_by_rating?: ValidationSchema['rank_by_rating'];
  rank_by_comments?: ValidationSchema['rank_by_comments'];
  where?: {
    search_term?: string;
    status?: PlaceStatus;
    state?: string;
    name?: string;
    category_name?: string;
    created_by?: string;
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
      rank_by_rating: input.rank_by_rating,
      rank_by_comments: input.rank_by_comments,
      search_term: input.where?.search_term,
      state: input.where?.state,
      name: input.where?.name,
      status: input.where?.status,
      category_name: input.where?.category_name,
      created_by: input.where?.created_by,
    },
    {
      limit: 'required',
      page: 'required',
      rank_by_rating: 'optional',
      rank_by_comments: 'optional',
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
    rank_by_rating: secureInput.rank_by_rating,
    rank_by_comments: secureInput.rank_by_comments,
    where: {
      category_name: secureInput.category_name,
      search_term: secureInput.search_term,
      state: secureInput.state,
      name: secureInput.name,
      created_by: secureInput.created_by,
      status: secureInput.status,
    },
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

  const categories = await placeDataSource.findCategories({
    limit: 1,
    where: { id: validatedInput.category_id },
  });
  const categoryExists = categories && categories.length > 0;

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
  limit?: ValidationSchema['limit'];
  where?: {
    is_active?: boolean;
  };
};

async function findCategories(
  placeDataSource: PlaceDataSource,
  input?: FindCategoriesInput,
) {
  const defaultLimit = 15;

  const validationResult = validator(
    {
      limit: input?.limit ?? defaultLimit,
    },
    {
      limit: 'required',
    },
  );

  if (validationResult.error) return validationResult;

  const categories = await placeDataSource.findCategories({
    limit: validationResult.data.limit,
    where: input?.where,
  });

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

export type CreateCommentInput = {
  placeId: ValidationSchema['place_id'];
  userId: ValidationSchema['user_id'];
  description: ValidationSchema['description'];
  parentCommentId?: ValidationSchema['comment_id'];
};

async function createComment(
  userDataSource: UserDataSource,
  placeDataSource: PlaceDataSource,
  input: CreateCommentInput,
) {
  const validationResult = validator(
    {
      place_id: input.placeId,
      user_id: input.userId,
      description: input.description,
      comment_id: input.parentCommentId,
    },
    {
      place_id: 'required',
      user_id: 'required',
      description: 'required',
      comment_id: 'optional',
    },
  );

  if (validationResult.error) return validationResult;

  const {
    place_id,
    user_id,
    description,
    comment_id: parent_comment_id,
  } = validationResult.data;

  const place = await placeDataSource.findById(place_id);
  if (!place) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  if (place.status !== 'APPROVED') {
    return operationResult.failure({
      message: 'Você não pode comentar em um post que não foi aprovado.',
      fields: ['place_id'],
    });
  }

  const userExists = await userDataSource.checkById({ id: user_id });
  if (!userExists) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
      fields: ['user_id'],
    });
  }

  if (parent_comment_id) {
    const parentCommentExists =
      await placeDataSource.checkCommentById(parent_comment_id);

    if (!parentCommentExists) {
      return operationResult.failure({
        message: 'Comentário pai não encontrado.',
        fields: ['parent_comment_id'],
      });
    }
  }

  await placeDataSource.createComment({
    placeId: place_id,
    userId: user_id,
    description: description,
    parentCommentId: parent_comment_id,
  });

  return operationResult.success({});
}

export type DeleteCommentInput = {
  placeId: ValidationSchema['place_id'];
  commentId: ValidationSchema['comment_id'];
  userId: ValidationSchema['user_id'];
};

async function deleteComment(
  userDataSource: UserDataSource,
  placeDataSource: PlaceDataSource,
  input: DeleteCommentInput,
) {
  const validationResult = validator(
    {
      comment_id: input.commentId,
      user_id: input.userId,
      place_id: input.placeId,
    },
    { comment_id: 'required', user_id: 'required', place_id: 'required' },
  );

  if (validationResult.error) return validationResult;

  const { comment_id, user_id, place_id } = validationResult.data;

  const user = await userDataSource.findById({
    id: user_id,
    select: ['userRole', 'id'],
  });

  if (!user) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
      fields: ['user_id'],
    });
  }

  const commentOwnerId = await placeDataSource.getCommentOwner(comment_id);

  const place = await placeDataSource.findById(place_id);
  if (!place) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  const isPostOwner = user.id === place.created_by;
  const isCommentOwner = user.id === commentOwnerId;
  const isAdmin = user.userRole === 'ADMIN';

  const hasPermissionToDelete = isPostOwner || isAdmin || isCommentOwner;

  if (!hasPermissionToDelete) {
    return operationResult.failure({
      message: 'Você não tem permissão para deletar este comentário',
      fields: ['user_id'],
    });
  }

  await placeDataSource.deleteComment({
    commentId: comment_id,
    userId: user_id,
    placeId: place_id,
  });

  return operationResult.success({});
}

export type UpdateCommentInput = {
  commentId: ValidationSchema['comment_id'];
  userId: ValidationSchema['user_id'];
  description: ValidationSchema['description'];
};

async function updateComment(
  userDataSource: UserDataSource,
  placeDataSource: PlaceDataSource,
  input: UpdateCommentInput,
) {
  const validationResult = validator(
    {
      comment_id: input.commentId,
      user_id: input.userId,
      description: input.description,
    },
    { comment_id: 'required', user_id: 'required', description: 'required' },
  );

  if (validationResult.error) return validationResult;

  const { comment_id, description, user_id } = validationResult.data;

  const user = await userDataSource.findById({
    id: user_id,
    select: ['id', 'userRole'],
  });

  if (!user) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
      fields: ['user_id'],
    });
  }

  const commentOwner = await placeDataSource.getCommentOwner(comment_id);

  if (commentOwner !== user.id) {
    return operationResult.failure({
      message: 'Você não tem permissão para editar este comentário.',
    });
  }

  await placeDataSource.updateComment({
    commentId: comment_id,
    description,
  });

  return operationResult.success({});
}

export type EvaluateInput = {
  placeId: ValidationSchema['place_id'];
  userId: ValidationSchema['user_id'];
  evaluation: ValidationSchema['evaluation'];
};

async function evaluate(
  placeDataSource: PlaceDataSource,
  input: EvaluateInput,
) {
  const validationResult = validator(
    {
      place_id: input.placeId,
      user_id: input.userId,
      evaluation: input.evaluation,
    },
    {
      place_id: 'required',
      user_id: 'required',
      evaluation: 'required',
    },
  );

  if (validationResult.error) return validationResult;

  const { place_id, user_id, evaluation } = validationResult.data;

  const place = await placeDataSource.findById(place_id);
  if (!place) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  if (place.status !== 'APPROVED') {
    return operationResult.failure({
      message: 'Você não pode avaliar um local que não foi aprovado.',
      fields: ['place_id'],
    });
  }

  await placeDataSource.evaluate({
    evaluation,
    placeId: place_id,
    userId: user_id,
  });

  return operationResult.success({});
}

export type FindUserRatingInput = {
  placeId: ValidationSchema['place_id'];
  userId: ValidationSchema['user_id'];
};

async function findUserRating(
  placeDataSource: PlaceDataSource,
  input: FindUserRatingInput,
) {
  const validationResult = validator(
    {
      place_id: input.placeId,
      user_id: input.userId,
    },
    {
      place_id: 'required',
      user_id: 'required',
    },
  );

  if (validationResult.error) return validationResult;

  const { place_id, user_id } = validationResult.data;

  const place = await placeDataSource.findById(place_id);
  if (!place) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  const userRating = await placeDataSource.findUserRating({
    placeId: place_id,
    userId: user_id,
  });

  if (!userRating) {
    return operationResult.failure({
      message: 'Avaliação não encontrada.',
    });
  }

  return operationResult.success(userRating);
}

export type LikeCommentInput = {
  commentId: ValidationSchema['comment_id'];
  userId: ValidationSchema['user_id'];
};

async function likeComment(
  userDataSource: UserDataSource,
  placeDataSource: PlaceDataSource,
  input: LikeCommentInput,
) {
  const validationResult = validator(
    {
      comment_id: input.commentId,
      user_id: input.userId,
    },
    {
      comment_id: 'required',
      user_id: 'required',
    },
  );

  if (validationResult.error) return validationResult;

  const { comment_id, user_id } = validationResult.data;

  const commentExists = await placeDataSource.checkCommentById(comment_id);
  if (!commentExists) {
    return operationResult.failure({
      message: 'Comentário não encontrado.',
      fields: ['comment_id'],
    });
  }

  const userExists = await userDataSource.checkById({ id: user_id });
  if (!userExists) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
      fields: ['user_id'],
    });
  }

  const userAlreadyLiked = await placeDataSource.checkCommentLike({
    commentId: comment_id,
    userId: user_id,
  });

  if (userAlreadyLiked) {
    return operationResult.failure({
      message: 'Você já curtiu este comentário.',
    });
  }

  await placeDataSource.likeComment({ commentId: comment_id, userId: user_id });

  return operationResult.success({});
}

async function unlikeComment(
  placeDataSource: PlaceDataSource,
  input: LikeCommentInput,
) {
  const validationResult = validator(
    {
      comment_id: input.commentId,
      user_id: input.userId,
    },
    {
      comment_id: 'required',
      user_id: 'required',
    },
  );

  if (validationResult.error) return validationResult;

  const { comment_id, user_id } = validationResult.data;

  await placeDataSource.unlikeComment({
    commentId: comment_id,
    userId: user_id,
  });

  return operationResult.success({});
}
