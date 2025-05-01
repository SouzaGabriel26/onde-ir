'use client';

import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { FilterIcon } from 'lucide-react';

export function FilterBy() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          Filtrar
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-fit p-1">
        <span className="py-2 px-4 text-sm border-b font-bold">
          Filtrar por
        </span>

        <div className="flex flex-col w-full pt-2">
          <Button variant="ghost" className="w-full cursor-default">
            Categoria 1
          </Button>
          <Button variant="ghost" className="w-full cursor-default">
            Categoria 2
          </Button>
          <Button variant="ghost" className="w-full cursor-default">
            Categoria 3
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
