'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Eye, Edit3, Trash2, ListChecks, MoreHorizontal, BarChart2 } from 'lucide-react'; // Added BarChart2

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iconVariants } from '@/lib/utils';
import { deleteSupplier } from '../actions/deleteSupplier'; // Import the action
import ConfirmDeleteDialog from '../../products-control/components/ConfirmDeleteDialog';

interface SupplierTableClientActionsProps {
  supplierId: string;
  supplierName: string; // For delete confirmation message
  // onDeleted?: (supplierId: string) => void;
}

export default function SupplierTableClientActions({ supplierId, supplierName }: SupplierTableClientActionsProps) {
  const router = useRouter();

  const handleDeleteSupplier = async () => {
    // try {
    //   await deleteSupplier(supplierId);
    //   toast.success(`تم حذف المورد ${supplierName} بنجاح.`);
    //   // onDeleted?.(supplierId);
    //   router.refresh(); // Or use revalidatePath in action
    // } catch (e) {
    //   let errorMessage = 'لا يمكن حذف المورد. قد يكون مرتبطًا بمنتجات.';
    //   if (e instanceof Error) { errorMessage = e.message; }
    try {
      const result = await deleteSupplier(supplierId);
      if (result.success) {
        toast.success(result.message || `تم حذف المورد ${supplierName} بنجاح.`);
        router.refresh(); // Or rely on revalidatePath from action
      } else {
        toast.error(result.message || 'لا يمكن حذف المورد.');
      }
    } catch (e) {
      let errorMessage = 'لا يمكن حذف المورد. قد يكون مرتبطًا بمنتجات.';
      if (e instanceof Error) { errorMessage = e.message; }
      toast.error(errorMessage);
    }
  };

  return (
    <ConfirmDeleteDialog
      onConfirm={handleDeleteSupplier}
      title={`تأكيد حذف المورد: ${supplierName}`}
      description="هل أنت متأكد أنك تريد حذف هذا المورد؟ قد يكون هذا الإجراء مرتبطًا بمنتجات ولن يمكن التراجع عنه."
    >
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
            <Link href={`/dashboard/suppliers/view/${supplierId}`} className="flex items-center gap-2 cursor-pointer">
              <Eye className={iconVariants({ size: 'xs' })} />
              <span>عرض التفاصيل</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/suppliers/edit/${supplierId}`} className="flex items-center gap-2 cursor-pointer">
              <Edit3 className={iconVariants({ size: 'xs' })} />
              <span>تعديل</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/analytics/overview`} className="flex items-center gap-2 cursor-pointer">
              <BarChart2 className={iconVariants({ size: 'xs' })} />
              <span>التحليلات العامة</span>
            </Link>
          </DropdownMenuItem>
          {/* Removed "View Products" DropdownMenuItem */}
          <DropdownMenuSeparator />
          {/* The DropdownMenuItem for delete is the trigger for ConfirmDeleteDialog */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="flex items-center gap-2 text-destructive hover:!text-destructive cursor-pointer"
          // The click to open dialog is handled by ConfirmDeleteDialog's DialogTrigger
          >
            <Trash2 className={iconVariants({ size: 'xs' })} />
            <span>حذف</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ConfirmDeleteDialog>
  );
}
