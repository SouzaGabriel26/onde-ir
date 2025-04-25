import { sanitizeClassName } from '@/utils/sanitizeClassName';
import Image from 'next/image';

type PlaceCardProps = {
  name: string;
  image: string;
  className?: string;
};

export function PlaceCard({ name, image, className }: PlaceCardProps) {
  return (
    <div
      className={sanitizeClassName(
        `
        min-h-[250px]
        group
        h-full
        overflow-hidden
        rounded-xl
        dark:bg-white/5
        backdrop-blur-sm
        border
        transition-all
        duration-300
        hover:shadow-lg
        `,
        className,
      )}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={image || '/assets/restaurant-04.jpg'}
          alt={name}
          fill
          sizes="100%"
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </div>
  );
}
