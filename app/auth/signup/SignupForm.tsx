'use client';

import { AvatarPreview } from '@/components/AvatarPreview';
import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/Input';
import { setInputError } from '@/utils/inputError';
import { useActionState, useRef, useState } from 'react';
import { type SignUpActionResponse, signUpAction } from './store';

const initialState: SignUpActionResponse = {
  data: null,
  error: {
    message: '',
    fields: [],
  },
};

export function SignupForm() {
  const [state, action, _isPending] = useActionState(
    signUpAction,
    initialState,
  );
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  }

  function onRemovePhoto() {
    if (!imgInputRef.current) return;

    imgInputRef.current.value = '';
    setPhotoPreview(null);
  }

  return (
    <form className="flex flex-col gap-3" action={action}>
      <Input
        required
        id="name"
        defaultValue={state.inputs?.name}
        placeholder="Nome*"
        name="name"
        autoComplete="off"
        error={setInputError('name', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />
      <Input
        required
        id="email"
        type="email"
        defaultValue={state.inputs?.email}
        placeholder="Email*"
        name="email"
        error={setInputError('email', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />
      <Input
        required
        id="user_name"
        defaultValue={state.inputs?.user_name}
        placeholder="Username*"
        name="user_name"
        autoComplete="off"
        error={setInputError('user_name', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />
      <Input
        required
        id="password"
        defaultValue={state.inputs?.password}
        placeholder="Senha*"
        type="password"
        name="password"
        autoComplete="off"
        error={setInputError('password', {
          fields: state?.error?.fields,
          message: state?.error?.message.replace('password', 'senha'),
        })}
      />
      <Input
        required
        id="confirm_password"
        defaultValue={state.inputs?.confirm_password}
        placeholder="Confirmar Senha*"
        type="password"
        name="confirm_password"
        autoComplete="off"
        error={setInputError('confirm_password', {
          fields: state?.error?.fields,
          message: state?.error?.message,
        })}
      />

      <Input
        onChange={onUploadFile}
        ref={imgInputRef}
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        name="avatar_file"
        className="cursor-pointer hover:bg-muted transition-all"
      />

      <div className="w-full flex justify-center">
        <AvatarPreview
          onRemove={onRemovePhoto}
          previewUrl={photoPreview ?? ''}
        />
      </div>

      <SubmitButton>Cadastrar</SubmitButton>
    </form>
  );
}
