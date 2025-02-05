'use client';

import type { Category } from '@/data/place';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type PlacesFiltersProps = {
  categories: Category[];
};

export function PlacesFilters({ categories }: PlacesFiltersProps) {
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('type');

  return (
    <nav className="flex justify-center">
      <ul className="flex gap-4">
        <li className="cursor-pointer">
          <Link
            href="/dashboard"
            as="/dashboard"
            className={sanitizeClassName(
              !currentFilter ? 'border-b-2 border-primary' : '',
            )}
          >
            Todos
          </Link>
        </li>
        {categories.map(({ id, name }) => (
          <li key={id} className="cursor-pointer">
            <Link
              href={{
                href: '/dashboard/',
                query: {
                  type: name,
                },
              }}
              className={sanitizeClassName(
                'capitalize',
                currentFilter === name ? 'border-b-2 border-primary' : '',
              )}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
