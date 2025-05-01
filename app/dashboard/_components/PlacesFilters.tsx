'use client';

import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import type { Category } from '@/data/place';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

type PlacesFiltersProps = {
  categories: Category[];
};

export function PlacesFilters({ categories }: PlacesFiltersProps) {
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('type');

  const [hoveredTab, setHoveredTab] = useState<string>(currentFilter ?? 'all');

  const [first, second, ...rest] = categories;
  const firstTwoCatgories = [first, second];

  const hiddenCategoryNames = rest.map(({ name }) => name);

  return (
    <nav className="flex justify-arro h-9">
      <ul className="flex bg-muted p-1 rounded-lg justify-around items-center text-md">
        <motion.li
          onHoverStart={() => setHoveredTab('all')}
          onHoverEnd={() => setHoveredTab(currentFilter ?? 'all')}
          className="cursor-pointer relative m-2"
        >
          <Link
            href="/dashboard"
            as="/dashboard"
            className=" rounded-[calc(var(--radius)-2px)]"
          >
            Todos
          </Link>

          {hoveredTab === 'all' && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
              transition={{ duration: 0.4 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            />
          )}
        </motion.li>

        {firstTwoCatgories.map(({ id, name }) => (
          <motion.li
            key={id}
            onHoverStart={() => setHoveredTab(name)}
            onHoverEnd={() => setHoveredTab(currentFilter ?? 'all')}
            className="cursor-pointer relative m-2"
          >
            <Link
              href={{
                href: '/dashboard/',
                query: {
                  type: name,
                },
              }}
              className="capitalize rounded-[calc(var(--radius)-2px)]"
            >
              {name}
            </Link>

            {hoveredTab === name && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
              />
            )}
          </motion.li>
        ))}

        <li>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-md px-2">
                <motion.span
                  onHoverStart={() => setHoveredTab('see-more')}
                  onHoverEnd={() => setHoveredTab(currentFilter ?? 'all')}
                  className="cursor-pointer relative text-md"
                >
                  Ver mais
                  {(hoveredTab === 'see-more' ||
                    hiddenCategoryNames.includes(currentFilter!)) && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 bg-primary h-[2px]"
                      transition={{ duration: 0.4 }}
                      exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    />
                  )}
                </motion.span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-56 p-2">
              <ul className="flex flex-col gap-2">
                {rest.map(({ id, name }) => (
                  <motion.li
                    onHoverStart={() => setHoveredTab('see-more')}
                    onHoverEnd={() => setHoveredTab(currentFilter ?? 'all')}
                    key={id}
                    className="cursor-pointer hover:bg-muted rounded-lg"
                  >
                    <Link
                      href={{
                        href: '/dashboard/',
                        query: {
                          type: name,
                        },
                      }}
                      className={
                        'capitalize flex items-center justify-between p-2 rounded-[calc(var(--radius)-2px)]'
                      }
                    >
                      {name}

                      {currentFilter === name && (
                        <CheckIcon className="size-4" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </li>
      </ul>
    </nav>
  );
}
