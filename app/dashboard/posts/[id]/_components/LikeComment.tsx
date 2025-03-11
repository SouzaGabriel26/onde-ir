'use client';

import { Button } from '@/components/ui/Button';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { Heart } from 'lucide-react';
import { startTransition, useEffect, useOptimistic, useState } from 'react';
import {
  checkUserCommentLikeAction,
  likeCommentAction,
  unlikeCommentAction,
} from '../actions';

type LikeCommentProps = {
  commentId: string;
  userId: string;
  placeId: string;
  likesCount: number;
};

export function LikeComment({
  commentId,
  userId,
  placeId,
  likesCount,
}: LikeCommentProps) {
  const [userAlreadyLikedComment, setUserAlreadyLikedComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [optimisticLikedState, setOptimisticLikedState] = useOptimistic(false);
  const [optimisticLikesCount, setOptimisticLikesCount] =
    useOptimistic(likesCount);

  useEffect(() => {
    if (!userId) return;

    async function checkUserCommentLike() {
      const hasLiked = await checkUserCommentLikeAction(commentId, userId);
      setUserAlreadyLikedComment(hasLiked);
    }

    checkUserCommentLike();
  }, [userId, commentId]);

  async function handleLikeComment() {
    if (!userId || isLoading) return;

    setIsLoading(true);

    startTransition(() => {
      setOptimisticLikesCount((prev) => prev + 1);
      setOptimisticLikedState(true);
    });

    const { success } = await likeCommentAction({ commentId, userId, placeId });
    setUserAlreadyLikedComment(success);

    if (!success) {
      startTransition(() => {
        setOptimisticLikesCount((prev) => prev - 1);
      });
    }

    setIsLoading(false);
  }

  async function handleUnlikeComment() {
    if (!userId || isLoading) return;

    setIsLoading(true);

    startTransition(() => {
      setOptimisticLikesCount((prev) => prev - 1);
      setOptimisticLikedState(false);
    });

    const { success } = await unlikeCommentAction({
      commentId,
      userId,
      placeId,
    });
    setUserAlreadyLikedComment(!success);

    if (!success) {
      startTransition(() => {
        setOptimisticLikesCount((prev) => prev + 1);
      });
    }

    setIsLoading(false);
  }

  return (
    <Button
      onClick={async () => {
        if (userAlreadyLikedComment) {
          handleUnlikeComment();
          return;
        }

        await handleLikeComment();
      }}
      disabled={!userId || isLoading}
      variant="ghost"
      size="sm"
      className="w-fit group"
    >
      <Heart
        className={sanitizeClassName(
          'mr-2 size-4 group-hover:fill-red-400',
          (userAlreadyLikedComment || optimisticLikedState) &&
            'fill-red-500 group-hover:fill-none',
        )}
      />
      {optimisticLikesCount}
    </Button>
  );
}
