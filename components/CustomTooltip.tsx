import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import type { ReactNode } from 'react';

type CustomTooltipProps = {
  tip: string;
  children: ReactNode;
  disabled?: boolean;
};

export function CustomTooltip({
  tip,
  children,
  disabled = false,
}: CustomTooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">{children}</TooltipTrigger>
        <TooltipContent>
          <p>{tip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
