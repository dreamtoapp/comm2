// components/LoadingSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className='container mx-auto bg-background px-4 text-foreground sm:px-6 lg:px-8'>
      {/* Offer Section Skeleton */}
      <div className='space-y-4'>
        <Skeleton className='mx-auto h-12 w-1/3 sm:w-1/4 lg:w-1/5' /> {/* Title */}
        <Skeleton className='h-48 w-full rounded-lg sm:h-64 lg:h-72' /> {/* Image */}
      </div>

      {/* Product Category Skeleton */}
      <div className='mt-8 space-y-4'>
        <div className='flex flex-wrap justify-center gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className='h-16 w-16 rounded-full sm:h-20 sm:w-20 lg:h-24 lg:w-24'
            />
          ))}
        </div>
      </div>

      {/* Product List Skeleton */}
      <div className='mt-8 space-y-4'>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className='space-y-4'>
              <Skeleton className='h-40 w-full rounded-lg sm:h-48 lg:h-56' />
              <div className='space-y-2 px-2'>
                <Skeleton className='mx-auto h-4 w-3/4' /> {/* Product Name */}
                <Skeleton className='mx-auto h-4 w-1/2' /> {/* Price */}
                <div className='mt-2 flex justify-center gap-2'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                </div>
                <Skeleton className='mx-auto h-4 w-1/2' /> {/* Total Price */}
              </div>
              <Skeleton className='mx-auto h-10 w-24 rounded-full' /> {/* Button */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
