import { Button } from '@nextui-org/react';
import Image from 'next/image';

import { sanitizeClassName } from '../utils/sanitizeClassName';

type AvatarProps = {
  imageUrl?: string;
  name: string;
  className?: string;
};

export function Avatar({ name, imageUrl, className }: AvatarProps) {
  const nameArray = name.split(' ');

  const nameInitials =
    nameArray.length > 1
      ? nameArray[0].charAt(0) + nameArray[1].charAt(0)
      : nameArray[0].slice(0, 2).toUpperCase();

  return (
    <Button
      title={name}
      className={sanitizeClassName(
        `
          flex
          h-12
          w-12
          items-center
          rounded-full
          border
          border-primary
          font-semibold
          uppercase
        `,
        className,
      )}
    >
      {imageUrl ? (
        <Image
          className="object-cover"
          src={imageUrl}
          alt={name}
          priority
          fill
          sizes="100%"
        />
      ) : (
        <span className="text-primary">{nameInitials}</span>
      )}
    </Button>
  );
}
