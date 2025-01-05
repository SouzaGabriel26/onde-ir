import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { Progress } from './ui/Progress';

type CustomBreadcrumbProps = {
  items: Array<{
    label: string;
    isCurrent: boolean;
    finished: boolean;
  }>;
  progress: number;
};

export function CustomBreadcrumb({ items, progress }: CustomBreadcrumbProps) {
  return (
    <nav className="space-y-2">
      <ul className="flex gap-2 items-center">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <li
              key={item.label.concat(`-${index}`)}
              className={sanitizeClassName(
                'flex items-center gap-2',
                item.finished && 'text-green-500',
                item.isCurrent && 'font-bold',
              )}
            >
              {item.label}
              {!isLastItem && <BreadcrumbSeparator />}
            </li>
          );
        })}
      </ul>
      <Progress value={progress} />
    </nav>
  );
}

type BreadcrumbProps = React.ComponentPropsWithoutRef<'li'>;

function BreadcrumbSeparator({
  className,
  children,
  ...props
}: BreadcrumbProps) {
  return (
    <span
      className={sanitizeClassName('[&>svg]:w-3.5 [&>svg]:h-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </span>
  );
}
