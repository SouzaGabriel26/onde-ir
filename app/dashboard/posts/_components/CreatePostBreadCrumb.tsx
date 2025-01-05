'use client';

import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function CreatePostBreadCrumb() {
  const pathName = usePathname();

  const isCreatePostPage = pathName === '/dashboard/posts/create';

  const isCreatePostImagesPage =
    pathName.includes('/dashboard/posts') &&
    pathName.includes('/create/images');

  const isCreatePostResultPage =
    pathName.includes('/dashboard/posts') &&
    pathName.includes('/create/result');

  const progress = useMemo(() => {
    if (isCreatePostPage) {
      return 0;
    }

    if (isCreatePostImagesPage) {
      return 50;
    }

    if (isCreatePostResultPage) {
      return 100;
    }

    return 0;
  }, [isCreatePostPage, isCreatePostImagesPage, isCreatePostResultPage]);

  if (!isCreatePostPage && !isCreatePostImagesPage && !isCreatePostResultPage) {
    return null;
  }

  return (
    <CustomBreadcrumb
      progress={progress}
      items={[
        {
          label: 'Lugar',
          finished: isCreatePostImagesPage || isCreatePostResultPage,
          isCurrent: isCreatePostPage,
        },
        {
          label: 'Imagens',
          finished: isCreatePostResultPage,
          isCurrent: isCreatePostImagesPage,
        },
        {
          label: 'Resultado',
          finished: false,
          isCurrent: isCreatePostResultPage,
        },
      ]}
    />
  );
}
