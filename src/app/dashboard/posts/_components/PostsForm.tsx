import { sanitizeClassName } from '@/src/utils/sanitizeClassName';

import { ImageUpload } from './Dropzone';

type PostsFormProps = JSX.IntrinsicElements['form'];

export function PostsForm({ className, ...props }: PostsFormProps) {
  return (
    <form
      className={sanitizeClassName('h-full space-y-8', className)}
      {...props}
    >
      <ImageUpload />
    </form>
  );
}
