'use client';
// app/dashboard/orders-management/status/pending/components/PendingOrdersView.tsx
import React, { useState } from 'react';

import { Search } from 'lucide-react';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Order } from '@/types/cardType';

import OrderTable from './OrderTable';

interface PendingOrdersViewProps {
  orders: Order[];
  pendingCount: number;
  currentPage: number;
  pageSize: number;
}

export default function PendingOrdersView({
  orders,
  pendingCount,
  currentPage,
  pageSize
}: PendingOrdersViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Accept sort and search params from parent (via URL)
  const search = searchParams.get('search') || '';
  const sortByParam = searchParams.get('sortBy') as 'createdAt' | 'amount' | 'orderNumber' || 'createdAt';
  const sortOrderParam = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'orderNumber'>(sortByParam);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(sortOrderParam);
  const [searchTerm, setSearchTerm] = useState(search);

  // Update URL with new sort/filter/search
  const updateQuery = (paramsObj: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchTerm, page: 1, sortBy, sortOrder });
  };

  // Handle sort
  const handleSort = (field: 'createdAt' | 'amount' | 'orderNumber') => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newOrder);
    updateQuery({ sortBy: field, sortOrder: newOrder, page: 1, search: searchTerm });
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="search"
            placeholder="بحث عن طلب (رقم الطلب أو اسم العميل)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="sm">
            <Search className="h-4 w-4 ml-2 rtl:mr-2" />
            بحث
          </Button>
        </form>
        <div className="flex gap-2">

          <Button variant={sortBy === 'createdAt' ? 'default' : 'outline'} size="sm" onClick={() => handleSort('createdAt')}>الأحدث</Button>
          <Button variant={sortBy === 'amount' ? 'default' : 'outline'} size="sm" onClick={() => handleSort('amount')}>المبلغ</Button>
          <Button variant={sortBy === 'orderNumber' ? 'default' : 'outline'} size="sm" onClick={() => handleSort('orderNumber')}>رقم الطلب</Button>
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={Math.ceil(pendingCount / pageSize) || 1}
        updatePage={(page) => updateQuery({ page, sortBy, sortOrder, search: searchTerm })}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
}
