import axios from 'axios';

export async function uploadFileToS3(
  presignedUrl: string,
  file: File,
  onProgress?: (progress: number) => void,
) {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: ({ loaded, total }) => {
      const percentage = Math.round((loaded * 100) / (total ?? 0));

      onProgress?.(percentage);
    },
  });
}
