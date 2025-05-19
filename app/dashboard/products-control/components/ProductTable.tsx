import React from 'react';

import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product'; // Import Product from shared types

import ProductTableClientActions from './ProductTableClientActions';

interface ProductTableProps {
  page: number;
  pageSize: number;
  products: Product[]; // Use shared Product type
  total: number;
  loading?: boolean;
  onDeleted?: () => void;
}

export default function ProductTable({
  pageSize,
  products,
  loading,
  onDeleted,
}: ProductTableProps) {
  if (loading) {
    return (
      // Removed overflow-x-auto, w-full might still be useful for the container's styling
      <div className='w-full rounded-lg border bg-card shadow-sm'>
        <table className='rtl w-full text-right text-sm table-auto'><thead className='bg-accent text-accent-foreground'><tr>{/* Ensure no whitespace before <tr> */}
          <th className='px-4 py-3'>الصورة</th>
          <th className='px-4 py-3'>اسم المنتج</th>
          <th className='px-4 py-3'>السعر</th>
          {/* <th className='px-4 py-3'>الحجم</th> Removed */}
          {/* <th className='px-4 py-3'>التفاصيل</th> Removed */}
          <th className='px-4 py-3'>المورد</th>
          <th className='px-4 py-3'>الحالة</th>
          <th className='px-4 py-3'>الكمية</th>
          <th className='px-4 py-3'>الإجراءات</th>
        </tr>
        </thead>
          <tbody>
            {[...Array(pageSize)].map((_, i) => (
              <tr key={i}>
                {Array(7) /* Adjusted skeleton to 7 columns */
                  .fill(0)
                  .map((_, j) => (
                    <td key={j} className='px-4 py-2'>
                      <Skeleton className='h-5 w-full' />
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (!loading && (!products || products.length === 0)) {
    return (
      <div className='flex min-h-[200px] items-center justify-center text-muted-foreground'>
        لا توجد منتجات
      </div>
    );
  }
  return (
    // Removed overflow-x-auto, w-full might still be useful for the container's styling
    <div className='w-full rounded-lg border bg-card shadow-sm'>
      <table className='rtl w-full text-right text-sm table-auto'><thead className='bg-accent text-accent-foreground'><tr>{/* Ensure no whitespace before <tr> */}
        <th className='px-4 py-3'>الصورة</th>
        <th className='px-4 py-3'>اسم المنتج</th>
        <th className='px-4 py-3'>السعر</th>
        {/* <th className='px-4 py-3'>الحجم</th> Removed */}
        {/* <th className='px-4 py-3'>التفاصيل</th> Removed */}
        <th className='px-4 py-3'>المورد</th>
        <th className='px-4 py-3'>الحالة</th>
        <th className='px-4 py-3'>الكمية</th>
        <th className='px-4 py-3'>الإجراءات</th>
      </tr>
      </thead>
        <tbody>
          {products.map((product: Product) => ( // Use shared Product type
            <tr key={product.id}>
              <td className='px-4 py-2'>
                {product.imageUrl ? (

                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={48}
                    height={48}
                    className='h-12 w-12 rounded object-cover'
                  />

                ) : (
                  <span className='text-muted-foreground'>—</span>
                )}
              </td>
              <td className='px-4 py-2 font-medium'>
                <span title={product.name} className="block max-w-xs line-clamp-2">{product.name}</span>
              </td>
              <td className='px-4 py-2'>{product.price.toLocaleString()} ر.س</td>
              {/* <td className='px-4 py-2'>{product.size || '-'}</td> Removed */}
              {/* <td className='px-4 py-2'>
                <span title={product.details || undefined} className="block max-w-xs line-clamp-1">{product.details || '-'}</span>
              </td> Removed */}
              <td className='px-4 py-2'>{product.supplier?.name || '-'}</td>
              <td className='px-4 py-2'>
                {product.published ? (
                  <span className='inline-block rounded bg-emerald-600 px-2 py-1 text-xs text-white'>
                    منشور
                  </span>
                ) : (
                  <span className='inline-block rounded bg-muted px-2 py-1 text-xs text-muted-foreground'>
                    غير منشور
                  </span>
                )}
              </td>
              <td className='px-4 py-2'>{product.outOfStock ? 'غير متوفر' : 'متوفر'}</td>
              <td className='flex gap-2 whitespace-nowrap px-3 py-4 text-sm text-muted-foreground'> {/* Changed text-gray-500 */}
                <ProductTableClientActions product={product} onDeleted={onDeleted} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
