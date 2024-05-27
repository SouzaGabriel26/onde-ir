import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function sanitizeClassName(...inputs: ClassValue[]) {
  const builtClassName = buildClassNameWithConditionals(inputs);
  const sanitizedClassName = removeDuplicateClassNames(builtClassName);
  return sanitizedClassName;

  function buildClassNameWithConditionals(classNames: ClassValue[]) {
    return clsx(inputs);
  }

  function removeDuplicateClassNames(duplicateClassNames: string) {
    return twMerge(duplicateClassNames);
  }
}
