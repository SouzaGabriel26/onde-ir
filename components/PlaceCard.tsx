'use client';

import { CustomTooltip } from '@/components/CustomTooltip';
import { Badge } from '@/components/ui/Badge';
import type { FindAllPlacesOutput } from '@/data/place';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { BadgeInfo, MapPin } from 'lucide-react';
import type { Route } from 'next';
import { useState } from 'react';

import { PostPreviewModal } from './PostPreviewModal';
import { ImageCard } from './landing-page/ImageCard';

type PlaceCardProps = {
  place: FindAllPlacesOutput;
  variant?: 'md' | 'lg';
  className?: string;
  href?: Route;
  isOwner?: boolean;
  clickable?: boolean;
  tipDisabled?: boolean;
};

export function PlaceCard({
  className,
  place,
  variant = 'lg',
  href,
  isOwner,
  clickable = true,
  tipDisabled,
}: PlaceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          if (clickable) setIsModalOpen(true);
        }}
        className={sanitizeClassName(
          'rounded-[20px] w-full relative cursor-pointer',
          className,
        )}
      >
        <CustomTooltip tip={place.name} disabled={tipDisabled}>
          <div className="rounded-[20px] border transition hover:shadow-md overflow-hidden group">
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <ImageCard
                image={place.images[0]}
                name={place.name}
                index={0}
                className="rounded-t-[20px]"
              />
            </div>

            <div
              className={sanitizeClassName(
                `
                  w-full
                  space-y-2
                  rounded-b-[20px]
                  px-4
                  py-3
                  md:flex
                  md:justify-between
                `,
                variant === 'md' ? 'h-24' : 'h-32',
              )}
            >
              <div className="flex flex-col gap-2 justify-center w-full">
                <h3
                  className={`
                    overflow-hidden
                    text-start
                    text-ellipsis
                    whitespace-nowrap
                    text-base
                    md:text-xl
                    font-semibold
                    leading-5
                  `}
                >
                  {place.name}
                </h3>
                <p className="text-start text-muted-foreground text-sm flex gap-1 items-center">
                  <MapPin className="size-4" />
                  {place.city}, {place.state}
                </p>
              </div>
            </div>
          </div>
        </CustomTooltip>

        <Badge className="absolute top-2 left-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
          {place.category_name}
        </Badge>

        {isOwner && (
          <Badge className="absolute top-2 right-2 rounded-full">
            <CustomTooltip tip="Você é o dono desse post">
              <BadgeInfo />
            </CustomTooltip>
          </Badge>
        )}
      </div>

      <PostPreviewModal
        place={place}
        href={href ?? '#'}
        setIsOpen={setIsModalOpen}
        isOpen={isModalOpen}
      />
    </>
  );
}
