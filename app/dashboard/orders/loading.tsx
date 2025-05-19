import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <div className='flex min-h-screen flex-col p-6'>
      {/* Navigation Bar */}
      <header className='bg-gray-200 p-4'>
        <Skeleton className='h-6 w-1/4' />
      </header>

      {/* Main Content */}
      <main className='flex flex-col gap-4 p-4'>
        {/* Status Bar */}
        <div className='flex gap-4'>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className='h-10 w-32' />
          ))}
        </div>

        {/* Cards Section */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, index) => (
            <div key={index} className='rounded-lg border p-4 shadow-sm'>
              <Skeleton className='mb-2 h-6 w-1/2' />
              <Skeleton className='mb-2 h-4 w-3/4' />
              <Skeleton className='mb-4 h-4 w-1/2' />
              <Skeleton className='h-10 w-full' />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default loading;
