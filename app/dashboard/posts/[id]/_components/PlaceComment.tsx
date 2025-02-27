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
  X,
} from 'lucide-react';
import { useActionState, useState } from 'react';
import { deleteCommentAction, updateCommentAction } from '../actions';

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
  const [_deleteState, deleteAction, isPendingDelete] = useActionState(
    deleteCommentAction,
    null,
  );
  const [_updateState, updateAction, isPendingUpdate] = useActionState(
    updateCommentAction,
    null,
  );

  const [isEditMode, setIsEditMode] = useState(false);

  const isCommentOwner = comment.user_id === userId;
  const hasPermissionToDelete = isPostOwner || isAdmin || isCommentOwner;

  function handleToggleEditMode() {
    setIsEditMode((prevState) => !prevState);
  }

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
        {userId && isEditMode ? (
          <form id={`form-comment-${comment.id}`}>
            <input type="hidden" name="commentId" defaultValue={comment.id} />
            <input type="hidden" name="userId" defaultValue={userId} />

            <textarea
              name="description"
              required
              placeholder="Compartilhe sua experiência..."
              className="rounded outline-none w-full bg-slate-200 dark:bg-slate-900 p-3"
              rows={3}
              defaultValue={comment.description}
            />
          </form>
        ) : (
          <p className="ml-12 text-sm">{comment.description}</p>
        )}

        <div className="flex justify-between items-center">
          <fieldset className="space-x-4">
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
          </fieldset>

          {isEditMode && (
            <Button
              form={`form-comment-${comment.id}`}
              formAction={(formData: FormData) => {
                updateAction(formData);
                setIsEditMode(false);
              }}
              disabled={isPendingUpdate}
            >
              Salvar
            </Button>
          )}
        </div>
      </div>

      {hasPermissionToDelete && !isEditMode && (
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
                onClick={handleToggleEditMode}
                type="button"
                disabled={!isCommentOwner || isPendingDelete}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <Edit className="mr-2 size-4" />
                Editar
              </Button>

              <Button
                formAction={deleteAction}
                disabled={!hasPermissionToDelete || isPendingDelete}
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

      {isEditMode && (
        <Button
          onClick={handleToggleEditMode}
          className="absolute right-4 top-2"
          variant="destructive"
          title="Sair do modo edição"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
