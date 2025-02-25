'use client';

import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import type { FormattedComment } from '@/models/place';
import {
  Edit,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Trash,
} from 'lucide-react';
import { useActionState } from 'react';
import { deleteCommentAction } from '../actions';

type PlaceComment = {
  comment: FormattedComment;
  userId: string;
  isPostOwner: boolean;
  isAdmin: boolean;
  placeId: string;
};

export function PlaceComment({
  comment,
  userId,
  isAdmin,
  isPostOwner,
  placeId,
}: PlaceComment) {
  const [_state, deleteAction, isPending] = useActionState(
    deleteCommentAction,
    null,
  );

  const isCommentOwner = comment.user_id === userId;
  const hasPermissionToDelete = isPostOwner || isAdmin || isCommentOwner;

  function getFormattedDate(date: Date) {
    return date.toLocaleDateString('pt-br', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div key={comment.id} className="p-3 space-y-2 relative">
      <div className="flex gap-2 items-center">
        <UserAvatar name={comment.user_name} imageUrl={comment.avatar_url} />

        <div>
          <strong>{comment.user_name}</strong>
          <p className="text-muted-foreground text-sm">
            {getFormattedDate(comment.created_at)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="ml-12 text-sm">{comment.description}</p>

        <div className="flex gap-4">
          <Button
            disabled={!userId}
            variant="ghost"
            size="sm"
            className="w-fit group"
          >
            <Heart className="mr-2 size-4 group-hover:fill-red-500" />
            Curtir
          </Button>

          <Button
            disabled={!userId}
            variant="ghost"
            size="sm"
            className="w-fit group"
          >
            <MessageCircle className="mr-2 size-4" />
            Responder
          </Button>
        </div>
      </div>

      {hasPermissionToDelete && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
            >
              <MoreHorizontal />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <form>
              <input type="hidden" name="placeId" value={placeId} />
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="userId" value={userId} />

              <Button
                disabled={!isCommentOwner || isPending}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <Edit className="mr-2 size-4" />
                Editar
              </Button>

              <Button
                formAction={deleteAction}
                disabled={!hasPermissionToDelete || isPending}
                variant="ghost"
                size="sm"
                className="w-full text-red-500 hover:text-red-600"
              >
                <Trash className="mr-2 size-4" />
                Deletar
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
