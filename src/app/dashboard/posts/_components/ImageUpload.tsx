'use client';

import { Loader2Icon, PackageOpenIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { getPresignedURL, uploadFileToS3 } from '@/data/lambda';
import { sanitizeClassName } from '@/src/utils/sanitizeClassName';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

type Upload = {
  file: File;
  progress: number;
};

export function ImageUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<Array<Upload>>([]);

  const hasSomeInvalidFileType = useMemo(() => {
    return uploads.some(
      (upload) => !ALLOWED_FILE_TYPES.includes(upload.file.type),
    );
  }, [uploads]);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    setUploads(acceptedFiles.map((file) => ({ file, progress: 0 })));
  }, []);

  function handleDeleteUpload(name: string) {
    setUploads((prevState) =>
      prevState.filter((upload) => upload.file.name !== name),
    );
  }

  async function handleUpload() {
    try {
      setIsLoading(true);

      const uploadsObject = await Promise.all(
        uploads.map(async ({ file }) => ({
          url: await getPresignedURL(file),
          file,
        })),
      );

      const responses = await Promise.allSettled(
        uploadsObject.map(({ url, file }, index) =>
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

      responses.forEach((response, index) => {
        const fileName = uploads[index].file.name;

        if (response.status === 'rejected') {
          toast.error(`Erro ao enviar o arquivo ${fileName}`);
        } else {
          toast.success(`Arquivo ${fileName} enviado com sucesso!`);
          //save url.file_url in database
        }
      });
    } catch {
      console.error('Erro ao recuperar as URLs de upload.');
      toast.error('Erro ao recuperar as URLs de upload.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <Dropzone onDrop={onDrop} />
      <FilesPreview uploads={uploads} onDeleteUpload={handleDeleteUpload} />

      <Button
        className="w-full"
        type="button"
        onClick={handleUpload}
        disabled={isLoading || !uploads.length || hasSomeInvalidFileType}
      >
        {isLoading && <Loader2Icon className="mr-2 animate-spin" />}
        Enviar
      </Button>
    </div>
  );
}

type DropzoneProps = {
  onDrop: (files: Array<File>) => void;
};
export function Dropzone({ onDrop }: DropzoneProps) {
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
          hover:bg-primary-foreground
          md:w-[500px]
        `,
        isDragActive && 'bg-primary-foreground',
      )}
    >
      <input {...getInputProps()} />

      <div className="flex h-full flex-col items-center justify-center">
        <PackageOpenIcon className="mb-2 size-12" />
        <h2>Solte suas fotos aqui</h2>
        <p className="text-center text-sm text-zinc-500">
          São permitidos apenas arquivos png e jpeg
        </p>
      </div>
    </div>
  );
}

type FilesPreviewProps = {
  uploads: Array<Upload>;
  onDeleteUpload: (name: string) => void;
};

function FilesPreview({ uploads, onDeleteUpload }: FilesPreviewProps) {
  return (
    <div className="space-y-2">
      <span className="text-xl">Arquivos selecionados: {uploads.length}</span>
      <div className="max-h-80 space-y-2 overflow-y-auto rounded-md p-2">
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
            <Trash2Icon className="size-4 stroke-primary" />
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
