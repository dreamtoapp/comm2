'use client';
import React from 'react';
import { Package, Eye } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

import CardImage from '@/components/CardImage';
// Removed Icon import: import { Icon } from '@/components/icons';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Arabic UI Texts
const UI_TEXT = {
  viewDetails: 'عرض التفاصيل',
  noImage: 'لا توجد صورة',
  price: 'السعر',
  size: 'الحجم',
  details: 'التفاصيل',
  inStock: 'متوفر',
  outOfStock: 'غير متوفر',
  lowStock: 'كمية محدودة',
  lastUpdated: 'آخر تحديث',
};

interface SupplierInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    size?: string | null;
    details?: string | null;
    imageUrl?: string | null;
    supplier?: SupplierInfo | null;
    stockStatus?: 'in_stock' | 'out_of_stock' | 'low_stock';
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function ProductCard({ product }: ProductCardProps) {

  return (
    <Card className='flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
      {/* Card Header */}
      <CardHeader className='space-y-2 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 p-6'>
        {/* Product Title */}
        <CardTitle className='line-clamp-2 text-xl font-bold text-primary'>
          {product.name}
        </CardTitle>

        {/* Supplier Info */}
        {product.supplier && (
          <CardDescription className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Package className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
            <span className='truncate'>{product.supplier.name}</span>
          </CardDescription>
        )}

        {/* Stock and Published Status */}
        <div className='flex items-center justify-between'>
          {product.stockStatus && (
            <Badge
              variant={
                product.stockStatus === 'in_stock'
                  ? 'default'
                  : product.stockStatus === 'low_stock'
                    ? 'secondary'
                    : 'destructive'
              }
              className='w-fit'
            >
              {product.stockStatus === 'in_stock'
                ? UI_TEXT.inStock
                : product.stockStatus === 'low_stock'
                  ? UI_TEXT.lowStock
                  : UI_TEXT.outOfStock}
            </Badge>
          )}
          <Badge variant={product.published ? 'default' : 'destructive'} className='w-fit'>
            {product.published ? 'منشور' : 'غير منشور'}
          </Badge>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className='flex-grow space-y-6 p-6'>
        {/* Product Image */}
        <div className='relative aspect-[4/3] overflow-hidden rounded-lg shadow-md'>
          <CardImage
            imageUrl={product.imageUrl}
            altText={`${product.name} image`}
            aspectRatio='square'
            fallbackSrc='/default-logo.png'
            placeholderText={UI_TEXT.noImage}
            priority={true}
            className='h-full w-full object-cover'
          />
        </div>

        {/* Product Details */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <strong className='font-semibold text-primary'>{UI_TEXT.price}:</strong>
            <span className='text-lg font-bold text-foreground'>${product.price.toFixed(2)}</span>
          </div>
          {product.size && (
            <div className='flex items-center gap-2'>
              <strong className='font-semibold text-primary'>{UI_TEXT.size}:</strong>
              <span className='text-foreground'>{product.size}</span>
            </div>
          )}
          {product.details && (
            <div className='flex flex-col gap-2'>
              <strong className='font-semibold text-primary'>{UI_TEXT.details}:</strong>
              <p className='line-clamp-3 text-muted-foreground'>{product.details}</p>
            </div>
          )}
          <div className='flex items-center gap-2'>
            <strong className='text-muted-foreground'>{UI_TEXT.lastUpdated}:</strong>
            <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className='flex items-center justify-between border-t border-border bg-muted/10 p-6'>
        <Link
          href={`/dashboard/products/itemdetail/${product.id}`}
          className='flex w-full items-center justify-center gap-2 rounded-md bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/10'
          aria-label={UI_TEXT.viewDetails}
        >
          <Eye className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
          <span className='truncate'>{UI_TEXT.viewDetails}</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
