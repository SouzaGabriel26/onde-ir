'use client';

import type { FindAllPlacesOutput } from '@/data/place';
import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './Carousel';
import { Button } from './ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog';

type PostPreviewModalProps = {
  place: FindAllPlacesOutput;
  isOpen: boolean;
  href: string;
  setIsOpen: (isOpen: boolean) => void;
};

export function PostPreviewModal({
  isOpen,
  place,
  href,
  setIsOpen,
}: PostPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{place.name}</DialogTitle>
        </DialogHeader>

        <DialogDescription>{place.description}</DialogDescription>

        <div className="flex justify-center px-8 md:px-0">
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {place.images.map((placeImage) => (
                <CarouselItem key={placeImage}>
                  <div className="relative h-64">
                    <Image
                      src={placeImage}
                      alt={place.name}
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <p className="text-end text-muted-foreground">
          {place.images.length > 1
            ? `${place.images.length} fotos`
            : `${place.images.length} foto`}
        </p>

        <div className="flex justify-between gap-4 p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground flex items-center gap-1 text-sm">
              <MapPin className="size-4" />
              {place.city}, {place.state}
            </p>

            <p className="text-sm text-muted-foreground">{place.street}</p>
          </div>

          <div className="flex gap-2 items-center text-primary self-start">
            <Star className="size-4 fill-primary" />
            <Star className="size-4 fill-primary" />
            <Star className="size-4 fill-primary" />
            <Star className="size-4 fill-primary" />
            <Star className="size-4" />
            4.5
          </div>
        </div>

        <Link href={href ?? '#'} prefetch className="w-full">
          <Button className="w-full">Ver mais detalhes</Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
