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

  const [optimisticLike, setOptimisticLike] = useOptimistic({
    count: likesCount,
    liked: false,
  });

  useEffect(() => {
    if (!userId) return;

    async function checkUserCommentLike() {
      const hasLiked = await checkUserCommentLikeAction(commentId, userId);
      setUserAlreadyLikedComment(hasLiked);
    }

    checkUserCommentLike();
  }, [userId, commentId]);

  function optimisticLikeComment() {
    startTransition(() => {
      setOptimisticLike((prev) => ({ count: prev.count + 1, liked: true }));
    });
  }

  function optimisticUnlikeComment() {
    startTransition(() => {
      setOptimisticLike((prev) => ({ count: prev.count - 1, liked: false }));
    });
  }

  async function handleLikeComment() {
    if (!userId || isLoading) return;

    setIsLoading(true);

    optimisticLikeComment();
    setUserAlreadyLikedComment(true);

    const { success } = await likeCommentAction({ commentId, userId, placeId });
    setUserAlreadyLikedComment(success);

    if (!success) optimisticUnlikeComment();

    setIsLoading(false);
  }

  async function handleUnlikeComment() {
    if (!userId || isLoading) return;

    setIsLoading(true);

    optimisticUnlikeComment();
    setUserAlreadyLikedComment(false);

    const { success } = await unlikeCommentAction({
      commentId,
      userId,
      placeId,
    });
    setUserAlreadyLikedComment(!success);

    if (!success) optimisticLikeComment();

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
          (userAlreadyLikedComment || optimisticLike.liked) &&
            'fill-red-500 group-hover:fill-none',
        )}
      />
      {optimisticLike.count}
    </Button>
  );
}
