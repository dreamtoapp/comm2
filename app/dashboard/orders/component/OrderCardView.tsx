// components/OrderCardView.tsx
'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/types/cardType';

import { fetchOrdersAction } from '../../action/fetchOrders';
import OrderCard from './OrderCard';

// Memoize the OrderCard to prevent unnecessary re-renders
const MemoizedOrderCard = memo(OrderCard);

interface OrderCardViewProps {
  initialOrders: Order[];
  status?: string;
}

export default function OrderCardView({ initialOrders = [], status }: OrderCardViewProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(page);
  const initialOrdersRef = useRef(initialOrders);
  const pageSize = 10;

  // Optimize initial orders comparison
  useEffect(() => {
    if (initialOrdersRef.current.length !== initialOrders.length || status) {
      initialOrdersRef.current = initialOrders;
      setOrders(initialOrders);
      setPage(1);
      pageRef.current = 1;
      setHasMore(initialOrders.length >= pageSize);
    }
  }, [initialOrders, status, pageSize]);

  const fetchMoreData = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const newOrders = await fetchOrdersAction({
        status: status || '',
        page: pageRef.current + 1,
        pageSize,
      });

      setPage((prev) => {
        const newPage = prev + 1;
        pageRef.current = newPage;
        return newPage;
      });

      if (newOrders.length === 0) {
        setHasMore(false);
      } else {
        setOrders((prev) => {
          const existingIds = new Set(prev.map((order) => order.id));
          const filteredOrders = newOrders.filter((order) => !existingIds.has(order.id));
          return [...prev, ...filteredOrders];
        });
        setHasMore(newOrders.length >= pageSize);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('فشل في تحميل المزيد من الطلبات. يرجى المحاولة مرة أخرى.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, status, pageSize]);

  // Custom loader component with spinner
  const Loader = () => (
    <div className='flex items-center justify-center gap-2 p-4 text-center text-gray-500'>
      <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-gray-400'></div>
      جاري تحميل المزيد من الطلبات...
    </div>
  );

  // Skeleton loader for initial load
  if (!orders.length && isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className='h-[200px] w-full rounded-lg' />
        ))}
      </div>
    );
  }

  return (
    <div id='scroll-container' className='h-[70vh] overflow-auto p-4'>
      <InfiniteScroll
        dataLength={orders.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={
          <p className='p-4 text-center text-gray-500'>{error || 'لا توجد طلبات إضافية للتحميل'}</p>
        }
        scrollThreshold={0.8}
        scrollableTarget='scroll-container'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {orders.map((order) => (
            <MemoizedOrderCard key={order.id} order={order} />
          ))}
        </div>
      </InfiniteScroll>

      {error && (
        <div className='mt-4 text-center'>
          <button onClick={fetchMoreData} className='text-blue-500 hover:text-blue-700'>
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
}
