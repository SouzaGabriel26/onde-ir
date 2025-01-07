import Image from 'next/image';
import Link from 'next/link';

import { CustomTooltip } from '@/components/CustomTooltip';
import { Badge } from '@/components/ui/Badge';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { BadgeInfo } from 'lucide-react';
import type { Route } from 'next';

type ImageCardProps = {
  src: string;
  alt: string;
  title: string;
  description: string;
  variant?: 'md' | 'lg';
  className?: string;
  href?: Route;
  isOwner?: boolean;
};

export function ImageCard({
  className,
  alt,
  title,
  description,
  variant = 'lg',
  src,
  href,
  isOwner,
}: ImageCardProps) {
  const MAX_DESCRIPTION_CHARACTERS = 51;

  return (
    <Link
      href={href ?? '#'}
      className={sanitizeClassName(
        'rounded-[20px] shadow w-[258px] md:w-[290px] relative',
        className,
      )}
    >
      <CustomTooltip tip={title}>
        <div className="rounded-[20px] border border-[#DCE2E5] transition hover:scale-105 hover:shadow-2xl">
          <div
            className={sanitizeClassName(
              'relative',
              'h-44 md:h-52 w-[258px] md:w-[290px]',
            )}
          >
            <Image
              fill
              src={src}
              alt={alt}
              sizes="100%"
              className="rounded-t-[20px] object-cover"
            />
          </div>

          <div
            className={sanitizeClassName(
              `
              w-[258px] md:w-[290px]
              space-y-2
              rounded-b-[20px]
              bg-white
              p-6
            `,
              variant === 'md' ? 'h-20' : 'h-28',
            )}
          >
            <h3
              className={`
                max-w-56
                overflow-hidden
                text-ellipsis
                whitespace-nowrap
                text-base
                md:text-xl
                font-semibold
                leading-5
                text-[#123952]
              `}
            >
              {title}
            </h3>
            <p
              className={`
                max-w-56
                overflow-hidden
                break-words
                leading-6
                text-muted-foreground
                text-xs
                sm:text-sm
                md:text-base
              `}
            >
              {description.length > MAX_DESCRIPTION_CHARACTERS
                ? description.slice(0, MAX_DESCRIPTION_CHARACTERS).concat('...')
                : description}
            </p>
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
    </Link>
  );
}
