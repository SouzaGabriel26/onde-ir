import { sanitizeClassName } from '@/src/utils/sanitizeClassName';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={sanitizeClassName(
        'animate-pulse rounded-md bg-primary/10',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
