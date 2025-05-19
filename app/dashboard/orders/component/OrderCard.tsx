'use client';
import React, { useMemo } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  List,
  MapPin,
  MapPinX,
  MousePointerBan,
  Phone,
  ReceiptText,
  RefreshCw,
  Truck,
  User,
  X,
} from 'lucide-react';

import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import {
  Button,
  buttonVariants,
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ORDER_STATUS,
  OrderStatus,
} from '@/constant/order-status';
import { iconVariants } from '@/lib/utils';
import { Order } from '@/types/cardType';

import {
  STATUS_STYLES,
  STATUS_TRANSLATIONS,
} from '../helper/helper';

// Memoized StatusIcon
const StatusIcon = React.memo(({ status }: { status: OrderStatus }) => {
  const icons: Record<OrderStatus, React.ReactNode> = {
    [ORDER_STATUS.PENDING]: <MousePointerBan className={iconVariants({ size: 'xs', className: 'text-primary-foreground' })} />,
    [ORDER_STATUS.IN_TRANSIT]: <Truck className={iconVariants({ size: 'xs', className: 'text-primary-foreground' })} />,
    [ORDER_STATUS.DELIVERED]: <CheckCircle className={iconVariants({ size: 'xs', className: 'text-primary-foreground' })} />,
    [ORDER_STATUS.CANCELED]: <X className={iconVariants({ size: 'xs', className: 'text-primary-foreground' })} />,
  };
  return icons[status.toUpperCase() as OrderStatus] || <Truck className={iconVariants({ size: 'xs', className: 'text-gray-500' })} />;
});
StatusIcon.displayName = 'StatusIcon';

// Memoized OrderHeader
const OrderHeader = React.memo(({ order, statusStyle }: { order: Order, statusStyle: string }) => {
  const createdAt = useMemo(
    () => formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar }),
    [order.createdAt],
  );
  const updatedAt = useMemo(
    () => formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true, locale: ar }),
    [order.updatedAt],
  );

  return (
    <CardHeader className='flex flex-col'>
      <div className='flex items-center justify-between'>
        <Badge className={`flex items-center justify-center gap-2 ${statusStyle}`}>
          <StatusIcon status={order.status as OrderStatus} />
          {STATUS_TRANSLATIONS[order.status as OrderStatus] ||
            STATUS_TRANSLATIONS.Default}
        </Badge>
        <CardTitle className='text-lg font-bold text-red-500'>
          {order.amount.toFixed(2)} SAR
        </CardTitle>
      </div>
      <div className='flex flex-wrap items-center justify-between text-sm text-muted-foreground'>
        <div className='flex items-center gap-2'>
          <Calendar className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} />
          <p className='text-xs'>{createdAt}</p>
        </div>
        <div className='flex items-center gap-2'>
          <RefreshCw className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} />
          <p className='text-xs'>{updatedAt}</p>
        </div>
      </div>
    </CardHeader>
  );
});
OrderHeader.displayName = 'OrderHeader';

// Memoized CustomerCardAction
const CustomerCardAction = React.memo(
  ({
    phone,
    address,
    latitude,
    longitude,
  }: {
    phone: string;
    address: string;
    latitude: string;
    longitude: string;
  }) => (
    <div className='flex items-center gap-4 self-end'>
      <Button
        variant='secondary'
        size='icon'
        title={phone || 'غير موجود'}
        className='flex items-center gap-2 text-sm'
      >
        <Phone className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} />
      </Button>
      <Button
        variant='secondary'
        size='icon'
        title={address || ' الاحداثيات متوفرة ولكن العنوان غير متوفر'}
        className='relative flex items-center gap-2 text-sm'
        disabled={!latitude || !longitude}
      >
        {!address && latitude && longitude && (
          <div className='absolute -left-2 -top-2'>
            <AlertCircle className={iconVariants({ size: 'xs', className: 'text-destructive' })} />
          </div>
        )}
        {!latitude || !longitude ? (
          <MapPinX className={iconVariants({ size: 'xs', className: 'text-destructive' })} />
        ) : (
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <MapPin className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} />
          </a>
        )}
      </Button>
    </div>
  ),
);
CustomerCardAction.displayName = 'CustomerCardAction';

