'use client';

import { Button } from '@/components/ui/Button';
import type { FormattedComment } from '@/models/place';
import { useActionState } from 'react';
import { commentAction } from '../actions';
import { PlaceComment } from './PlaceComment';

type PlaceCommentsProps = {
  comments: FormattedComment[];
  isPostOwner: boolean;
  isAdmin: boolean;
  userId: string;
  placeId: string;
};

export function PlaceComments({
  comments,
  isAdmin,
  isPostOwner,
  userId,
  placeId,
}: PlaceCommentsProps) {
  const [_state, action, isPending] = useActionState(commentAction, null);

  return (
    <div className="border rounded-md space-y-4 p-2">
      <form action={action} className="flex flex-col gap-2">
        <textarea
          name="description"
          required
          placeholder={
            userId
              ? 'Compartilhe sua experiência...'
              : 'Faça login para comentar'
          }
          className="rounded outline-none w-full bg-slate-200 dark:bg-slate-900 p-3"
          rows={5}
        />

        <Button disabled={!userId || isPending} className="self-end">
          {isPending ? 'Publicando comentário...' : 'Publicar comentário'}
        </Button>

        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="placeId" value={placeId} />
      </form>

      <div className="divide-y">
        {comments.map((comment) => {
          const hasChildComments =
            comment.child_comments && comment.child_comments.length > 0;

          return (
            <div key={comment.id}>
              <PlaceComment
                placeId={placeId}
                comment={comment}
                isAdmin={isAdmin}
                isPostOwner={isPostOwner}
                userId={userId}
              />

              {hasChildComments && (
                <div className="ml-7 border-l my-2">
                  {comment.child_comments?.map((childComment) => (
                    <PlaceComment
                      key={childComment.id}
                      comment={childComment}
                      isAdmin={isAdmin}
                      isPostOwner={isPostOwner}
                      userId={userId}
                      placeId={placeId}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
