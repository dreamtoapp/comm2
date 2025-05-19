'use client';
// app/dashboard/orders-management/components/OrderStatusTabs.tsx
import React from 'react';
import Link from '@/components/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
// Order status constants to match database values
const ORDER_STATUS = {
  PENDING: 'PENDING',
  IN_WAY: 'IN_WAY',
  DELIVERED: 'Delivered',
  CANCELED: 'CANCELED'
};

interface OrderStatusTab {
  label: string;
  value: string | undefined;
  icon: React.ElementType;
  color: string;
  activeColor: string;
  hoverColor: string;
}

interface OrderStatusTabsProps {
  activeStatus?: string;
}

export default function OrderStatusTabs({ activeStatus }: OrderStatusTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Create a new URLSearchParams object to modify
  const createQueryString = (status: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page to 1 when changing status filter
    params.set('page', '1');
    
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    
    return params.toString();
  };
  
  const tabs: OrderStatusTab[] = [
    {
      label: 'جميع الطلبات',
      value: undefined,
      icon: Package,
      color: 'text-gray-600',
      activeColor: 'bg-gray-100 text-gray-900',
      hoverColor: 'hover:bg-gray-50',
    },
    {
      label: 'قيد الانتظار',
      value: ORDER_STATUS.PENDING,
      icon: Clock,
      color: 'text-amber-600',
      activeColor: 'bg-amber-100 text-amber-900',
      hoverColor: 'hover:bg-amber-50',
    },
    {
      label: 'في الطريق',
      value: ORDER_STATUS.IN_WAY,
      icon: Truck,
      color: 'text-indigo-600',
      activeColor: 'bg-indigo-100 text-indigo-900',
      hoverColor: 'hover:bg-indigo-50',
    },
    {
      label: 'تم التسليم',
      value: ORDER_STATUS.DELIVERED,
      icon: CheckCircle,
      color: 'text-green-600',
      activeColor: 'bg-green-100 text-green-900',
      hoverColor: 'hover:bg-green-50',
    },
    {
      label: 'ملغي',
      value: ORDER_STATUS.CANCELED,
      icon: XCircle,
      color: 'text-red-600',
      activeColor: 'bg-red-100 text-red-900',
      hoverColor: 'hover:bg-red-50',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-1 rtl:space-x-reverse border-b">
        {tabs.map((tab) => {
          const isActive = 
            (tab.value === undefined && activeStatus === undefined) || 
            tab.value === activeStatus;
            
          return (
            <Link
              key={tab.label}
              href={`${pathname}?${createQueryString(tab.value)}`}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
                isActive 
                  ? tab.activeColor
                  : `${tab.color} ${tab.hoverColor}`,
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
