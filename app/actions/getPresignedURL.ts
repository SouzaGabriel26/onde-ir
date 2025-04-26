'use server';

import { env } from '@/utils/env';
import axios from 'axios';

type GetPresignedURLResponse = {
  presigned_url: string;
  file_url: string;
};

export async function getPresignedURL(file: File) {
  const { data } = await axios.post<GetPresignedURLResponse>(
    env.LAMBDA_FUNCTION_URL,
    {
      fileName: file.name,
    },
  );

  return data;
}
