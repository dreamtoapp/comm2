'use client';
import { Trash2 } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  onRemove: () => void; // Function to handle item removal
}

export default function CartItem({ product, quantity, onRemove }: CartItemProps) {
  return (
    <div className='flex items-center justify-between border-b pb-2'>
      {/* Product Details */}
      <div>
        <p className='font-semibold'>{product.name}</p>
        <p className='text-sm text-gray-500'>
          {quantity} × ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Price and Remove Button */}
      <div className='flex items-center gap-2'>
        <p className='font-semibold'>${(product.price * quantity).toFixed(2)}</p>
        <Button
          variant='outline'
          size='icon'
          onClick={onRemove}
          className='border-red-500 text-red-500 transition hover:bg-red-100'
          aria-label={`حذف المنتج ${product.name}`} // ✅ Add ARIA Label
        >
          <Trash2 className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
        </Button>
      </div>
    </div>
  );
}
