'use client';
// app/dashboard/orders-management/status/delivered/components/DeliveredOrdersView.tsx
import React, { useState } from 'react';

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Order } from '@/types/cardType';

interface DeliveredOrdersViewProps {
  orders: Order[];
  deliveredCount: number;
  currentPage: number;
  pageSize: number;
  dateRange: string;
}

export default function DeliveredOrdersView({
  orders,
  deliveredCount,
  currentPage,
  pageSize,
  dateRange
}: DeliveredOrdersViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);

  // Calculate total pages
  const totalPages = Math.ceil(deliveredCount / pageSize) || 1;

  // Update URL with new page number and filters
  const updateFilters = (page: number, newDateRange?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    if (newDateRange) {
      params.set('dateRange', newDateRange);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value);
    updateFilters(1, value);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilters(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: ar });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">الطلبات المسلمة</h2>
          <p className="text-muted-foreground">
            عرض وتحليل الطلبات التي تم تسليمها بنجاح
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-2 p-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <span className="text-sm font-medium text-green-700">تم التسليم:</span>
                <span className="mr-1 font-bold text-green-900">{deliveredCount}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex rounded-md border border-input">
            {/* Removed the view mode toggle buttons (list/stats) as requested */}
          </div>


        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="search"
            placeholder="بحث عن طلب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="sm">
            <Search className="h-4 w-4 ml-2 rtl:mr-2" />
            بحث
          </Button>
        </form>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">الفترة الزمنية:</span>
          <Select value={selectedDateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفترات</SelectItem>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders View (List or Stats) */}
      {orders.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">تاريخ التسليم</TableHead>
                  <TableHead className="text-right">السائق</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-secondary">
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/show-invoice/${order.id}`} className="text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customer?.name || 'غير معروف'}</TableCell>
                    <TableCell className="font-semibold">{order.amount} ر.س</TableCell>
                    <TableCell>{order.deliveredAt ? formatDate(String(order.deliveredAt)) : '-'}</TableCell>
                    <TableCell>{order.driver?.name || 'غير معروف'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/show-invoice/${order.id}`}
                          className={cn(
                            "inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors",
                            "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                          title="عرض التفاصيل"
                        >
                          <Search className="h-4 w-4" />
                        </Link>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-center p-4">
            {renderPagination()}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <CheckCircle className="h-16 w-16 text-green-400" />
            <h3 className="mt-4 text-lg font-medium">لا توجد طلبات مسلمة</h3>
            <p className="text-sm text-gray-500">
              لا توجد طلبات تم تسليمها في الفترة المحددة
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
