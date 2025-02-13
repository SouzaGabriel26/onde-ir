'use client';

import Image from 'next/image';

import { CustomTooltip } from '@/components/CustomTooltip';
import { Badge } from '@/components/ui/Badge';
import type { FindAllPlacesOutput } from '@/data/place';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { BadgeInfo, MapPin, Star } from 'lucide-react';
import type { Route } from 'next';
import { useState } from 'react';

import { PostPreviewModal } from './PostPreviewModal';

type ImageCardProps = {
  place: FindAllPlacesOutput;
  variant?: 'md' | 'lg';
  className?: string;
  href?: Route;
  isOwner?: boolean;
  clickable?: boolean;
};

export function ImageCard({
  className,
  place,
  variant = 'lg',
  href,
  isOwner,
  clickable = true,
}: ImageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => clickable && setIsModalOpen(true)}
        className={sanitizeClassName(
          'rounded-[20px] shadow w-[258px] md:w-[420px] relative',
          className,
        )}
      >
        <CustomTooltip tip={place.name}>
          <div className="rounded-[20px] border border-[#DCE2E5] transition hover:scale-105 hover:shadow-2xl">
            <div
              className={sanitizeClassName(
                'relative',
                'h-44 md:h-52 w-[258px] md:w-[420px]',
              )}
            >
              <Image
                fill
                src={place.images[0]}
                alt={place.name}
                sizes="100%"
                className="rounded-t-[20px] object-cover"
              />
            </div>

            <div
              className={sanitizeClassName(
                `
                  w-[258px] md:w-[420px]
                  space-y-2
                  rounded-b-[20px]
                  bg-white
                  p-6
                  md:flex
                  md:justify-between
                `,
                variant === 'md' ? 'h-20' : 'h-28',
              )}
            >
              <div>
                <h3
                  className={`
                    overflow-hidden
                    text-start
                    text-ellipsis
                    whitespace-nowrap
                    text-base
                    md:text-xl
                    items-end
                    font-semibold
                    leading-5
                    text-[#123952]
                  `}
                >
                  {place.name}
                </h3>
                <p className="text-start text-muted-foreground text-sm md:text-sm flex gap-1 items-center">
                  <MapPin className="size-4" />
                  {place.city}, {place.state}
                </p>
              </div>

              <div className="text-[#123952] flex items-center gap-1 self-end">
                <Star fill="#123952" className="size-4" />
                4.5
              </div>
            </div>
          </div>
        </CustomTooltip>

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
