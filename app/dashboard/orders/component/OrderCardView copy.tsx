// components/OrderCardView.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { Order } from '@/types/cardType';

import { fetchOrdersAction } from '../../action/fetchOrders';
import OrderCard from './OrderCard';

interface OrderCardViewProps {
  initialOrders: Order[];
  status?: string;
}

export default function OrderCardView({ initialOrders = [], status }: OrderCardViewProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const initialOrdersRef = useRef(initialOrders);
  const pageSize = 10;

  useEffect(() => {
    if (JSON.stringify(initialOrdersRef.current) !== JSON.stringify(initialOrders)) {
      initialOrdersRef.current = initialOrders;
      setOrders(initialOrders);
      setPage(1);
      setHasMore(initialOrders.length >= pageSize);
    }
  }, [initialOrders, status]);

  const fetchMoreData = async () => {
    try {
      const newOrders = await fetchOrdersAction({
        status: status,
        page: page + 1,
        pageSize,
      });

      if (newOrders.length === 0) {
        setHasMore(false);
      } else {
        setOrders((prev) => [...prev, ...newOrders]);
        setPage((prev) => prev + 1);
        setHasMore(newOrders.length >= pageSize);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setHasMore(false);
    }
  };

  return (
    <div id='scroll-container' className='h-[70vh] overflow-auto'>
      <InfiniteScroll
        dataLength={orders.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div className='p-4 text-center text-gray-500'>Loading more orders...</div>}
        endMessage={<p className='p-4 text-center text-gray-500'>No more orders to load</p>}
        scrollThreshold={0.95}
        scrollableTarget='scroll-container'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
