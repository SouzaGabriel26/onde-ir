'use client';

import { type ChangeEvent, type JSX, useState } from 'react';
import { Input } from './ui/Input';

type DebouncedInputProps = JSX.IntrinsicElements['input'] & {
  onDebounce: (value: string) => Promise<void>;
};

export function DebouncedInput({ onDebounce, ...props }: DebouncedInputProps) {
  const [value, setValue] = useState('');

  let debounceTimeout: ReturnType<typeof setTimeout>;

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setValue(value);

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      await onDebounce(value);
    }, 500);
  }

  return (
    <Input
      parentClassName="w-64 md:w-[300px]"
      value={value}
      onChange={handleInputChange}
      {...props}
    />
  );
}
