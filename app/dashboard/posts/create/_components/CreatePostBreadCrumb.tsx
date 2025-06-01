import { CustomBreadcrumb } from '@/components/CustomBreadcrumb';
import { ImageIcon, MapPinIcon } from 'lucide-react';
import type { CREATE_POST_STEPS, CreatePostStepKeys } from './CreatePostForm';

type CreatePostBreadCrumbProps = {
  steps: typeof CREATE_POST_STEPS;
  currentStep: CreatePostStepKeys;
};

export function CreatePostBreadCrumb({
  currentStep,
  steps,
}: CreatePostBreadCrumbProps) {
  const progress = steps[currentStep];

  return (
    <CustomBreadcrumb
      progress={progress}
      items={[
        {
          label: 'Lugar',
          finished: currentStep !== 'place',
          isCurrent: currentStep === 'place',
          icon: <MapPinIcon className="w-4 h-4" />,
        },
        {
          label: 'Imagens',
          finished: currentStep === 'success',
          isCurrent: currentStep === 'images',
          icon: <ImageIcon className="w-4 h-4" />,
        },
      ]}
    />
  );
}
