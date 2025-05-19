import React from 'react';
import { FileText, User, ShoppingCart, DollarSign } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import BackButton from '../../../../components/BackButton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';
import { getOrderByStatus } from '../action/actions';
import StartTrip from '../component/StartTrip';

async function page({
  searchParams,
}: {
  searchParams: Promise<{ driverId: string; status: string }>;
}) {
  const { driverId, status } = await searchParams;
  const orders = await getOrderByStatus(driverId, status);
  let title = '';
  if (status === 'InWay') {
    title = '    📦 قائمة التسليم ';
  }
  if (status === 'Delivered') {
    title = '    📦 تم التسليم ';
  }
  if (status === 'canceled') {
    title = '    📦 ملغي ';
  }

  return (
    <div className='flex min-h-screen flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-center font-bold'>
          {title}({orders?.ordersToShip?.length || 0})
        </h1>
        <BackButton />
      </div>

      {Array.isArray(orders?.ordersToShip) && orders.ordersToShip.length > 0 ? (
        orders.ordersToShip.map((order) => (
          <Card key={order.id} className='rounded-lg border border-gray-200 bg-white shadow-md'>
            <CardHeader className='rounded-t-lg bg-gray-200 p-4'>
              <CardTitle className='flex items-center gap-2 text-lg text-gray-700'>
                <FileText className={iconVariants({ size: 'sm', variant: 'muted', className: 'text-blue-500' })} /> {/* Use direct import + CVA (adjust size if needed) */}
                <span className='text-sm font-medium'>رقم الفاتورة: {order.orderNumber}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className='space-y-3 p-4'>
              <div className='flex items-center gap-3 text-gray-600'>
                <User className={iconVariants({ size: 'sm', variant: 'muted' })} /> {/* Use direct import + CVA (adjust size if needed) */}
                <span className='font-medium'>العميل: {order.customer.name}</span>
              </div>

              <div className='flex items-center gap-3 text-gray-600'>
                <ShoppingCart className={iconVariants({ size: 'sm', variant: 'muted', className: 'text-yellow-500' })} /> {/* Use direct import + CVA (adjust size if needed) */}

                <span className='font-medium'>حالة الطلب: {order.status}</span>
              </div>

              <div className='flex items-center gap-3 text-gray-600'>
                <DollarSign className={iconVariants({ size: 'sm', variant: 'muted', className: 'text-red-500' })} /> {/* Use direct import + CVA (adjust size if needed) */}
                <span className='font-medium'>
                  الإجمالي:{' '}
                  <span className='text-lg font-bold text-gray-800'>
                    {order.amount.toFixed(2)} SAR
                  </span>
                </span>
              </div>
            </CardContent>
            {status === 'InWay' && (
              <CardFooter className='flex items-center justify-center rounded-b-lg bg-gray-200 p-4'>
                <StartTrip
                  orderId={order.id}
                  driverId={driverId}
                  latitude={parseFloat(order.customer.latitude)}
                  longitude={parseFloat(order.customer.longitude)}
                  driverName={order?.driver?.name ?? ''}
                />
              </CardFooter>
            )}
          </Card>
        ))
      ) : (
        <p className='mt-10 text-center text-lg text-gray-500'>🚚 لا توجد طلبات للشحن</p>
      )}
    </div>
  );
}

export default page;
