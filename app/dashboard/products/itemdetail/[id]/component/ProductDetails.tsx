'use client';
import React from 'react';
import ProductPrice from './ProductPrice';
import { CardContent } from '@/components/ui/card';
import ProductHeader from './ProductHeader';
import ProductStatusBadges from './ProductStatusBadges';
import ProductImagePreview from './ProductImagePreview';
import UpdateProductDialog from '../../../components/UpdateProductDialog';
import ProductStatusControl from './ProductStatusControl';
import { Product } from '@/types/product'; // Import shared Product type

// fallback image config (inline, no import needed)
const fallbackImage = { src: '/fallback/fallback.webp' };

// Remove local Product interface definition
// interface Product { ... }

// --- Subcomponents ---
// Use imported Product type for props
function ProductInfoSection({ product }: { product: Product }) {
  return (
    <div className='flex w-full flex-col justify-between space-y-6'>
      <ProductPrice price={product.price} />
      <ProductStatusBadges published={product.published} outOfStock={product.outOfStock} />
      <ProductMeta product={product} />
      {product.details && <ProductDescription details={product.details} />}
    </div>
  );
}

// Use imported Product type for props
function ProductMeta({ product }: { product: Product }) {
  return (
    <div className='space-y-2'>
      {/* Name */}
      <div className='flex justify-between'>
        <span>اسم المنتج</span>
        <span className='font-medium'>{product.name}</span>
      </div>
      {/* Size */}
      {product.size && (
        <div className='flex justify-between'>
          <span>الحجم</span>
          <span className='font-medium'>{product.size}</span>
        </div>
      )}
      {/* Supplier */}
      {product.supplier?.name && (
        <div className='flex justify-between'>
          <span>المورد</span>
          <span className='font-medium'>{product.supplier.name}</span>
        </div>
      )}
      {/* Last updated */}
      <div className='flex justify-between'>
        <span>آخر تحديث</span>
        <span className='font-medium'>
          {new Date(product.updatedAt).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}

function ProductDescription({ details }: { details: string }) {
  return (
    <div className='space-y-2'>
      <h3 className='text-sm font-semibold text-muted-foreground'>الوصف</h3>
      <p className='leading-relaxed text-muted-foreground'>{details}</p>
    </div>
  );
}

// --- Main Component ---
// Use imported Product type for props
export default function ProductDetails({ product }: { product: Product }) {
  // All publish/stock logic is now handled in ProductStatusControl

  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-6 p-2 md:p-6'>
      {/* Header with actions */}
      <ProductHeader name={product.supplier?.name || ''} type={product.supplier?.type || ''} />

      {/* Main Content Grid: image half, details half */}
      <CardContent className='grid grid-cols-1 items-start gap-8 md:grid-cols-2'>
        {/* Image Section - left half on desktop */}
        <div className='flex w-full flex-col items-center justify-center'>
          <ProductImagePreview
            src={product?.imageUrl || ''}
            alt={product.name}
            fallbackSrc={fallbackImage.src}
          />
          <div className='mt-4 flex flex-col gap-2'>
            <UpdateProductDialog product={product} />
            <ProductStatusControl product={product} />
          </div>
        </div>
        {/* Info Section - right half on desktop */}
        <ProductInfoSection product={product} />
      </CardContent>
    </div>
  );
}
