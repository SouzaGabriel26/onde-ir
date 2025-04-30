'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedComponent } from '../AnimatedComponent';
import { Button } from '../ui/Button';

const categories = [
  {
    name: 'Bares',
    image: '/assets/bar.jpg',
  },
  {
    name: 'Restaurantes',
    image: '/assets/photo-restaurant-05.jpg',
  },
  {
    name: 'Praias',
    image: '/assets/beach.jpg',
  },
  {
    name: 'Pontos turísticos',
    image: '/assets/tourist.jpg',
  },
];

export function CategoriesSection() {
  return (
    <section className="flex flex-col gap-8 px-4 pb-2">
      <div className="flex justify-between">
        <AnimatedComponent
          variant="h3"
          className="text-3xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, delay: 0.2 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          Categorias
        </AnimatedComponent>

        <Link href="/dashboard">
          <Button asChild variant="ghost">
            <AnimatedComponent
              className="flex items-center justify-center gap-1"
              variant="button"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              Ver todas
              <ChevronRight className="size-4" />
            </AnimatedComponent>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: index * 0.3 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="relative w-full h-32 overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="100%"
                className="w-full h-full object-cover rounded-lg absolute"
              />

              <div className="absolute inset-0 bg-black opacity-65 rounded-lg" />
              <h3 className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                {category.name}
              </h3>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
