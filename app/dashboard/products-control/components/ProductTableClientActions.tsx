'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Edit3, BarChart2, Trash2, MoreHorizontal, Eye } from 'lucide-react'; // Added Eye icon

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming shadcn/ui path
import { Product } from '@/types/product';

import { deleteProduct } from '../actions/deleteProduct';
import { iconVariants } from '@/lib/utils';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export default function ProductTableClientActions({
  product,
  onDeleted,
}: {
  product: Product;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product.id);
      toast.success('تم حذف المنتج بنجاح.');
      onDeleted?.(); // Use optional chaining
    } catch (e) {
      let errorMessage = 'لا يمكن حذف المنتج. تحقق من عدم ارتباطه بمعاملات.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      toast.error(errorMessage);
    }
  };
  const handleAnalytics = () => {
    router.push(`/dashboard/products-control/analytics/${product.id}`);
  };
  return (
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
            <span>عرض التفاصيل</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/products/edit/${product.id}`} className="flex items-center gap-2 cursor-pointer">
            <Edit3 className={iconVariants({ size: 'xs' })} />
            <span>تعديل</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAnalytics} className="flex items-center gap-2 cursor-pointer">
          <BarChart2 className={iconVariants({ size: 'xs' })} />
          <span>تحليلات</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ConfirmDeleteDialog onConfirm={handleDeleteProduct}>
          {/* This DropdownMenuItem now acts as the trigger for ConfirmDeleteDialog */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()} // Prevent default closing of dropdown on item select
            className="flex items-center gap-2 text-destructive hover:!text-destructive cursor-pointer"
          >
            <Trash2 className={iconVariants({ size: 'xs' })} />
            <span>حذف</span>
          </DropdownMenuItem>
        </ConfirmDeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
