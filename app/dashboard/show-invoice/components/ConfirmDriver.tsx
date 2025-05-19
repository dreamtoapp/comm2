'use client';
import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import { Drivers } from './Drivers';
import { approveDriverToOrder } from '../actions/approveOrder-toDtiver';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface driverProp {
  orderNo: string;
  driverList?: {
    id: string;
    name: string;
  }[];
}

function ConfirmDriver({ orderNo, driverList }: driverProp) {
  const [selectedDriverId, setSelectedDriverId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDriverApproval = useCallback(async () => {
    if (!selectedDriverId) return;
    setIsLoading(true);

    try {
      const isDone = await approveDriverToOrder(orderNo, selectedDriverId);
      Swal.fire({
        icon: isDone.success ? 'success' : 'error',
        title: 'اسناد طلبية للسائق',
        text: isDone.message,
      });
      if (isDone.success) router.push('/dashboard');
    } catch (error) {
      console.error('Failed to assign driver:', error);
      // Add error toast/notification here
    } finally {
      setIsLoading(false);
    }
  }, [orderNo, selectedDriverId, router]);

  const memoizedDrivers = useMemo(
    () => (
      <Drivers
        drivers={driverList || []}
        selectedDriverId={selectedDriverId}
        setSelectedDriverId={setSelectedDriverId}
      />
    ),
    [driverList, selectedDriverId],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='destructive'
          className='flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow-md transition-all duration-200 hover:bg-red-700'
        >
          <div className='flex h-6 w-6 animate-bounce items-center justify-center rounded-full bg-green-500 text-xs font-semibold text-white shadow-md'>
            <Truck className='h-4 w-4' />
          </div>
          <span className='text-sm font-medium'>تحديد السائق</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-xl sm:max-w-md' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl font-bold'>شحن الطلبية للعميل</DialogTitle>
          <DialogDescription className='text-center text-gray-600 dark:text-gray-300'>
            طلبية رقم : {orderNo}
          </DialogDescription>
        </DialogHeader>

        <div className='flex w-full items-center justify-between'>{memoizedDrivers}</div>

        <Button variant='outline' disabled={isLoading} onClick={handleDriverApproval}>
          {isLoading ? 'جارٍ التاكيد...' : 'تاكيد العملية'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDriver;
