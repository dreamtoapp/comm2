'use client';
import {
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';
import { Calendar, RefreshCw, List, User, Phone, Car } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  startTrip,
  updateCoordinates,
} from '../action/startTrip';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  driverId: string | null;
  amount: number;
  shift: { name: string };
  createdAt: Date;
  updatedAt: Date;
  customer: {
    phone: string;
    name: string;
    latitude: string;
    longitude: string;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
  } | null;
}

export default function DriverOrderCard({ order }: { order: Order }) {
  const UPDATE_INTERVAL = 300;
  const [isTracking, setIsTracking] = useState(false);
  const [countdown, setCountdown] = useState(UPDATE_INTERVAL);
  const driverId = order.driver?.id;

  const handleStartTrip = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      if (!driverId) {
        toast.error('لا يوجد سائق لهذا الطلب');
        return;
      }

      const result = await startTrip(
        order.id,
        driverId,
        position.coords.latitude,
        position.coords.longitude,
      );

      if (result.success) {
        setIsTracking(true);
        setCountdown(UPDATE_INTERVAL);
        toast.success('تم بدء الرحلة بنجاح');
      } else {
        toast.error(result.error || 'فشل غير معروف');
      }
    } catch (error) {
      let errorMessage = 'فشل في الحصول على الموقع';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (!isTracking) return;

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                if (!driverId) {
                  toast.error('لا يوجد سائق لهذا الطلب');
                  return;
                }
                await updateCoordinates(
                  order.id,
                  driverId,
                  position.coords.latitude,
                  position.coords.longitude,
                );
                setCountdown(UPDATE_INTERVAL);
              } catch {
                toast.error('فشل تحديث الإحداثيات');
                setCountdown(UPDATE_INTERVAL);
              }
            },
            () => {
              toast.error('خطأ في الحصول على الموقع');
              setCountdown(UPDATE_INTERVAL);
            },
          );
          return UPDATE_INTERVAL;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTracking, order.id, driverId]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <Card className='bg-background shadow-sm'>
      <CardHeader className='space-y-3 p-4'>
        <div className='flex justify-between text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Calendar className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
            <span>
              {formatDistanceToNow(new Date(order.createdAt), {
                addSuffix: true,
                locale: ar,
              })}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <RefreshCw className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
            <span>
              {formatDistanceToNow(new Date(order.updatedAt), {
                addSuffix: true,
                locale: ar,
              })}
            </span>
          </div>
        </div>

        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <List className={iconVariants({ size: 'sm' })} /> {/* Use direct import + CVA */}
            <span>{order.orderNumber}</span>
          </div>
          <span className='text-lg font-semibold text-primary'>{order.amount.toFixed(2)} SAR</span>
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-2 p-4'>
        <div className='grid grid-cols-2 gap-2 text-sm'>
          <div className='flex items-center gap-2'>
            <User className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
            <span>{order.customer.name || 'عميل غير معروف'}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Phone className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
            <span>{order.customer.phone}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='p-4'>
        <Button className='w-full' onClick={handleStartTrip} disabled={isTracking}>
          <Car className={iconVariants({ size: 'xs', className: 'ml-2' })} /> {/* Use direct import + CVA */}
          {isTracking ? (
            <div className='flex w-full items-center'>
              <span>تتبع الرحلة</span>
              <span className='mt-1 text-xs text-muted-foreground'>
                التحديث التالي: {minutes}:{seconds < 10 ? '0' : ''}
                {seconds}
              </span>
            </div>
          ) : (
            'الانطلاق للعميل'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