// Memoized OrderContent
const OrderContent = React.memo(({ order }: { order: Order }) => (
  <CardContent className='space-y-2 text-foreground'>
    <div className='flex w-full items-center justify-between'>
      <CardTitle className='flex items-center gap-2 text-sm'>
        <List className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} />
        {order.orderNumber}
      </CardTitle>
      <Link
        href={`/dashboard/show-invoice/${order.id}`}
        className={buttonVariants({
          variant: 'secondary',
          size: 'icon',
          className: 'flex items-center gap-2 text-sm',
        })}
      >
        <ReceiptText className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} />
      </Link>
    </div>

    <div className='flex w-full flex-wrap items-center justify-between'>
      <CardDescription className='flex items-center gap-2 text-sm'>
        <User className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} />
        {order.customer?.name || 'Unknown Customer'}
      </CardDescription>

      <CustomerCardAction
        phone={order.customer.phone}
        address={order?.customer?.address || ''}
        latitude={order.customer.latitude}
        longitude={order.customer.longitude}
      />
    </div>

    {order.driver?.name && (
      <CardTitle className='flex w-full items-center justify-end gap-2 text-xs'>
        <Truck className={iconVariants({ size: 'xs', className: 'flex items-center gap-2 text-sm' })} />
        {order.driver?.name || 'Unknown Driver'}
      </CardTitle>
    )}
    {order.status === ORDER_STATUS.CANCELED && (
      <div className='flex flex-wrap items-center gap-2 text-wrap rounded bg-red-50 p-2 text-sm'>
        <AlertCircle className={iconVariants({ size: 'sm' })} />
        {order.resonOfcancel || 'لايوجد سبب'}
      </div>
    )}
  </CardContent>
));
OrderContent.displayName = 'OrderContent';

// Memoized OrderFooter
const OrderFooter = React.memo(({ order }: { order: Order }) => (
  <CardFooter className='flex items-end gap-2'>
    <div className='flex w-full items-center justify-between gap-2'>
      {order.status === ORDER_STATUS.IN_TRANSIT &&
        (order.isTripStart ? (
          <Link
            href={`/dashboard/track/${order.id}`}
            className='flex w-full items-center justify-center gap-2 rounded-md bg-primary/80 p-2 text-white'
          >
            <MapPin className={iconVariants({ size: 'xs' })} />
            <p>تتبع الطلبية</p>
          </Link>
        ) : (
          <div className='flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 p-2 text-gray-600'>
            <MapPin className={iconVariants({ size: 'xs' })} />
            <p> لم تبدأ بعد</p>
          </div>
        ))}
      {order.status === ORDER_STATUS.PENDING && (
        <Link
          href={`/dashboard/show-invoice/${order.id}?status=ship`}
          prefetch={false}
          className='flex w-full items-center justify-center gap-2 rounded-md bg-primary p-2 text-white shadow-md hover:bg-yellow-600'
        >
          <Truck className={iconVariants({ size: 'xs' })} />
          <p>شحن الطلبية</p>
        </Link>
      )}
    </div>
  </CardFooter>
));
OrderFooter.displayName = 'OrderFooter';

// Main Component: OrderCard
const OrderCard = React.memo(({ order }: { order: Order }) => {
  const statusStyle = useMemo(
    () => STATUS_STYLES[order.status.toUpperCase() as OrderStatus] || STATUS_STYLES.DEFAULT,
    [order.status],
  );

  return (
    <Card className={`rounded-lg shadow-md ${statusStyle}`}>
      <OrderHeader order={order} statusStyle={statusStyle} />
      <OrderContent order={order} />
      <OrderFooter order={order} />
    </Card>
  );
});
OrderCard.displayName = 'OrderCard';

export default OrderCard;
