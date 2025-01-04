import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="w-full space-y-6 pb-2 h-full">
      <div className="w-full flex gap-2 items-center">
        <h2 className="text-3xl">Foto(s) de</h2>
        <Skeleton className="h-7 w-32 md:w-80 mt-1" />
      </div>

      <div className="flex flex-col md:flex-row px-4 gap-4 items-center md:items-baseline">
        <Skeleton className="h-44 w-64 md:h-64 md:w-96 rounded-[20px]" />
        <Skeleton className="h-44 w-64 md:h-64 md:w-96 rounded-[20px]" />
      </div>

      <div className="md:w-fit md:mx-auto space-y-4">
        <h2 className="text-3xl md:text-center mb-2">Sobre o local:</h2>
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-52" />
      </div>
    </div>
  );
}
