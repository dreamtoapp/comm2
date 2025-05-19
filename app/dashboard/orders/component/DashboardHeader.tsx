'use client';
import React from 'react';

import { CheckCircle, MousePointerBan, Package, Truck, X } from 'lucide-react';

import Link from '@/components/link';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardHeaderProps {
  initialFilter: string; // The currently selected filter (e.g., "All", "Pending", "Delivered")
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  inWayOrders: number;
  cancelOrders: number;
}

const DashboardHeader = React.memo(function DashboardHeader({
  initialFilter,
  totalOrders,
  pendingOrders,
  deliveredOrders,
  inWayOrders,
  cancelOrders,
}: DashboardHeaderProps) {


  const cardStyle = 'flex flex-col md:flex-row items-center justify-center gap-2 p-2';

  return (
    <div className='z-2 sticky top-0 flex w-full items-center justify-center bg-secondary p-4 shadow-md'>
      <div className='flex flex-col items-center justify-between gap-4'>
        {/* Analytics Section */}
        <div className='flex flex-wrap items-center justify-center gap-4'>
          {/* Total Orders */}
          <Link href='/dashboard'>
            <Card
              className={`w-fit cursor-pointer border border-input bg-background transition-all hover:scale-105 hover:shadow-md ${initialFilter === 'All' ? 'border-primary shadow-md' : ''}`}
            >
              <CardContent className={cardStyle}>
                <Package className='h-4 w-5 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>الطلبيات</p>
                <p className='text-lg font-semibold text-foreground'>{totalOrders}</p>
              </CardContent>
            </Card>
          </Link>

          {/* Pending Orders */}
          <Link href='?status=Pending'>
            <Card
              className={`w-fit cursor-pointer border border-input bg-background transition-all hover:scale-105 hover:shadow-md ${initialFilter === 'Pending' ? 'border-primary shadow-md' : ''}`}
            >
              <CardContent className={cardStyle}>
                <MousePointerBan className='h-4 w-5 text-primary' />
                <p className='text-sm text-primary'>قيد الانتظار</p>
                <p className='text-lg font-semibold text-foreground'>{pendingOrders}</p>
              </CardContent>
            </Card>
          </Link>

          {/* InWay Orders */}
          <Link href='?status=InWay'>
            <Card
              className={`w-fit cursor-pointer border border-input bg-background transition-all hover:scale-105 hover:shadow-md ${initialFilter === 'InWay' ? 'border-purple-500 shadow-md' : ''}`}
            >
              <CardContent className={cardStyle}>
                <Truck className='h-4 w-5 text-purple-500' />
                <p className='text-sm text-purple-500'>في الطريق</p>
                <p className='text-lg font-semibold text-purple-500'>{inWayOrders}</p>
              </CardContent>
            </Card>
          </Link>

          {/* Delivered Orders */}
          <Link href='?status=Delivered'>
            <Card
              className={`w-fit cursor-pointer border border-input bg-background transition-all hover:scale-105 hover:shadow-md ${initialFilter === 'Delivered' ? 'border-green-500 shadow-md' : ''}`}
            >
              <CardContent className={cardStyle}>
                <CheckCircle className='h-5 w-5 text-green-500' />
                <p className='text-sm text-green-500'>تم التسليم</p>
                <p className='text-lg font-semibold text-foreground'>{deliveredOrders}</p>
              </CardContent>
            </Card>
          </Link>

          {/* Cancelled Orders */}
          <Link href='?status=canceled'>
            <Card
              className={`w-fit cursor-pointer border border-input bg-background transition-all hover:scale-105 hover:shadow-md ${initialFilter === 'Cancelled' ? 'border-red-500 shadow-md' : ''}`}
            >
              <CardContent className={cardStyle}>
                <X className='h-4 w-5 text-red-500' />
                <p className='text-sm text-red-500'>ملغي</p>
                <p className='text-lg font-semibold text-foreground'>{cancelOrders}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default DashboardHeader;
