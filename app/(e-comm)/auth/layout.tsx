// app/(auth)/layout.tsx
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative min-h-screen bg-white p-4'>
      {/* Subtle Grid Background */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        <div className='h-full w-full bg-[radial-gradient(ellipse_at_center,#f0f0f0_1%,transparent_50%)]' />
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]' />
      </div>

      {/* Centered Content Container */}
      <div className='relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8 rounded-lg border border-gray-100 bg-white p-6 shadow-xl'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
