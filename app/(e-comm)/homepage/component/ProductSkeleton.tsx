import { memo } from 'react';

// Optimized skeleton item component
const SkeletonItem = memo(() => (
  <div
    className='relative flex animate-pulse flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md'
    style={{
      contain: 'content',
      containIntrinsicSize: '500px',
      height: '500px',
    }}
  >
    {/* Wishlist button placeholder */}
    <div className='absolute left-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80'></div>

    {/* Image section - fixed height */}
    <div className='h-48 w-full rounded-t-2xl bg-muted'></div>

    {/* Content section - flex-grow to fill space */}
    <div className='flex flex-1 flex-col p-4 text-center'>
      {/* Title */}
      <div className='mx-auto mb-1 h-5 w-3/4 rounded bg-muted'></div>

      {/* Details */}
      <div className='mx-auto mb-2 mt-2 h-10 w-1/2 rounded bg-muted'></div>

      {/* Rating stars placeholder */}
      <div className='mb-3 flex items-center justify-center gap-1'>
        <div className='flex gap-1'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='h-3.5 w-3.5 rounded bg-muted'></div>
          ))}
        </div>
        <div className='ml-1 h-3 w-16 rounded bg-muted'></div>
      </div>

      {/* Spacer */}
      <div className='min-h-[10px] flex-grow'></div>

      {/* Price section */}
      <div className='mb-2 mt-3 flex items-center justify-between'>
        <div className='h-5 w-1/3 rounded bg-muted'></div>
        <div className='h-5 w-1/3 rounded bg-muted'></div>
      </div>

      {/* Quantity controls */}
      <div className='mt-2 flex justify-center gap-2'>
        <div className='h-8 w-8 rounded-full bg-muted'></div>
        <div className='h-8 w-8 rounded bg-muted'></div>
        <div className='h-8 w-8 rounded-full bg-muted'></div>
      </div>
    </div>

    {/* Footer section - fixed height */}
    <div className='flex h-[80px] justify-center p-4'>
      <div className='h-10 w-32 rounded-full bg-muted'></div>
    </div>
  </div>
));

// Main skeleton component with performance optimizations
const ProductSkeleton = ({ count }: { count: number }) => (
  <div
    className='grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    style={{
      contentVisibility: 'auto',
      containIntrinsicSize: '350px',
    }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonItem key={index} />
    ))}
  </div>
);

export default memo(ProductSkeleton);

SkeletonItem.displayName = 'SkeletonItem';