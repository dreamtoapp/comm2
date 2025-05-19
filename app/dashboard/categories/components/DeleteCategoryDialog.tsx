'use client'

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { deleteCategory } from '../actions'; // Updated import path (anticipating move)

// Re-define Category locally if not globally available or to match specific needs for this component
// This interface defines the shape of the category object expected by this dialog.
interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    // children: number; // Removed as subcategories are no longer a feature
    productAssignments: number;
  };
}

interface DeleteCategoryDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteCategoryDialog({
  category,
  isOpen,
  onClose,
}: DeleteCategoryDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!category) return;

    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (result.success) {
        toast.success(`تم حذف الصنف "${category.name}" بنجاح.`);
        onClose();
        router.refresh(); // Refresh data on the page
      } else {
        toast.error(result.error || 'فشل حذف الصنف.');
      }
    });
  };

  if (!category) return null;

  // const hasChildren = category._count && category._count.children > 0; // Removed
  const hasProducts = category._count && category._count.productAssignments > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الصنف
              <strong> {category.name} </strong>
              بشكل دائم.
              {/* Warning for children removed */}
              {hasProducts && ( // Simplified condition, as hasChildren will always be false effectively
                <div className="mt-2 text-yellow-600 dark:text-yellow-400">
                  هذا الصنف لديه {category._count?.productAssignments} منتجات مرتبطة به.
                  سيتم إزالة هذه الارتباطات.
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            إلغاء
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'جاري الحذف...' : 'حذف الصنف'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
