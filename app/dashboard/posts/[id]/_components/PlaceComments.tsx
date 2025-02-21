'use client';

import { Button } from '@/components/ui/Button';
import type { FormattedComment } from '@/models/place';
import { PlaceComment } from './PlaceComment';

type PlaceCommentsProps = {
  comments: FormattedComment[];
  isPostOwner: boolean;
  isAdmin: boolean;
  userId: string;
};

export function PlaceComments({
  comments,
  isAdmin,
  isPostOwner,
  userId,
}: PlaceCommentsProps) {
  return (
    <div className="border rounded-md space-y-4 p-2">
      <form className="flex flex-col gap-2">
        <textarea
          required
          placeholder="Compartilhe sua experiência..."
          className="rounded outline-none w-full bg-slate-200 dark:bg-slate-900 p-3"
          rows={5}
        />

        <Button className="self-end">Publicar comentário</Button>
      </form>

      <div className="divide-y">
        {comments.map((comment) => {
          const hasChildComments =
            comment.child_comments && comment.child_comments.length > 0;

          return (
            <div key={comment.id}>
              <PlaceComment
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
