// app/dashboard/orders-management/status/pending/page.tsx
import React from 'react';

import { Clock } from 'lucide-react';

import { ORDER_STATUS } from '@/constant/order-status';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-pendeing-order';
import PendingOrdersView from './components/PendingOrdersView';

export default async function PendingOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  // Get current page and page size from URL or use defaults
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const search = params.search || '';
  // Ensure sortBy is a valid value for the backend type
  const allowedSortFields = ['createdAt', 'orderNumber', 'amount'] as const;
  const sortBy = allowedSortFields.includes(params.sortBy as any)
    ? (params.sortBy as typeof allowedSortFields[number])
    : 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

  try {
    // Fetch data in parallel using server actions
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.PENDING,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
        search,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="font-cairo relative flex flex-col space-y-6 p-4 bg-background min-h-screen" dir="rtl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-primary">الطلبات قيد الانتظار</h2>
            <p className="text-muted-foreground">إدارة الطلبات التي تنتظر الموافقة والمعالجة</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="rounded-lg bg-[hsl(var(--chart-1)/0.15)] border border-[hsl(var(--chart-1)/0.25)] px-4 py-2 text-[hsl(var(--chart-1))] font-semibold text-sm shadow-sm">
              قيد الانتظار: <span className="font-bold text-[hsl(var(--chart-1))]">{analytics}</span>
            </span>
          </div>
        </div>
        <PendingOrdersView
          orders={orders.orders}
          pendingCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading pending orders:', error);

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
