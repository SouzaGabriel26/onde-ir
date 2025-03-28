'use client';

import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { User } from '@/types';
import { setInputError } from '@/utils/inputError';
import { Edit, Trash } from 'lucide-react';
import { useActionState, useRef, useState } from 'react';
import { editUserAction, updatePasswordAction } from './action';

type EditProfileProps = {
  user: Partial<User>;
};

export function EditProfile({ user }: EditProfileProps) {
  const [_editUserState, editUser, _loadingEditUser] = useActionState(
    editUserAction,
    null,
  );
  const [updatePasswordState, updatePassword, loadingUpdatePassword] =
    useActionState(updatePasswordAction, null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string>('');

  function handleClickAvatar() {
    if (!imgInputRef.current) return;

    imgInputRef.current.click();
  }

  function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setNewPhotoPreview(previewUrl);
  }

  function onRemovePhoto() {
    if (!imgInputRef.current) return;

    setNewPhotoPreview('');
    imgInputRef.current.value = '';
  }
  /*
    useEffect(() => {
      if (updatePasswordState?.error) {
        toast.error(updatePasswordState.error.message)
      }

      if (updatePasswordState?.success) {
        toast.success('Senha atualizada com sucesso!');
      }
    }, [updatePasswordState]) */

  return (
    <div className="p-4 space-y-10">
      <form action={editUser}>
        {user.name && (
          <div className="flex justify-center gap-2">
            <div
              className="relative w-fit border-2 border-dashed rounded-full group cursor-pointer"
              onClick={handleClickAvatar}
            >
              <UserAvatar
                key={newPhotoPreview}
                name={user.name ?? ''}
                className="size-20 group-hover:opacity-20 group-hover:bg-background ease-in-out"
                imageUrl={newPhotoPreview ? newPhotoPreview : user.avatar_url}
              />
              <p className="absolute top-7 text-md left-3.5 hidden group-hover:block">
                Upload
              </p>
              <input
                hidden
                max={1}
                ref={imgInputRef}
                type="file"
                name="avatar_file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={onUploadFile}
              />
            </div>

            {newPhotoPreview && (
              <Button
                title="Remover foto atualizada"
                variant="destructive"
                onClick={onRemovePhoto}
              >
                <Trash className="size-4" />
              </Button>
            )}
          </div>
        )}
        <p className="text-muted-foreground mb-2 text-md">
          Informações básicas do usuário:
        </p>
        <fieldset className="space-y-4">
          <div className="flex gap-2 flex-col md:flex-row">
            <Input placeholder="Email" name="email" defaultValue={user.email} />
            <Input placeholder="Nome" name="name" defaultValue={user.name} />
            <Input
              placeholder="Username"
              name="username"
              defaultValue={user.user_name}
            />
          </div>
          <Button className="w-full flex gap-2">
            <Edit className="size-5" />
            Atualizar informações do usuario
          </Button>
        </fieldset>
      </form>

      <form action={updatePassword} className="flex flex-col">
        <p className="text-muted-foreground mb-2 text-md">
          Atualização de senha:
        </p>
        <div className="flex gap-2 flex-col md:flex-row w-full mb-4">
          <div className="w-full flex gap-2">
            <Input
              type="password"
              name="current_password"
              placeholder="Senha atual"
              defaultValue={
                updatePasswordState?.error?.fields?.current_password
              }
              error={setInputError('current_password', {
                fields: updatePasswordState?.error?.errorFields,
                message: updatePasswordState?.error?.message,
              })}
            />
            <Input
              type="password"
              name="new_password"
              placeholder="Nova senha"
              defaultValue={updatePasswordState?.error?.fields?.new_password}
              error={setInputError('new_password', {
                fields: updatePasswordState?.error?.errorFields,
                message: updatePasswordState?.error?.message,
              })}
            />
            <Input
              type="password"
              name="confirm_new_password"
              placeholder="Confirmação de nova senha"
              defaultValue={
                updatePasswordState?.error?.fields?.confirm_new_password
              }
              error={setInputError('confirm_new_password', {
                fields: updatePasswordState?.error?.errorFields,
                message: updatePasswordState?.error?.message,
              })}
            />
          </div>
        </div>
        <Button className="w-full flex gap-2">
          <Edit className="size-5" />
          {loadingUpdatePassword ? 'Atualizando senha' : 'Atualizar senha'}
        </Button>
      </form>
    </div>
  );
}
