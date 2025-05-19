'use client';
import { Button } from '../../../../components/ui/button';
import { useRouter } from 'next/navigation';

function Shopping() {
  const router = useRouter();
  return (
    <div className='z-50 flex justify-center rounded-b-3xl bg-white p-4 shadow-lg'>
      <Button
        className='w-full max-w-md transform rounded-lg bg-blue-600 py-3 font-semibold text-white transition-transform duration-300 ease-out hover:scale-105 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'
        onClick={() => router.push('/')}
      >
        متابعة التسوق
      </Button>
    </div>
  );
}

export default Shopping;
