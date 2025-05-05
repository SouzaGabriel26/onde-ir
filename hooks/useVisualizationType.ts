import { constants } from '@/utils/constants';
import { useState } from 'react';

type VisualizationType = 'grid' | 'list';

export function useVisualizationType() {
  const [visualizationType, setVisualizationType] = useState<VisualizationType>(
    () => {
      const view = localStorage.getItem(constants.dashboardItemsViewKey);

      if (!view || !['grid', 'list'].includes(view)) {
        return 'view' as VisualizationType;
      }

      return view as VisualizationType;
    },
  );

  function handleChangeVisualizationType(type: VisualizationType) {
    setVisualizationType(type);
    localStorage.setItem(constants.dashboardItemsViewKey, type);
  }

  return {
    visualizationType,
    handleChangeVisualizationType,
  };
}
