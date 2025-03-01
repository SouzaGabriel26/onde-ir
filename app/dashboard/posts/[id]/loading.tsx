import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="w-full space-y-6 pb-2 h-full">
      <div className="w-full flex gap-2 items-center">
        <h2 className="text-3xl">Foto(s) de</h2>
        <Skeleton className="h-7 w-32 md:w-80 mt-1" />
      </div>

      <div className="px-4 gap-4 items-center md:items-baseline flex justify-center">
        <Skeleton className="h-[300px] w-[300px] md:h-[600px] md:w-[1300px] rounded-[20px]" />
      </div>

      <div className="md:w-fit md:mx-auto space-y-4">
        <h2 className="text-3xl md:text-center mb-2">Sobre o local:</h2>

        <div className="grid grid-cols-1 place-items-center md:grid-cols-3 gap-4">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
    </div>
  );
}
