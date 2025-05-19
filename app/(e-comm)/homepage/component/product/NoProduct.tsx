'use client';
import React from 'react';

import { SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface NoDataProps {
  message?: string;
}

const NoProduct = ({ message = 'عذرًا، لم نعثر على ما تبحث عنه 🧐' }: NoDataProps) => {
  const router = useRouter();

  const handleExploreCollection = () => {
    router.push('/');
  };

  return (
    <div dir='rtl' className='flex min-h-[400px] flex-col items-center justify-center gap-6 p-6'>
      <Alert className='max-w-lg rounded-2xl border-0 bg-gradient-to-l from-secondary/20 to-background shadow-lg'>
        <div className='flex flex-col items-center gap-4 px-4 py-6 text-center'>
          <div className='rounded-full bg-primary/10 p-3'>
            <SearchX className='h-12 w-12 stroke-[1.5] text-primary/80' />
          </div>
          <AlertTitle className='text-2xl font-bold leading-snug text-foreground'>
            {message}
          </AlertTitle>
          <AlertDescription className='text-lg text-muted-foreground/90'>
            لا تقلق! يمكنك تعديل خيارات البحث أو اكتشاف تشكيلتنا الرائعة من المنتجات ✨
          </AlertDescription>
        </div>
      </Alert>

      <Button
        onClick={handleExploreCollection}
        size='lg'
        className='gap-2 rounded-xl px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-md'
      >
        <span>استكشف التشكيلة الآن</span>
        <span>🛍️</span>
      </Button>
    </div>
  );
};

export default React.memo(NoProduct);
