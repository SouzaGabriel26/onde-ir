import { sanitizeClassName } from '@/utils/sanitizeClassName';
import type { ReactNode } from 'react';
import React from 'react';
import { Progress } from './ui/Progress';

type CustomBreadcrumbProps = {
  items: Array<{
    label: string;
    isCurrent: boolean;
    finished: boolean;
    icon: ReactNode;
  }>;
  progress: number;
};

export function CustomBreadcrumb({ items, progress }: CustomBreadcrumbProps) {
  const currentStepNumber = items.findIndex((item) => item.isCurrent) + 1;

  return (
    <nav className="space-y-2 p-6 pb-0 w-full">
      <div className="flex justify-between w-full items-center">
        <h2 className="font-semibold text-lg">Criar novo post</h2>
        <p className="text-muted-foreground text-sm">
          Passo {currentStepNumber} de {items.length}
        </p>
      </div>

      <Progress value={progress} />

      <ul className="flex gap-2 items-center justify-between">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <React.Fragment key={item.label.concat(`-${index}`)}>
              <li
                className={sanitizeClassName(
                  'flex items-center gap-2 text-xs tracking-wide',
                  (item.finished || item.isCurrent) && 'text-primary',
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={sanitizeClassName(
                      'rounded-full border-2 p-2 w-fit',
                      (item.finished || item.isCurrent) &&
                        'border-primary bg-primary/15',
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              </li>

              {!isLastItem && (
                <div
                  className={sanitizeClassName(
                    'h-px flex-1 w-full bg-border',
                    item.finished && 'bg-primary',
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
