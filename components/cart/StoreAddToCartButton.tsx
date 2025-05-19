'use client';

import { useState } from 'react';

import { toast } from 'sonner';
import { Check, ShoppingCart } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/product';

interface StoreAddToCartButtonProps {
  product: Product;
  quantity?: number;
  inStock?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function StoreAddToCartButton({
  product,
  quantity = 1,
  inStock = true,
  variant = 'default',
  size = 'default',
  className,
}: StoreAddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = async () => {
    if (!inStock) return;

    try {
      setIsLoading(true);

      // Add to cart using Zustand store
      addItem(product, quantity);

      // Show success state
      setIsAdded(true);

      // Show toast
      toast.success('تمت إضافة المنتج إلى السلة', {
        description: product.name,
      });

      // Reset success state after a delay
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ أثناء الإضافة إلى السلة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isLoading || !inStock || isAdded}
      className={cn(
        isAdded && 'bg-green-600 hover:bg-green-700',
        !inStock && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {isAdded ? (
        <>
          <Check // Use direct import
            className={iconVariants({ size: size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm' })} // Map button size to icon size
          />
          {size !== 'icon' && <span className='mr-2'>تمت الإضافة</span>}
        </>
      ) : (
        <>
          <ShoppingCart // Use direct import
            className={iconVariants({ size: size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm' })} // Map button size to icon size
          />
          {size !== 'icon' && (
            <span className='mr-2'>{!inStock ? 'غير متوفر' : 'إضافة إلى السلة'}</span>
          )}
        </>
      )}
    </Button>
  );
}
