import Image from 'next/image';
import Link from 'next/link';

import { sanitizeClassName } from '@/utils/sanitizeClassName';

type ImageCardProps = {
  src: string;
  alt: string;
  title: string;
  description: string;
  variant?: 'md' | 'lg';
  className?: string;
};

export function ImageCard({
  className,
  alt,
  title,
  description,
  variant = 'lg',
  src,
}: ImageCardProps) {
  return (
    <Link
      title={title}
      href="#"
      className={sanitizeClassName('rounded-[20px] shadow', className)}
    >
      <div className="rounded-[20px] border border-[#DCE2E5] transition hover:scale-105 hover:shadow-2xl">
        <div
          className={sanitizeClassName(
            'relative',
            variant === 'md' ? 'h-44 w-64' : 'h-52 w-72',
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
            text-xl
            font-semibold
            leading-5
            text-[#123952]
          `}
          >
            {title}
          </h3>
          <p className="text-paragraph leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
