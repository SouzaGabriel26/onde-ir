'use server';

import { createPlaceDataSource } from '@/data/place';
import { createUserDataSource } from '@/data/user';
import {
  type UpdateInput as ApprovePlaceInput,
  type CreateCommentInput,
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
