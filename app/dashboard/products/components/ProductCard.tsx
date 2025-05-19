'use client'; // Make it a client component
import { Eye, Edit3, Trash2, BarChart2, MoreHorizontal } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import Link from 'next/link'; // Use standard Next.js Link
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // For delete confirmation
import { toast } from 'sonner'; // For delete feedback
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Assuming deleteProduct action path and ConfirmDeleteDialog path
import { deleteProduct } from '../../products-control/actions/deleteProduct'; // Corrected path
import ConfirmDeleteDialog from '../../products-control/components/ConfirmDeleteDialog';
import CardImage from '../../../../components/CardImage';


interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    size?: string | null;
    details?: string | null;
    imageUrl?: string | null;
    published: boolean;
  };
  onDeleted?: (productId: string) => void; // Callback to refresh list
}

export default function ProductCard({ product, onDeleted }: ProductCardProps) {
  const router = useRouter();

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product.id);
      toast.success('تم حذف المنتج بنجاح.');
      onDeleted?.(product.id);
    } catch (e) {
      let errorMessage = 'لا يمكن حذف المنتج. تحقق من عدم ارتباطه بمعاملات.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <Card className='group w-full rounded-none border-b border-border bg-card p-0 text-card-foreground transition-colors hover:bg-muted/40'>
      <CardContent className='grid min-h-[80px] w-full grid-cols-1 items-center gap-x-2 gap-y-2 p-2 sm:grid-cols-[7rem_1fr_1fr_1fr_2fr_7rem] sm:p-0'>
        {/* Image Cell */}
        <div className='flex h-20 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-md border-b border-muted bg-muted sm:h-16 sm:border-b-0 sm:border-r'>
          <CardImage
            imageUrl={product.imageUrl || undefined}
            altText={`${product.name} image`}
            aspectRatio='square'
            fallbackSrc='/default-product.jpg'
            placeholderText='لا توجد صورة متاحة'
            className='h-full w-full object-cover'
          />
        </div>
        {/* Name Cell */}
        <div
          className='line-clamp-1 text-center text-base font-bold text-primary sm:text-right sm:line-clamp-2' // Apply line-clamp
          title={product.name}
        >
          {product.name}
        </div>
        {/* Size Cell */}
        <div className='text-center text-sm text-muted-foreground'>
          {product.size || <span className='text-muted-foreground'>—</span>} {/* Use muted for placeholder */}
        </div>
        {/* Price Cell */}
        <div className='text-center text-base font-bold text-primary'>
          {product.price.toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' })} {/* Changed to SAR */}
        </div>
        {/* Details Cell */}
        <div
          className='line-clamp-2 w-full text-center text-xs text-muted-foreground sm:text-right'
          title={product.details || undefined}
        >
          {product.details || <span className='text-muted-foreground'>لا توجد تفاصيل</span>} {/* Use muted for placeholder */}
        </div>
        {/* Status & Actions Cell (Combined for better layout in card) */}
        <div className='flex flex-col items-center justify-center gap-2 sm:gap-1'>
          <div className='flex items-center justify-center'>
            {product.published ? (
              <span className='inline-flex items-center rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white'> {/* Theme consistent */}
                منشور
              </span>
            ) : (
              <span className='inline-flex items-center rounded bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground'> {/* Theme consistent */}
                غير منشور
              </span>
            )}
          </div>
          {/* Action Dropdown */}
          <div className='flex w-full items-center justify-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/products/view/${product.id}`} className="flex items-center gap-2 cursor-pointer">
                    <Eye className={iconVariants({ size: 'xs' })} />
                    <span>عرض</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/products/edit/${product.id}`} className="flex items-center gap-2 cursor-pointer">
                    <Edit3 className={iconVariants({ size: 'xs' })} />
                    <span>تعديل</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/dashboard/products-control/analytics/${product.id}`)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BarChart2 className={iconVariants({ size: 'xs' })} />
                  <span>تحليلات</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ConfirmDeleteDialog onConfirm={handleDeleteProduct}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()} // Prevent dropdown closing
                    className="flex items-center gap-2 text-destructive hover:!text-destructive cursor-pointer"
                  >
                    <Trash2 className={iconVariants({ size: 'xs' })} />
                    <span>حذف</span>
                  </DropdownMenuItem>
                </ConfirmDeleteDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
