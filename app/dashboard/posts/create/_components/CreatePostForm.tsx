'use client';

import { useState } from 'react';
import { CreatePlaceForm, type CreatePlaceFormProps } from './CreatePlaceForm';
import CreatePlaceImagesForm from './CreatePlaceImagesForm';
import { CreatePostBreadCrumb } from './CreatePostBreadCrumb';
import SuccessFeedback from './SuccessFeedback';

export const CREATE_POST_STEPS = {
  place: 1,
  images: 50,
  success: 100,
};

export type CreatePostStepKeys = keyof typeof CREATE_POST_STEPS;

type CreatePostFormProps = {
  createPlaceProps: CreatePlaceFormProps;
};

export function CreatePostForm({ createPlaceProps }: CreatePostFormProps) {
  const [step, setStep] = useState<CreatePostStepKeys>('place');

  return (
    <div className="flex-1 space-y-4 p-6">
      <CreatePostBreadCrumb currentStep={step} steps={CREATE_POST_STEPS} />

      {step === 'place' && (
        <CreatePlaceForm
          {...createPlaceProps}
          onSave={() => {
            // TODO: inside "CreatePlaceForm", do not create the place. Only save the input values in a global state (zustand)
            setStep('images');
          }}
        />
      )}

      {step === 'images' && (
        <CreatePlaceImagesForm
          placeBeingCreated={{ name: 'Teste' }}
          onSave={() => {
            // TODO: create places and images, get the image id and store in a state in this file
            // this ID will be passed to "SuccessFeedback" component
            setStep('success');
          }}
        />
      )}

      {step === 'success' && <SuccessFeedback placeId="" />}
    </div>
  );
}

// TODO: when use this component, make a cleanup on the following files/pages:
// - dashboard/posts/[id]/create/images
// - dashboard/posts/[id]/create/images
// - dashboard/posts/create/_components/actions
