'use client';

import { useState } from 'react';
import QuantityControls from '@/app/(e-comm)/homepage/component/QuantityControls';
import StoreAddToCartButton from '@/components/cart/StoreAddToCartButton';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { Product } from '@/types/product';

interface ProductQuantityProps {
  product: Product;
}

export default function ProductQuantity({ product }: ProductQuantityProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className='space-y-4'>
      <QuantityControls
        quantity={quantity}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
      />

      <div className='flex flex-wrap gap-3 pt-2'>
        <StoreAddToCartButton
          product={product}
          quantity={quantity}
          inStock={!product.outOfStock}
          size='lg'
        />

        <WishlistButton productId={product.id} className='p-2' size='lg' showBackground={true} />
      </div>
    </div>
  );
}
