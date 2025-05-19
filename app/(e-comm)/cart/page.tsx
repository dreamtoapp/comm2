'use client';
import { useEffect, useMemo, useState } from 'react';


import { useCartStore } from '@/store/cartStore';

import CartItemsList from './component/cart-items-List';
import CartSummarySection from './component/cart-summary-section';
import CheckOutSection from './component/check-out-section';
import EmptyCart from './component/empty-cart';

export default function CartPage() {
  const { getTotalItems, getTotalPrice, cart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // حساب المجموع مع الضريبة
  const totalWithTax = useMemo(() => {
    const total = getTotalPrice();
    return total + total * 0.15; // إضافة 15% ضريبة القيمة المضافة
  }, [getTotalPrice]);

  useEffect(() => {
    setMounted(true);
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 2 seconds loading time
  }, []);

  if (!mounted) return null;

  return (
    <div className='flex min-h-screen flex-col items-center space-y-6 rounded-t-3xl bg-background p-8'>
      {/* إذا كانت السلة فارغة */}
      {getTotalItems() === 0 ? (
        <EmptyCart />
      ) : (
        <div className='grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[2fr_1fr]'>
          {/* قائمة المنتجات في السلة */}
          <CartItemsList cart={cart} isLoading={isLoading} />

          {/* ملخص السلة */}
          <CartSummarySection isLoading={isLoading} />
        </div>
      )}

      {/* زر متابعة عملية الشراء في الأسفل */}
      <CheckOutSection
        isLoading={isLoading}
        totalWithTax={totalWithTax}
        getTotalItems={getTotalItems}
      />
    </div>
  );
}
