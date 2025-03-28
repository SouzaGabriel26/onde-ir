'use server';

import { createAuthenticationDataSource } from '@/data/authentication';
import { getPresignedURL, uploadFileToS3 } from '@/data/lambda';
import { password } from '@/models/password';
import type { User } from '@/types';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';
import { verify } from '@/utils/verify';

type EditUserActionResponse = {
  success: boolean;
  error?: {
    message: string;
    fields: {
      email: string;
      name: string;
      user_name: string;
      current_password: string;
      new_password: string;
    };
  };
};

export async function editUserAction(
  _prevState: unknown,
  formData: FormData,
): Promise<EditUserActionResponse> {
  const { data: user } = await verify.loggedUser();

  interface RawData {
    email: string;
    name: string;
    user_name: string;
    current_password?: string;
    new_password?: string;
    avatar_file?: File | null;
  }

  const data = form.sanitizeData<RawData>(formData);

  if (!user) {
    return {
      success: false,
      error: {
        message: 'Usuário não encontrado',
        fields: {
          email: data.email,
          name: data.name,
          user_name: data.user_name,
          current_password: '',
          new_password: '',
        },
      },
    };
  }

  const isToUpdatePassword = checkIsToUpdatePassword();
  // TODO: update password

  let newAvatarUrl = '';
  if (data.avatar_file?.size) {
    // upload to lambda and get url
    const { file_url, presigned_url } = await getPresignedURL(data.avatar_file);
    await uploadFileToS3(presigned_url, data.avatar_file);

    newAvatarUrl = file_url;
  }

  console.log(newAvatarUrl);

  const partialUserToUpdate: Partial<User> = {};

  for (const [key, value] of Object.entries(data)) {
    if (isChanged(key as keyof RawData)) {
      partialUserToUpdate[key as keyof User] = value;
    }
  }

  // TODO: Update partial user
  const updatedData = {
    ...partialUserToUpdate,
    isToUpdatePassword,
    newAvatarUrl: newAvatarUrl || undefined,
  };

  console.log(JSON.parse(JSON.stringify(updatedData, null, 2)));

  return {
    success: true,
  };

  function isChanged(currentField: keyof RawData) {
    if (
      currentField === 'current_password' ||
      currentField === 'new_password'
    ) {
      return Boolean(data[currentField]);
    }

    if (user && user[currentField as keyof User] !== undefined) {
      return data[currentField] !== user[currentField as keyof User];
    }

    return false;
  }

  function checkIsToUpdatePassword() {
    return Boolean(data.current_password || data.new_password);
  }
}

type RawUpdatePasswordData = {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
};

type UpdatePasswordActionResponse = {
  success: boolean;
  error?: {
    message: string;
    errorFields?: Array<keyof RawUpdatePasswordData>;
    fields?: {
      current_password: string;
      new_password: string;
      confirm_new_password: string;
    };
  };
};

export async function updatePasswordAction(
  _prevState: unknown,
  formData: FormData,
): Promise<UpdatePasswordActionResponse> {
  const data = form.sanitizeData<RawUpdatePasswordData>(formData);
  const { data: user } = await verify.loggedUser();

  if (!user) {
    return {
      success: false,
      error: {
        message: 'Usuário não encontrado',
      },
    };
  }

  const authDataSource = createAuthenticationDataSource();
  const changePasswordResult = await password.change(authDataSource, {
    current_password: data.current_password,
    new_password: data.new_password,
    confirm_new_password: data.confirm_new_password,
    user_id: user.id!,
  });

  if (changePasswordResult.error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: changePasswordResult.error.message,
    });

    return {
      success: false,
      error: {
        message: changePasswordResult.error.message,
        errorFields: changePasswordResult.error.fields as Array<
          keyof RawUpdatePasswordData
        >,
        fields: {
          current_password: data.current_password,
          new_password: data.new_password,
          confirm_new_password: data.confirm_new_password,
        },
      },
    };
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Senha atualizada com sucesso!',
  });
  return { success: true };
}
