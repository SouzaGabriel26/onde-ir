import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="w-full space-y-6 pb-2 h-full">
      <div className="w-full flex gap-2 items-center justify-center">
        <h1 className="text-3xl">Adicionar imagens ao local:</h1>
        <Skeleton className="h-7 w-32 mt-2" />
      </div>
    </div>
  );
}
