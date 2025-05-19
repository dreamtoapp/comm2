// app/dashboard/orders-management/status/canceled/page.tsx
import React from 'react';

import { Metadata } from 'next';

import { ORDER_STATUS } from '@/constant/order-status';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-canceld-order';
import CanceledOrdersView from './components/CanceledOrdersView';

export const metadata: Metadata = {
  title: 'الطلبات الملغية | لوحة التحكم',
  description: 'إدارة الطلبات التي تم إلغاؤها',
};

export default async function CanceledOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; reason?: string }>;
}) {
  // Get current page and page size from URL or use defaults
  const searchParamsData = await searchParams;
  const pageValue = searchParamsData.page;
  const pageSizeValue = searchParamsData.pageSize;
  const pageSize = pageSizeValue ? Number(pageSizeValue) : 10;
  const reasonValue = searchParamsData.reason;

  const currentPage: number = Number(pageValue ?? "1") || 1;
  const pageSizeVal: number = Number(pageSizeValue ?? "10") || 10;
  const reasonFilter = reasonValue || "";

  try {
    // Fetch data in parallel using server actions
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.CANCELED,
        page: currentPage,
        pageSize: pageSizeVal,
        reason: reasonFilter,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="font-cairo relative flex flex-col space-y-6 p-4" dir="rtl">
        <CanceledOrdersView
          orders={orders.orders}
          canceledCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
          reasonFilter={reasonFilter}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading canceled orders:', error);

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
