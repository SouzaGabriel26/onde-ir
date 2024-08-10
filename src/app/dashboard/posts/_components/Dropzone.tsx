'use client';

import { Loader2Icon, PackageOpenIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/Button';
import { getPresignedURL, uploadFileToS3 } from '@/data/services/lambda';
import { sanitizeClassName } from '@/src/utils/sanitizeClassName';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

export function ImageUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<Array<File>>([]);

  const hasSomeInvalidFileType = useMemo(() => {
    return files.some((file) => !ALLOWED_FILE_TYPES.includes(file.type));
  }, [files]);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    setFiles(acceptedFiles);
  }, []);

  function handleDeleteFile(name: string) {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
  }

  async function handleUpload() {
    try {
      setIsLoading(true);

      const urls = await Promise.all(
        files.map(async (file) => ({
          url: await getPresignedURL(file),
          file,
        })),
      );

      const responses = await Promise.allSettled(
        urls.map(({ url, file }) => uploadFileToS3(url.presigned_url, file)),
      );

      responses.forEach((response, index) => {
        const fileName = files[index].name;

        if (response.status === 'rejected') {
          console.error(`O upload do arquivo ${fileName} falhou.`);
        } else {
          console.log(`Upload do arquivo ${fileName} com sucesso.`);
        }
      });
    } catch {
      console.log('Erro ao recuperar as URLs de upload.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dropzone onDrop={onDrop} />
      <FilesPreview files={files} onDeleteFile={handleDeleteFile} />

      <Button
        disabled={isLoading || !files.length || hasSomeInvalidFileType}
        type="button"
        onClick={handleUpload}
      >
        {isLoading && <Loader2Icon className="mr-2 animate-spin" />}
        Upload
      </Button>
    </>
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
          w-[500px]
          cursor-pointer
          rounded-md
          border
          p-2
          hover:bg-primary-foreground
        `,
        isDragActive && 'bg-primary-foreground',
      )}
    >
      <input {...getInputProps()} />

      <div className="flex h-full flex-col items-center justify-center">
        <PackageOpenIcon className="mb-2 size-12" />
        <h2>Solte suas fotos aqui</h2>
        <p className="text-zinc-500">
          São permitidos apenas arquivos png e jpeg
        </p>
      </div>
    </div>
  );
}

type FilesPreviewProps = {
  files: Array<File>;
  onDeleteFile: (name: string) => void;
};

function FilesPreview({ files, onDeleteFile }: FilesPreviewProps) {
  return (
    <div className="space-y-2">
      <span className="text-xl">Arquivos selecionados: {files.length}</span>
      <div className="max-h-80 space-y-2 overflow-y-auto p-2">
        {files.map((file) => (
          <FileItem key={file.name} file={file} onDelete={onDeleteFile} />
        ))}
      </div>
    </div>
  );
}

type FileItemProps = {
  file: File;
  onDelete: (name: string) => void;
};

function FileItem({ file, onDelete }: FileItemProps) {
  const isFileTypeWrong = !ALLOWED_FILE_TYPES.includes(file.type);

  return (
    <>
      <div
        title={file.name}
        className={sanitizeClassName(
          `
          flex
          w-full
          max-w-[500px]
          items-center
          justify-between
          rounded-md
          border
          bg-secondary
          p-1
          px-4
        `,
          isFileTypeWrong && 'border-destructive',
        )}
      >
        <span className="max-w-[390px] overflow-x-hidden text-nowrap">
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

      {isFileTypeWrong && (
        <span className="text-sm text-destructive">
          Tipo de arquivo {file.type} não permitido
        </span>
      )}
    </>
  );
}
