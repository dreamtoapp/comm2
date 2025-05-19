'use client';
import React, { memo, useState } from 'react';

import { FaCompress, FaExpand } from 'react-icons/fa6';

import NoData from '@/app/(e-comm)/homepage/component/product/NoProduct';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/product';

// Import ProductCard directly for better performance
import ProductCard from './ProductCard';

// Memoize ProductCard for better performance
const MemoizedProductCard = memo(ProductCard);

export default function ProductList({ products }: { products: Product[] }) {
  const { addItem, cart } = useCartStore();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(() =>
    products.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {}),
  );
  const [notifications, setNotifications] = useState<{
    [key: string]: boolean;
  }>({});
  const [isSingleColumn, setIsSingleColumn] = useState(true);



  // Initialize quantities only once with a stable reference


  // Memoize these functions to prevent unnecessary re-renders
  const updateQuantity = React.useCallback((productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  }, []);

  const handleAddToCart = React.useCallback(
    (productId: string, quantity: number, product: Product) => {
      addItem(product, quantity);
      setNotifications((prev) => ({ ...prev, [productId]: true }));

      // Use a ref to track and clear timeouts
      const timeoutId = setTimeout(() => {
        setNotifications((prev) => ({ ...prev, [productId]: false }));
      }, 2000);

      // Clean up timeout on unmount
      return () => clearTimeout(timeoutId);
    },
    [addItem],
  );

  // Removed loading state check
  if (!products || products.length === 0) {
    return <NoData message='لا توجد منتجات متاحة' />;
  }


  return (
    <div className='container mx-auto p-4'>
      <div className='mb-6 flex justify-center sm:hidden'>
        <Button
          onClick={() => setIsSingleColumn(!isSingleColumn)}
          className='flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90'
        >
          {isSingleColumn ? <FaExpand size={16} /> : <FaCompress size={16} />}
          {isSingleColumn ? 'عرض أكثر' : 'عرض أقل'}
        </Button>
      </div>

      <div
        className={`grid gap-6 ${isSingleColumn ? 'grid-cols-1' : 'grid-cols-2'} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
      >
        {products.map((product, index) => (
          <MemoizedProductCard
            key={product.id} // Use product.id directly as the key
            product={product}
            quantity={quantities[product.id] || 1}
            onQuantityChange={updateQuantity}
            onAddToCart={handleAddToCart}
            isInCart={!!cart[product.id]}
            showNotification={!!notifications[product.id]}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
