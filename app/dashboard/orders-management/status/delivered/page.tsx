// app/dashboard/orders-management/status/delivered/page.tsx
import React from 'react';

import { Metadata } from 'next';

import { ORDER_STATUS } from '@/constant/order-status';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-delevired-order';
import DeliveredOrdersView from './components/DeliveredOrdersView';

export const metadata: Metadata = {
  title: 'الطلبات المسلمة | لوحة التحكم',
  description: 'إدارة الطلبات التي تم تسليمها بنجاح',
};

export default async function DeliveredOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string; dateRange?: string };
}) {
  // Get current page and page size from URL or use defaults
  const awaitedSearchParams = await searchParams;
  const currentPage = Number(awaitedSearchParams.page) || 1;
  const pageSize = Number(awaitedSearchParams.pageSize) || 10;
  const dateRange = (awaitedSearchParams.dateRange || 'all') as 'all' | 'today' | 'week' | 'month' | 'year';

  try {
    // Fetch data in parallel using server actions
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.DELIVERED,
        page: currentPage,
        pageSize,
        dateRange,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="font-cairo relative flex flex-col space-y-6 p-4" dir="rtl">
        <DeliveredOrdersView
          orders={orders.orders}
          deliveredCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
          dateRange={dateRange}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading delivered orders:', error);

    return (
      <div className="font-cairo relative flex flex-col space-y-6 p-4" dir="rtl">
        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">حدث خطأ أثناء تحميل الطلبات</h3>
          <p className="text-red-600">يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.</p>
        </div>
      </div>
    );
  }
}
