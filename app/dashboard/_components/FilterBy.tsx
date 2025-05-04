'use client';

import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { Check, FilterIcon } from 'lucide-react';

export type FilterByOptionValues = 'rating' | 'comments' | 'recent';

type FilterByOption = {
  label: string;
  value: FilterByOptionValues;
};

const filterByOptions: Array<FilterByOption> = [
  {
    label: 'Melhor Avaliado',
    value: 'rating',
  },
  {
    label: 'Mais comentado',
    value: 'comments',
  },
  {
    label: 'Mais recente',
    value: 'recent',
  },
];

type FilterByProps = {
  onChange: (value: FilterByOptionValues) => void;
  selectedValue: FilterByOptionValues;
};

export function FilterBy({ onChange, selectedValue }: FilterByProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          Filtrar
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-44 p-1">
        <span className="py-2 px-4 text-sm border-b font-bold w-full flex">
          Filtrar por
        </span>

        <div className="flex flex-col w-full pt-2">
          {filterByOptions.map((option) => (
            <Button
              onClick={() => onChange(option.value)}
              key={option.value}
              variant="ghost"
              className="w-full cursor-default flex items-center justify-between"
            >
              {option.label}
              {selectedValue === option.value && <Check className="size-4" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
