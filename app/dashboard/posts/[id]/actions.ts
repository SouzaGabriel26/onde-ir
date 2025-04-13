'use server';

import { createPlaceDataSource } from '@/data/place';
import { createUserDataSource } from '@/data/user';
import {
  type UpdateInput as ApprovePlaceInput,
  type CreateCommentInput,
  type DeleteCommentInput,
  type EvaluateInput,
  type LikeCommentInput,
  type UpdateCommentInput,
  place,
} from '@/models/place';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';
import { revalidatePath } from 'next/cache';

export async function approvePlaceAction(
  input: Omit<ApprovePlaceInput, 'status'>,
) {
  const placeDataSource = createPlaceDataSource();
  const userDataSource = createUserDataSource();

  const result = await place.update(userDataSource, placeDataSource, {
    placeId: input.placeId,
    reviewedBy: input.reviewedBy,
    status: 'APPROVED',
  });

  if (result.error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: result.error.message,
    });
    return;
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Local aprovado com sucesso!',
  });

  revalidatePath(`/dashboard/posts/${input.placeId}`);
}

export async function rejectPlaceAction(
  input: Omit<ApprovePlaceInput, 'status'>,
) {
  const placeDataSource = createPlaceDataSource();
  const userDataSource = createUserDataSource();

  const result = await place.update(userDataSource, placeDataSource, {
    placeId: input.placeId,
    reviewedBy: input.reviewedBy,
    status: 'REJECTED',
  });

  if (result.error) {
    return await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: result.error.message,
    });
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Local rejeitado com sucesso!',
  });

  revalidatePath(`/dashboard/posts/${input.placeId}`);
}

export async function ratePlaceAction(formData: FormData) {
  const data = form.sanitizeData<EvaluateInput>(formData);

  const placeDataSource = createPlaceDataSource();

  const result = await place.evaluate(placeDataSource, data);

  if (result.error) {
    return await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: result.error.message,
    });
  }

  revalidatePath(`/dashboard/posts/${data.placeId}`);
  return await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Local avaliado com sucesso!',
  });
}

export async function checkUserCommentLikeAction(
  commentId: string,
  userId: string,
) {
  const placeDataSource = createPlaceDataSource();

  const userAlreadyLikedComment = await placeDataSource.checkCommentLike({
    commentId,
    userId,
  });

  return userAlreadyLikedComment;
}

export async function likeCommentAction(
  input: LikeCommentInput & { placeId: string },
) {
  const userDateSource = createUserDataSource();
  const placeDataSource = createPlaceDataSource();

  const result = await place.likeComment(
    userDateSource,
    placeDataSource,
    input,
  );

  revalidatePath(`/dashboard/posts/${input.placeId}`);

  if (result.error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: 'Erro ao curtir comentário',
    });
    return { success: false };
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Comentário curtido com sucesso!',
  });
  return { success: true };
}

export async function unlikeCommentAction(
  _input: LikeCommentInput & { placeId: string },
) {
  const placeDataSource = createPlaceDataSource();
  const result = await place.unlikeComment(placeDataSource, {
    commentId: _input.commentId,
    userId: _input.userId,
  });

  if (result.error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: 'Erro ao descurtir comentário',
    });
    return { success: false };
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Comentário descurtido com sucesso!',
  });
  revalidatePath(`/dashboard/posts/${_input.placeId}`);
  return { success: true };
}

// use with "useActionState" hook
export async function commentAction(_prevState: unknown, formData: FormData) {
  const data = form.sanitizeData<CreateCommentInput>(formData);

  const userDataSource = createUserDataSource();
  const placeDataSource = createPlaceDataSource();

  const { error } = await place.createComment(
    userDataSource,
    placeDataSource,
    data,
  );

  if (error) {
    return await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: error.message,
    });
  }

  revalidatePath(`/dashboard/posts/${data.placeId}`);

  return await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Comentário publicado com sucesso!',
  });
}

export async function deleteCommentAction(
  _prevState: unknown,
  formData: FormData,
) {
  const data = form.sanitizeData<DeleteCommentInput>(formData);

  const userDataSource = createUserDataSource();
  const placeDataSource = createPlaceDataSource();

  const { error } = await place.deleteComment(userDataSource, placeDataSource, {
    commentId: data.commentId,
    userId: data.userId,
    placeId: data.placeId,
  });

  if (error) {
    return await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: error.message,
    });
  }

  return await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Comentário removido com sucesso!',
  });
}

export async function updateCommentAction(
  _prevState: unknown,
  formData: FormData,
) {
  const { commentId, description, userId } =
    form.sanitizeData<UpdateCommentInput>(formData);

  const userDataSource = createUserDataSource();
  const placeDataSource = createPlaceDataSource();

  const result = await place.updateComment(userDataSource, placeDataSource, {
    commentId,
    description,
    userId,
  });

  if (result.error) {
    return await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: result.error.message,
    });
  }

  return await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Comentário atualizado com sucesso!',
  });
}
