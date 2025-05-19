'use client';
import React, {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { authenticateDriver } from './actions/actions';

interface Driver {
  id: string;
  name: string;
  phone: string;
}

export default function DriverTrip() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  useEffect(() => {
    const savedDriver = localStorage.getItem('driver');
    if (savedDriver) {
      setDriver(JSON.parse(savedDriver));
    }
  }, []);

  useEffect(() => {
    if (driver) {
      router.push(`/driver/driver?driverId=${driver.id}&status=InWay&name=${driver.name}`);
    }
  }, [driver, router]);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await authenticateDriver(formData);

        if (result?.error) {
          setError(result.error);
          return;
        }

        if (result?.driver) {
          localStorage.setItem('driver', JSON.stringify(result.driver));
          setDriver(result.driver);
        }
      } catch {
        setError('حدث خطأ أثناء تسجيل الدخول');
      }
    });
  };

  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <Card className='w-full max-w-md space-y-6 p-8 text-right'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-bold'>تسجيل دخول </h1>
          <p className='text-muted-foreground'>الرجاء إدخال بيانات الاعتماد الخاصة بك</p>
        </div>

        <form action={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='phone'>رقم الجوال</Label>
            <Input
              id='phone'
              name='phone'
              type='tel'
              required
              placeholder='05XXXXXXXX'
              className='text-right'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>كلمة المرور</Label>
            <Input
              id='password'
              name='password'
              type='password'
              required
              placeholder='••••••••'
              className='text-right'
            />
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type='submit' className='w-full gap-2' disabled={isPending}>
            {isPending && <Loader2 className={iconVariants({ size: 'xs', animation: 'spin' })} />} {/* Use direct import + CVA */}
            {isPending ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
