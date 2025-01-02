'use client';

import { Check, ChevronDown } from 'lucide-react';
import { type JSX, useCallback, useMemo, useState } from 'react';

import { sanitizeClassName } from '@/utils/sanitizeClassName';

import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';

export type Option = {
  label: string;
  value: string | number;
};

type CustomSelectProps = Omit<JSX.IntrinsicElements['button'], 'name'> & {
  options: Array<Option>;
  defaultOption?: Option['value'];
  name: JSX.IntrinsicElements['input']['name'];
  label: string;
  actionOnSelect?: (value: string | number) => Promise<void>;
  required?: boolean;
  searchable?: boolean;
};

export function CustomSelect({
  options,
  name,
  className,
  defaultOption,
  label,
  searchable = false,
  required = false,
  actionOnSelect,
  ...props
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number>(
    defaultOption ?? '',
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label
        .toLocaleLowerCase()
        .includes(searchTerm.trim().toLocaleLowerCase()),
    );
  }, [options, searchTerm]);

  const handleSelect = useCallback(
    (value: string | number) => {
      setSelectedValue((prevState) => (prevState === value ? '' : value));
      setOpen(false);
      setSearchTerm('');

      actionOnSelect?.(value);
    },
    [actionOnSelect],
  );

  const title = selectedValue
    ? options.find((option) => option.value === selectedValue)?.label
    : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          title={title}
          className={sanitizeClassName(
            'relative flex w-full min-w-40 justify-between border',
            className,
          )}
          {...props}
        >
          {selectedValue ? (
            options.find((option) => option.value === selectedValue)?.label
          ) : (
            <span className="text-muted-foreground">{label}</span>
          )}

          <ChevronDown className="absolute right-4 size-4" />
          <input
            name={name}
            tabIndex={-1}
            required={required}
            value={selectedValue}
            onChange={() => ({})} // remove warning & mantain required property
            className="pointer-events-none opacity-0"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-popover w-popover space-y-2">
        <Input
          placeholder="🔎  Pesquisar..."
          className={sanitizeClassName(
            `
              h-7
              w-full
              rounded
              border
              px-2
              text-sm
              outline-none
            `,
            !searchable && 'hidden',
          )}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="scrollbar max-h-52 space-y-2 overflow-y-auto">
          {filteredOptions.map((option) => (
            <li key={option.value} title={option.label}>
              <button
                role="option"
                aria-selected={selectedValue === option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  flex
                  h-7
                  w-full
                  items-center
                  justify-between
                  overflow-hidden
                  text-nowrap
                  rounded
                  px-2
                  py-1
                  text-start
                  outline-none
                  transition-colors
                  hover:bg-muted
                  focus:border
                  focus:bg-muted
                  aria-selected:bg-muted
                `}
              >
                {option.label}
                {option.value && selectedValue === option.value && (
                  <Check className="size-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
