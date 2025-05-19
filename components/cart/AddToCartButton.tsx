'use client';

import { useState } from 'react'; // Keep only one import

import { toast } from 'sonner';
import { Check, ShoppingCart } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

import { addToCart } from '@/app/(e-comm)/cart/action/cart';
// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  inStock?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  inStock = true,
  variant = 'default',
  size = 'default',
  className,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!inStock) return;

    try {
      setIsLoading(true);

      // Call the server action to add to cart
      const result = await addToCart({
        productId,
        name,
        price,
        image,
      });

      if (result.success) {
        // Show success state
        setIsAdded(true);

        // Show toast
        toast.success(result.message, {
          description: name,
        });

        // Reset success state after a delay
        setTimeout(() => {
          setIsAdded(false);
        }, 2000);
      } else {
        toast.error(result.message);
      }
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
