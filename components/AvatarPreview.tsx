'use client';

import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { DialogTitle } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { useState } from 'react';
import { AnimatedComponent } from './AnimatedComponent';
import { Button } from './ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from './ui/Dialog';

type AvatarPreviewProps = {
  onRemove: () => void;
  previewUrl: string;
  className?: string;
};

export function AvatarPreview({
  onRemove,
  previewUrl,
  className,
}: AvatarPreviewProps) {
  const [isOpen, setIsOpen] = useState(!!previewUrl);

  if (!previewUrl) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={sanitizeClassName(
            'relative w-20 h-20 border-2 border-dashed rounded-full group cursor-pointer',
            className,
          )}
        >
          <Image
            src={previewUrl}
            alt="Avatar"
            className="rounded-full w-full h-full object-cover group-hover:opacity-40 transition-all"
            sizes="100%"
            fill
          />
        </div>
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogTitle>Foto Preview</DialogTitle>
        {previewUrl && (
          <div className="w-full h-[500px] relative">
            <Image
              src={previewUrl}
              alt="Avatar"
              className="w-full h-full object-cover rounded-md"
              sizes="100%"
              fill
            />
          </div>
        )}

        <DialogFooter>
          <Button
            asChild
            className="flex items-center gap-2 outline-none"
            size="lg"
            onClick={() => {
              onRemove();
              setIsOpen(false);
            }}
            variant="destructive"
          >
            <AnimatedComponent variant="button">Remover</AnimatedComponent>
          </Button>

          <Button
            asChild
            className="flex items-center gap-2 outline-none"
            size="lg"
            onClick={() => {
              setIsOpen(false);
            }}
            variant="outline"
          >
            <AnimatedComponent variant="button">Continuar</AnimatedComponent>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
