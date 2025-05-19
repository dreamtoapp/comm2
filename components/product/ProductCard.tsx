'use client';

import { useState } from 'react';

import Image from 'next/image';

import RatingPreview from '@/components/rating/RatingPreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import WishlistButton from '@/components/wishlist/WishlistButton';

import { cn } from '@/lib/utils';
import { Product } from '@/types/product'; // Import shared Product type
import PromotionBadge from '@/app/(e-comm)/promotions/component/PromotionBadge';

import Link from '../link';

interface ProductCardProps {
  product: Product; // Use imported shared Product type
  className?: string;
  quantity: number; // Quantity prop from parent
  onQuantityChange: (productId: string, delta: number) => void; // Quantity change handler
  onAddToCart: (productId: string, quantity: number, product: Product) => void; // Add to cart handler
  isInCart: boolean; // Is product in cart prop
}

export default function ProductCard({
  product,
  className,
  quantity,
  onQuantityChange,
  onAddToCart,
  isInCart,
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || '/fallback/product-fallback.avif');

  // Format price
  const formattedPrice = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(product.price);

  // Format compareAtPrice (original price) if it exists
  const formattedCompareAtPrice = product.compareAtPrice
    ? new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(product.compareAtPrice)
    : null;

  // Calculate discount percentage if compareAtPrice exists and is greater than price
  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  // Handle add to cart click
  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigating to product page
    if (quantity > 0) {
      onAddToCart(product.id, quantity, product);
      toast.success(`${product.name} (${quantity}) تمت إضافته للسلة بنجاح!`);
    } else {
      toast.error('الكمية يجب أن تكون أكبر من صفر'); // Quantity must be greater than zero
    }
  };

  return (
    <div className={cn('group relative', className)}>
      {/* Wishlist button */}
      <div className='absolute left-3 top-3 z-10'>
        <WishlistButton productId={product.id} size='sm' showBackground={true} />
      </div>

      {/* Product link */}
      <Link href={`/product/${product.slug || product.id}`} className='block'>
        <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            onError={() => setImgSrc('/fallback/product-fallback.avif')}
          />

          {/* Display promotion badge or sale badge */}
          {discountPercentage !== null && (
            <PromotionBadge discountPercentage={discountPercentage} />
          )}

          {/* Stock badge */}
          {product.outOfStock && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <Badge variant='outline' className='bg-white px-3 py-1 font-bold text-black'>
                غير متوفر
              </Badge>
            </div>
          )}
        </div>

        <div className='mt-3 space-y-1'>
          {/* Product name */}
          <h3 className='line-clamp-1 text-sm font-medium'>{product.name}</h3>

          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <RatingPreview
              productId={product.id}
              productSlug={product.slug}
              rating={product.rating}
              reviewCount={product.reviewCount || 0}
              size='sm'
              disableLink={true}
            />
          )}

          {/* Price */}
          <div className='flex items-center gap-2'>
            {/* Show current price */}
            <span className='text-sm font-bold'>{formattedPrice}</span>
            {/* Show original price if on sale */}
            {formattedCompareAtPrice && discountPercentage !== null && (
              <span className='text-xs text-muted-foreground line-through'>
                {formattedCompareAtPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quantity selector and Add to Cart button */}
      <div className='mt-4 flex flex-col gap-2'>
        {/* Quantity selector */}
        <div className='flex items-center justify-between gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={(e) => {
              e.preventDefault(); // Prevent navigating
              onQuantityChange(product.id, -1);
            }}
            disabled={quantity <= 1} // Disable decrement if quantity is 1 or less
          >
            -
          </Button>
          <Input
            type='number'
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault(); // Prevent navigating
              const newQuantity = parseInt(e.target.value, 10);
              if (!isNaN(newQuantity) && newQuantity >= 0) {
                onQuantityChange(product.id, newQuantity - quantity); // Calculate delta
              }
            }}
            className='w-16 text-center'
            min='1' // Minimum quantity is 1
          />
          <Button
            variant='outline'
            size='sm'
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault(); // Prevent navigating
              onQuantityChange(product.id, 1);
            }}
          >
            +
          </Button>
        </div>

        {/* Add to Cart button */}
        <Button
          className='w-full'
          onClick={handleAddToCartClick}
          disabled={product.outOfStock || quantity <= 0} // Disable if out of stock or quantity is zero
        >
          {product.outOfStock ? 'غير متوفر' : isInCart ? 'في السلة' : 'أضف للسلة'}
        </Button>
      </div>
    </div>
  );
}
