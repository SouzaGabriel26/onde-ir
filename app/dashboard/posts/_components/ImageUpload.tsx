'use client';

import { Loader2Icon, PackageOpenIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { getPresignedURL, uploadFileToS3 } from '@/data/lambda';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { useRouter } from 'next/navigation';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

type Upload = {
  file: File;
  progress: number;
};

type ImageUploadProps = {
  actionOnUpload: (urls: Array<string>) => Promise<void>;
  successRedirectPath?: string;
};

const MAX_FILES = 5;

export function ImageUpload({
  actionOnUpload,
  successRedirectPath,
}: ImageUploadProps) {
  const route = useRouter();

  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploads, setUploads] = useState<Array<Upload>>([]);
  const [isDropping, setIsDropping] = useState(false);

  const hasSomeInvalidFileType = useMemo(() => {
    return uploads.some(
      (upload) => !ALLOWED_FILE_TYPES.includes(upload.file.type),
    );
  }, [uploads]);

  const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
    setIsDropping(true);

    setUploads((prevUploads) => {
      const uploadsToAdd = acceptedFiles.filter((file) => {
        const isFileAlreadyAdded = prevUploads.some(
          (upload) => upload.file.name === file.name,
        );

        return !isFileAlreadyAdded;
      });

      const newUploads = uploadsToAdd.map((file) => ({
        file,
        progress: 0,
      }));

      return [...prevUploads, ...newUploads];
    });

    setIsDropping(false);
  }, []);

  function handleDeleteUpload(name: string) {
    setUploads((prevState) =>
      prevState.filter((upload) => upload.file.name !== name),
    );
  }

  async function handleUpload() {
    try {
      setIsUploadingFiles(true);

      const uploadObjects = await Promise.all(
        uploads.map(async ({ file }) => ({
          url: await getPresignedURL(file),
          file,
        })),
      );

      const responses = await Promise.allSettled(
        uploadObjects.map(({ url, file }, index) =>
          uploadFileToS3(url.presigned_url, file, (progress) => {
            setUploads((prevState) => {
              const newUploads = [...prevState];
              const currentUpload = newUploads[index];

              currentUpload.progress = progress;

              return newUploads;
            });
          }),
        ),
      );

      if (responses.some((response) => response.status === 'rejected')) {
        toast.error('Algo deu errado ao enviar os arquivos.', {
          className: '!text-red-500',
        });
        return;
      }

      toast.success('Arquivos enviados com sucesso!', {
        className: '!text-green-500',
      });

      const urls = uploadObjects.map((upload) => upload.url.file_url);
      await actionOnUpload(urls);
      if (successRedirectPath) route.replace(successRedirectPath);
    } catch {
      console.error('Erro ao recuperar as URLs de upload.');
      toast.error('Erro ao recuperar as URLs de upload.');
    } finally {
      setIsUploadingFiles(false);
    }
  }

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <Dropzone
        isUploadingFiles={isUploadingFiles}
        isDropping={isDropping}
        onDrop={onDrop}
      />

      <FilesPreview
        isUploadingFiles={isUploadingFiles}
        uploads={uploads}
        onDeleteUpload={handleDeleteUpload}
      />

      <Button
        className="self-end"
        type="button"
        onClick={handleUpload}
        disabled={
          isUploadingFiles ||
          !uploads.length ||
          hasSomeInvalidFileType ||
          uploads.length > MAX_FILES
        }
      >
        {isUploadingFiles && <Loader2Icon className="mr-2 animate-spin" />}
        Enviar
      </Button>
    </div>
  );
}

type DropzoneProps = {
  onDrop: (files: Array<File>) => void;
  isDropping: boolean;
  isUploadingFiles: boolean;
};
export function Dropzone({
  onDrop,
  isDropping,
  isUploadingFiles,
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={sanitizeClassName(
        ` h-56
          w-[250px]
          cursor-pointer
          rounded-md
          border
          p-2
          hover:bg-muted
          transition-all
          ease-in-out
          md:w-[500px]
        `,
        isDragActive && 'bg-primary-foreground',
        isUploadingFiles && 'cursor-not-allowed pointer-events-none',
      )}
    >
      {isDropping ? (
        <div className="flex h-full flex-col items-center justify-center">
          <Loader2Icon className="mb-2 size-12 animate-spin" />
          <h2>Carregando suas fotos</h2>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <PackageOpenIcon className="mb-2 size-12" />
          <h2>Solte suas fotos aqui</h2>
          <p className="text-center text-sm text-zinc-500">
            São permitidos apenas arquivos png e jpeg
          </p>
        </div>
      )}
      <input accept="image/png, image/jpg, image/jpeg" {...getInputProps()} />
    </div>
  );
}

type FilesPreviewProps = {
  uploads: Array<Upload>;
  onDeleteUpload: (name: string) => void;
  isUploadingFiles: boolean;
};

function FilesPreview({
  uploads,
  isUploadingFiles,
  onDeleteUpload,
}: FilesPreviewProps) {
  return (
    <div className="space-y-2 shadow-md p-3 rounded-md">
      <span className="text-xl">Arquivos selecionados: {uploads.length}</span>

      {uploads.length > MAX_FILES && (
        <span className="text-sm block text-destructive">
          O número máximo de arquivos permitidos é {MAX_FILES}
        </span>
      )}

      <div
        className={sanitizeClassName(
          'max-h-80 space-y-2 overflow-y-auto scrollbar rounded-md p-2',
          isUploadingFiles && 'pointer-events-none cursor-not-allowed',
        )}
      >
        {uploads.map(({ file, progress }) => (
          <FileItem
            key={file.name}
            file={file}
            progress={progress}
            onDelete={onDeleteUpload}
          />
        ))}
      </div>
    </div>
  );
}

type FileItemProps = {
  file: File;
  progress: number;
  onDelete: (name: string) => void;
};

function FileItem({ file, progress, onDelete }: FileItemProps) {
  const isFileTypeWrong = !ALLOWED_FILE_TYPES.includes(file.type);

  return (
    <>
      <div
        title={file.name}
        className={sanitizeClassName(
          `
            w-full
            max-w-[250px]
            space-y-2
            rounded-md
            border
            bg-secondary
            p-1
            px-4
            md:max-w-[500px]
          `,
          isFileTypeWrong && 'border-destructive',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="max-w-[160px] overflow-x-hidden text-ellipsis text-nowrap md:max-w-[390px]">
            {file.name}
          </span>

          <Button
            onClick={() => onDelete(file.name)}
            className="bg-red-600 px-3 transition-all hover:bg-red-700"
            title="Deletar"
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>

        <Progress value={progress} />
      </div>

      {isFileTypeWrong && (
        <span className="text-sm text-destructive">
          Tipo de arquivo {file.type} não permitido
        </span>
      )}
    </>
  );
}
