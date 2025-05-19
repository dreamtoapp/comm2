'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingCart, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

import { formatCurrency } from '../../../../lib/formatCurrency';

const CartSummary = () => {
  const [isClient, setIsClient] = useState(false); // Track if the component is on the client
  const { getTotalPrice, getTotalItems } = useCartStore();
  const router = useRouter();

  // Ensure this logic only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize calculations to avoid unnecessary re-renders
  const totalPrice = useMemo(() => (isClient ? getTotalPrice() : 0), [getTotalPrice, isClient]);
  const totalWithTax = useMemo(() => totalPrice * 1.15, [totalPrice]); // 15% tax
  const totalItems = useMemo(() => (isClient ? getTotalItems() : 0), [getTotalItems, isClient]);

  // Memoize the onClick handler
  const handleContinueShopping = useCallback(() => {
    router.push('/');
  }, [router]);

  // Render nothing on the server
  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-sm rounded-xl border border-gray-200 bg-card p-6 text-foreground shadow-lg dark:border-gray-700 dark:shadow-gray-800/50'
    >
      {/* Header */}
      <div className='mb-6 flex flex-row-reverse items-center justify-between'>
        <h2 className='flex items-center text-xl font-semibold'>
          ملخص الطلب
          <ShoppingCart className='mr-2 h-5 w-5 text-primary' />
        </h2>
        <div className='rounded-full bg-primary/10 px-3 py-1 text-sm text-primary'>
          {totalItems} منتج
        </div>
      </div>

      {/* Summary Items */}
      <div className='space-y-4'>
        {/* Subtotal */}
        <div className='flex flex-row-reverse items-center justify-between'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Tag className='h-4 w-4' />
            <span>الإجمالي الفرعي</span>
          </div>
          <span className='font-medium'>{formatCurrency(totalPrice)}</span>
        </div>

        {/* Tax */}
        <div className='flex flex-row-reverse items-center justify-between'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <DollarSign className='h-4 w-4' />
            <span>الضريبة (15%)</span>
          </div>
          <span className='font-medium'>{formatCurrency(totalWithTax - totalPrice)}</span>
        </div>

        {/* Total */}
        <div className='flex flex-row-reverse items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700'>
          <div className='flex items-center gap-2'>
            <Package className='h-5 w-5 text-primary' />
            <span className='font-semibold'>الإجمالي النهائي</span>
          </div>
          <span className='text-xl font-bold text-primary'>{formatCurrency(totalWithTax)}</span>
        </div>

        {/* Checkout Button */}
        <Button
          className='mt-6 h-12 w-full bg-primary text-lg font-semibold transition-all duration-200 hover:bg-primary/90'
          size='lg'
          onClick={handleContinueShopping}
        >
          متابعة التسوق
        </Button>
      </div>
    </motion.div>
  );
};

export default CartSummary;
