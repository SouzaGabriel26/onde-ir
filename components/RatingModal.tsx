'use client';

import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/Dialog';

type RatingModalProps = {
  placeId: string;
  userId: string;
  className?: string;
  action: (formData: FormData) => void;
};

export function RatingModal({
  className,
  placeId,
  userId,
  action,
}: RatingModalProps) {
  const [hoverIndex, setHoverIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  function handleSelectIndex(index: number) {
    setSelectedIndex((prevIndex) => (prevIndex === index ? 0 : index));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className={className}>
          Avalie este local
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>
          De 1 a 5, quanto você recomendaria este local?
        </DialogTitle>

        <form action={action}>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: 5 }).map((_, index) => {
              const key = index + 1;

              return (
                <Button
                  onMouseEnter={() => setHoverIndex(key)}
                  onMouseLeave={() => setHoverIndex(0)}
                  onClick={() => handleSelectIndex(key)}
                  key={key}
                  variant="ghost"
                  type="button"
                >
                  <Star
                    className={sanitizeClassName(
                      'size-6',
                      key <= hoverIndex && 'fill-current',
                      key <= selectedIndex && 'fill-current',
                    )}
                  />
                </Button>
              );
            })}
          </div>
          <input type="hidden" defaultValue={selectedIndex} name="evaluation" />
          <input type="hidden" defaultValue={placeId} name="placeId" />
          <input type="hidden" defaultValue={userId} name="userId" />

          <Button className="w-full mt-4" disabled={selectedIndex === 0}>
            Enviar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
