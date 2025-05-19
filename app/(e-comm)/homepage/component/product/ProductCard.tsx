'use client';
import {
  memo,
  useState,
} from 'react';

import {
  Check,
  DollarSign,
  UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import { FaCartPlus } from 'react-icons/fa6';

import Link from '@/components/link';
import RatingPreview from '@/components/rating/RatingPreview';
import WishlistButton from '@/components/wishlist/WishlistButton';

import { Button } from '../../../../../components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../../../../../components/ui/card';
import { Product } from '../../../../../types/product';
import Notification from '../NotificationSection';
import QuantityControls from '../QuantityControls';

// Memoized TotalPrice component
const TotalPrice = memo(({ quantity, price }: { quantity: number; price: number }) => {
  return (
    <>
      {quantity !== 1 && (
        <div className='w-full rounded-lg bg-secondary p-2 shadow-sm'>
          <div className='flex items-center justify-center gap-2 text-sm font-semibold text-foreground'>
            <span className='md:block'>الإجمالي:</span>
            <span>
              ${typeof price === 'number' && !isNaN(price) ? (quantity * price).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      )}
    </>
  );
});

// Memoized AddToCartButton component
const AddToCartButton = memo(({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      className='rounded-full bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90'
    >
      <FaCartPlus size={16} className='mr-2' />
      <span>أضف إلى السلة</span>
    </Button>
  );
});

// We're now using the RatingPreview component instead of custom rendering

// Product Card Component - Optimized for performance
const ProductCard = memo(
  ({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    isInCart,
    showNotification,
    index,
  }: {
    product: Product;
    quantity: number;
    onQuantityChange: (productId: string, delta: number) => void;
    onAddToCart: (productId: string, quantity: number, product: Product) => void;
    isInCart: boolean;
    showNotification: boolean;
    index: number;
  }) => {
    // Use state for the image source
    const [imgSrc, setImgSrc] = useState(product.imageUrl || '/fallback/product-fallback.avif');

    return (
      <Card className='relative flex h-[500px] flex-col overflow-hidden rounded-2xl border-border bg-card shadow-md transition-shadow duration-300 hover:shadow-lg'>
        {/* Wishlist button */}
        <div className='absolute left-3 top-3 z-10'>
          <WishlistButton
            productId={product.id}
            size='sm'
            showBackground={true}
            className='transition-transform duration-200 hover:scale-110'
          />
        </div>

        {/* Cart indicator */}
        {isInCart && (
          <div className='absolute right-2 top-2 z-10 animate-fadeIn rounded-full bg-green-500 p-2 text-white shadow-lg'>
            <Check size={16} />
          </div>
        )}

        <Notification show={showNotification} />

        <CardHeader className='relative p-0'>
          <Link href={`/product/${product.slug || product.id}`} className='block h-48 w-full'>
            <div className='h-48 w-full overflow-hidden rounded-t-2xl'>
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                className='object-cover transition-transform duration-300 hover:scale-105'
                onError={() => {
                  setImgSrc('/fallback/product-fallback.avif');
                }}
              />
            </div>
          </Link>
          {/* Overlays Container */}
          <div className='absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-3'>
            {/* Rating Overlay */}
            {product.rating && product.rating > 0 && (
              <div className='rounded-full bg-black/60 px-3 py-1 text-white backdrop-blur-sm'>
                <RatingPreview
                  productId={product.id}
                  productSlug={product.slug}
                  rating={product.rating}
                  reviewCount={product.reviewCount || 0}
                  size='sm'
                  className='text-white' // Adjust text/star color for visibility
                  disableLink={true}
                />
              </div>
            )}
            {/* View Product Link Overlay */}
            {!product.outOfStock && (
              <Link
                href={`/product/${product.slug || product.id}`}
                className='rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/80'
              >
                عرض المنتج
              </Link>
            )}
          </div>
          {/* Out of Stock Overlay */}
          {product.outOfStock && (
            <div className='absolute right-3 top-3 z-10 rounded-full bg-red-500 px-3 py-1 text-white shadow-lg'>
              غير متوفر
            </div>
          )}
        </CardHeader>

        <CardContent className='flex flex-1 flex-col p-4 text-center'>
          {/* Product title - fixed height with ellipsis for overflow */}
          <Link href={`/product/${product.slug || product.id}`} className='hover:underline'>
            <h3 className='mb-1 line-clamp-1 text-base font-bold text-foreground'>
              {product.name}
            </h3>
          </Link>

          {/* Product details - fixed height with ellipsis for overflow */}
          <p className='mb-2 line-clamp-2 h-10 text-sm text-muted-foreground'>{product.details}</p>

          {/* Rating section - NEW */}
          {/* <div className='mb-3 flex items-center justify-center'>
            {product.rating && product.rating > 0 ? (
              <RatingPreview
                ={product.id}
                productSlug={product.slug}
                rating={product.rating}
                reviewCount={product.reviewCount || 0}
                size='sm'
                className='mx-auto'
                disableLink={true}
              />
            ) : (
              <span className='text-xs text-muted-foreground'>لا توجد تقييمات بعد</span>
            )}
          </div> */}

          {/* Spacer to push content to top and bottom */}
          <div className='min-h-[10px] flex-grow'></div>

          {/* Price section */}
          <div className='mb-2 flex items-center justify-between text-sm font-semibold text-foreground'>
            <div className='flex w-full items-center justify-center gap-2'>
              <DollarSign size={16} className='text-amber-500' />
              <span>
                {typeof product.price === 'number' && !isNaN(product.price)
                  ? product.price.toFixed(2)
                  : '0.00'}{' '}
              </span>
            </div>
            <TotalPrice quantity={quantity} price={product.price} />
          </div>

          {/* Quantity controls */}
          {product.outOfStock ? null : (
            <QuantityControls
              quantity={quantity}
              onDecrease={() => {
                onQuantityChange(product.id, -1);
              }}
              onIncrease={() => {
                onQuantityChange(product.id, 1);
              }}
            />
          )}
        </CardContent>

        <CardFooter className='flex h-[80px] flex-col items-center justify-center gap-2'>
          {!product.outOfStock ? (
            <>
              <AddToCartButton
                onClick={() => {
                  onAddToCart(product.id, quantity, product);
                }}
              />
              {/* <Link
                href={`/product/${product.slug || product.id}`}
                className='text-sm text-primary hover:underline'
              >
                عرض المنتج
              </Link> */}
            </>
          ) : (
            <div className='flex w-full flex-col gap-2'>
              {/* Notify Me Button */}
              <Button variant="secondary" className='w-full rounded-full shadow-md transition-all duration-300'>
                <span>أعلمني عند توفره</span>
              </Button>
              {/* Contact Sales Button */}
              <Button className='w-full rounded-full bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90'>
                <UserIcon size={16} className='mr-2' />
                <span>تواصل مع المبيعات</span>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  },
);

// Component is already memoized in its definition
export default ProductCard;
ProductCard.displayName = 'ProductCard';
TotalPrice.displayName = 'TotalPrice';
AddToCartButton.displayName = 'AddToCartButton';
