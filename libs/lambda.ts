import axios from 'axios';

import { env } from '@/src/utils/env';

type GetPresignedURLResponse = {
  presigned_url: string;
  file_url: string;
};

export async function getPresignedURL(file: File) {
  const { data } = await axios.post<GetPresignedURLResponse>(
    env.lambda_function_url,
    {
      fileName: file.name,
    },
  );

  return data;
}

export async function uploadFileToS3(presignedUrl: string, file: File) {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total!,
      );

      console.log(`${percentCompleted}%`);
    },
  });
}
