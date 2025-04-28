'use client';

import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { motion } from 'framer-motion';
import Image from 'next/image';

type PlaceCardProps = {
  name: string;
  image: string;
  index: number;
  className?: string;
};

export function PlaceCard({ name, image, index, className }: PlaceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.4, ease: 'easeOut' }}
      className={sanitizeClassName(
        `
        min-h-[250px]
        group
        h-full
        overflow-hidden
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
    </motion.div>
  );
}
