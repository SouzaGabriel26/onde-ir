'use client';

import { Button } from '@/components/ui/Button';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { Grid3X3, List } from 'lucide-react';

type ChangeVisualizationTypeProps = {
  visualizationType: 'grid' | 'list';
  onChangeVisualizationType: (type: 'grid' | 'list') => void;
};

export function ChangeVisualizationType({
  visualizationType,
  onChangeVisualizationType,
}: ChangeVisualizationTypeProps) {
  return (
    <div className="flex items-center">
      <Button
        title="Grid"
        type="button"
        variant="outline"
        onClick={() => onChangeVisualizationType('grid')}
        className={sanitizeClassName(
          'p-2 rounded-r-none size-8',
          visualizationType === 'grid' ? 'bg-accent' : '',
        )}
      >
        <Grid3X3 className="size-4" />
      </Button>
      <Button
        title="List"
        type="button"
        variant="outline"
        onClick={() => onChangeVisualizationType('list')}
        className={sanitizeClassName(
          'p-2 rounded-l-none size-8',
          visualizationType === 'list' ? 'bg-accent' : '',
        )}
      >
        <List className="size-4" />
      </Button>
    </div>
  );
}
