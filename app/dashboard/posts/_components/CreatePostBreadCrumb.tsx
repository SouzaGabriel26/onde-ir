'use client';

import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { ImageIcon, MapPinIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function CreatePostBreadCrumb() {
  const pathName = usePathname();

  const isCreatePostPage = pathName === '/dashboard/posts/create';

  const isCreatePostImagesPage =
    pathName.includes('/dashboard/posts') &&
    pathName.includes('/create/images');

  const progress = useMemo(() => {
    if (isCreatePostPage) {
      return 10;
    }

    if (isCreatePostImagesPage) {
      return 100;
    }

    return 0;
  }, [isCreatePostPage, isCreatePostImagesPage]);

  if (!isCreatePostPage && !isCreatePostImagesPage) {
    return null;
  }

  return (
    <CustomBreadcrumb
      progress={progress}
      items={[
        {
          label: 'Lugar',
          finished: isCreatePostImagesPage,
          isCurrent: isCreatePostPage,
          icon: <MapPinIcon className="w-4 h-4" />,
        },
        {
          label: 'Imagens',
          finished: !isCreatePostImagesPage,
          isCurrent: isCreatePostImagesPage,
          icon: <ImageIcon className="w-4 h-4" />,
        },
      ]}
    />
  );
}
