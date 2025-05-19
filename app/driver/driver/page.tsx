import React from 'react';

import { RocketIcon } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import DriverHeader from '../components/DriverHeader';
import {
  getActiveTrip,
  getOrderCount,
} from './action/actions';
import ActiveTrip from './component/ActiveTrip';

const NoActiveOrder = () => (
  <Card className='mx-auto mt-8 w-full max-w-md'>
    <CardHeader className='text-center'>
      <RocketIcon className='mx-auto h-12 w-12 text-primary' />
      <CardTitle>لا يوجد رحلة نشطة</CardTitle>
      <CardDescription>سيتم عرض تفاصيل الرحلة هنا عندما تصبح متاحة</CardDescription>
    </CardHeader>
  </Card>
);

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ driverId: string; status: string; name: string }>;
}) {
  try {
    const { driverId, name } = await searchParams;

    // Parallel data fetching for better performance
    const [activeTrip, orderCount] = await Promise.all([
      getActiveTrip(driverId),
      getOrderCount(driverId),
    ]);

    const totalCount =
      (orderCount.counts?.inWay || 0) +
      (orderCount.counts?.canceled || 0) +
      (orderCount.counts?.delivered || 0);

    return (
      <div className='flex min-h-screen w-full flex-col items-center justify-center'>
        <DriverHeader
          orderCount={totalCount}
          drivername={name}
          inWayOrders={orderCount.counts?.inWay || 0}
          canceledOrders={orderCount.counts?.canceled || 0}
          deliveredOrders={orderCount.counts?.delivered || 0}
          driverId={driverId}
        />

        {activeTrip ? <ActiveTrip order={activeTrip} /> : <NoActiveOrder />}
      </div>
    );
  } catch {
    return (
      <Alert variant='destructive'>
        <AlertTitle>حدث خطأ</AlertTitle>
        <AlertDescription>فشل في تحميل البيانات، يرجى التحقق من الاتصال بالإنترنت</AlertDescription>
      </Alert>
    );
  }
}

// Add loading state skeleton

export default Page;
