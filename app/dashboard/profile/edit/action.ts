'use server';

import { getPresignedURL } from '@/app/actions/getPresignedURL';
import { createAuthenticationDataSource } from '@/data/authentication';
import { uploadFileToS3 } from '@/data/lambda';
import { createUserDataSource } from '@/data/user';
import { password } from '@/models/password';
import { user } from '@/models/user';
import type { User } from '@/types';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';
import { verify } from '@/utils/verify';
import { revalidatePath } from 'next/cache';

type EditUserRawData = {
  email: string;
  name: string;
  username: string;
  avatar_file?: File | null;
};

type EditUserActionResponse = {
  success: boolean;
  error?: {
    message: string;
    errorFields?: Array<keyof EditUserRawData>;
    fields: {
      email: string;
      name: string;
      username: string;
    };
  };
};

export async function editUserAction(
  _prevState: unknown,
  formData: FormData,
): Promise<EditUserActionResponse> {
  const { data: loggedUser } = await verify.loggedUser();

  const data = form.sanitizeData<EditUserRawData>(formData);

  if (!loggedUser) {
    return {
      success: false,
      error: {
        message: 'Usuário não encontrado',
        fields: {
          email: data.email,
          name: data.name,
          username: data.username,
        },
      },
    };
  }

  let newAvatarUrl: string | undefined = undefined;
  if (data.avatar_file?.size) {
    // upload to lambda and get url
    const { file_url, presigned_url } = await getPresignedURL(data.avatar_file);
    await uploadFileToS3(presigned_url, data.avatar_file);

    newAvatarUrl = file_url;
  }

  const rawUserDataToUpdate = {
    email: data.email,
    name: data.name,
    user_name: data.username,
    avatar_url: newAvatarUrl,
  };

  type RawUserDataKey = keyof typeof rawUserDataToUpdate;

  let partialUserToUpdate: Partial<User> = {};

  for (const [key, value] of Object.entries(rawUserDataToUpdate)) {
    if (isChanged(key as RawUserDataKey)) {
      partialUserToUpdate[key as RawUserDataKey] = value;
    }
  }

  partialUserToUpdate = JSON.parse(JSON.stringify(partialUserToUpdate));

  if (!Object.keys(partialUserToUpdate).length) {
    return {
      success: false,
      error: {
        message: 'Nenhum dado foi alterado',
        fields: {
          email: data.email,
          name: data.name,
          username: data.username,
        },
      },
    };
  }

  const userDataSource = createUserDataSource();
  const { error } = await user.update(userDataSource, {
    user_id: loggedUser.id!,
    ...partialUserToUpdate,
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        errorFields: error.errorFields as Array<keyof EditUserRawData>,
        fields: {
          email: data.email,
          name: data.name,
          username: data.username,
        },
      },
    };
  }

  revalidatePath('/dashboard/profile/edit');

  return {
    success: true,
  };

  function isChanged(currentField: RawUserDataKey) {
    if (loggedUser && loggedUser[currentField] !== undefined) {
      return rawUserDataToUpdate[currentField] !== loggedUser[currentField];
    }

    return false;
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
