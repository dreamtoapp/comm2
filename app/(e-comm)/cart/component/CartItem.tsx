'use client';
import { useState } from 'react';

import Image from 'next/image';
import { Gift } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { formatCurrency } from '../../../../lib/formatCurrency';
import { useCartStore } from '../../../../store/cartStore';
import DeleteItemDialog from './DeleteItem';

interface CartItemProps {
  product: {
    id: string;
    name: string;
    price: number;
    type: string;
    imageUrl: string | null; // Allow null to match Product type
    details: string | null;
  };
  quantity: number;
}

const CartItem = ({ product, quantity }: CartItemProps) => {
  const { removeItem, updateQuantity } = useCartStore();
  const [imgSrc, setImgSrc] = useState<string>(product.imageUrl || '/fallback/fallback.avif'); // Provide fallback if initial is null

  // Check if the product is an offer
  const isOffer = product.type === 'offer';

  return (
    <Card
      className={`relative max-w-3xl overflow-hidden rounded-xl border-2 p-4 transition-all hover:shadow-md dark:hover:shadow-gray-800/50 ${isOffer
        ? 'border-gradient bg-gradient-to-r from-primary/10 to-secondary/10' // Gradient background for offers
        : 'border-border bg-background' // Default background for regular products
        }`}
    >
      {/* Offer Text in the Background */}
      {isOffer && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-10'>
          <span className='rotate-[-30deg] text-6xl font-bold text-primary'>عرض</span>
        </div>
      )}

      <div className='relative z-10 flex w-full flex-col gap-6 lg:flex-row'>
        {/* Product Image */}
        <div className='relative aspect-square w-full overflow-hidden rounded-lg lg:w-32'>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 128px'
            onError={() => {
              // Fallback to a local placeholder image if the original image fails to load
              setImgSrc('/fallback/fallback.avif');
            }}
            quality={80}
            placeholder='blur'
            blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+'
          />
          {/* Offer Badge */}
          {isOffer && (
            <Badge className='absolute left-2 top-2 flex items-center gap-1 bg-red-500 text-white'>
              {' '}
              {/* Changed to red */}
              <Gift className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */} عرض
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <div className='flex flex-1 flex-col gap-4'>
          <div className='space-y-2'>
            {/* Product Name */}
            <h3
              className={`line-clamp-2 text-lg font-semibold ${isOffer ? 'text-primary' : 'text-foreground'}`}
            >
              {product.name}
            </h3>
            {/* Product Details */}
            {product.details && (
              <p className='line-clamp-2 text-sm text-muted-foreground'>{product.details}</p>
            )}
            {/* Price per Item */}
            <p className='text-sm text-muted-foreground'>{formatCurrency(product.price)} each</p>
          </div>

          {/* Controls Section */}
          <div className='flex w-full flex-col items-center gap-4 sm:flex-row lg:flex-row'>
            {/* Quantity Controls */}
            <div
              className={`flex items-center rounded-lg border ${isOffer ? 'border-primary' : 'border-border'}`}
            >
              <Button
                variant='ghost'
                size='sm'
                className={`h-8 w-8 rounded-r-none px-0 ${isOffer ? 'hover:bg-primary/20' : 'hover:bg-primary/10'}`}
                onClick={() => updateQuantity(product.id, -1)}
                disabled={quantity <= 1}
              >
                −
              </Button>
              <span className='w-10 text-center text-sm font-medium text-foreground'>
                {quantity}
              </span>
              <Button
                variant='ghost'
                size='sm'
                className={`h-8 w-8 rounded-l-none px-0 ${isOffer ? 'hover:bg-primary/20' : 'hover:bg-primary/10'}`}
                onClick={() => updateQuantity(product.id, 1)}
              >
                +
              </Button>
            </div>

            {/* Total Price */}
            <p className={`text-lg font-semibold ${isOffer ? 'text-primary' : 'text-foreground'}`}>
              {formatCurrency(product.price * quantity)}
            </p>

            {/* Delete Button */}
            <div className='flex flex-1 items-center justify-end'>
              <DeleteItemDialog
                productId={product.id}
                productName={product.name}
                removeItem={removeItem}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
