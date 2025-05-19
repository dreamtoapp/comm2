'use client';
import { useState } from 'react'; // Added useState
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Edit3, Trash2, MoreHorizontal, ToggleLeft, ToggleRight, BarChart3 } from 'lucide-react'; // Added BarChart3

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
import ConfirmDeleteDialog from '@/app/dashboard/products-control/components/ConfirmDeleteDialog';
import { deletePromotion } from '../actions/deletePromotion';
import { togglePromotionStatus } from '../actions/togglePromotionStatus';
import PromotionAnalyticsModal from './PromotionAnalyticsModal'; // Import the new modal

interface PromotionsTableClientActionsProps {
  promotionId: string;
  promotionTitle: string;
  currentStatus: boolean;
}

export default function PromotionsTableClientActions({
  promotionId,
  promotionTitle,
  currentStatus
}: PromotionsTableClientActionsProps) {
  const router = useRouter();
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);
  const [selectedPromotionTitle, setSelectedPromotionTitle] = useState<string | null>(null);

  const handleOpenAnalyticsModal = () => {
    setSelectedPromotionId(promotionId);
    setSelectedPromotionTitle(promotionTitle);
    setIsAnalyticsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const result = await deletePromotion(promotionId);
      if (result.success) {
        toast.success(result.message || `تم حذف العرض "${promotionTitle}" بنجاح.`);
        router.refresh(); // Or revalidatePath in action
      } else {
        toast.error(result.message || 'فشل حذف العرض.');
      }
    } catch (e) {
      toast.error('حدث خطأ أثناء حذف العرض.');
    }
  };

  const handleToggleStatus = async () => {
    try {
      const result = await togglePromotionStatus(promotionId, currentStatus); // Pass currentStatus directly
      if (result.success) {
        toast.success(result.message || `تم تغيير حالة العرض "${promotionTitle}" بنجاح.`);
        router.refresh(); // Or revalidatePath in action
      } else {
        toast.error(result.message || 'فشل تغيير حالة العرض.');
      }
    } catch (e) {
      toast.error('حدث خطأ أثناء تغيير حالة العرض.');
    }
  };

  return (
    <>
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
            <Link href={`/dashboard/promotions/edit/${promotionId}`} className="flex items-center gap-2 cursor-pointer">
              <Edit3 className={iconVariants({ size: 'xs' })} />
              <span>تعديل</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenAnalyticsModal} className="flex items-center gap-2 cursor-pointer">
            <BarChart3 className={iconVariants({ size: 'xs' })} />
            <span>عرض التحليلات</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus} className="flex items-center gap-2 cursor-pointer">
            {currentStatus ? <ToggleRight className={iconVariants({ size: 'xs', className: 'text-emerald-600' })} /> : <ToggleLeft className={iconVariants({ size: 'xs' })} />}
            <span>{currentStatus ? 'تعطيل' : 'تفعيل'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <ConfirmDeleteDialog
            onConfirm={handleDelete}
            title={`تأكيد حذف العرض: ${promotionTitle}`}
            description="هل أنت متأكد أنك تريد حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء."
          >
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2 text-destructive hover:!text-destructive cursor-pointer"
            >
              <Trash2 className={iconVariants({ size: 'xs' })} />
              <span>حذف</span>
            </DropdownMenuItem>
          </ConfirmDeleteDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <PromotionAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onOpenChange={setIsAnalyticsModalOpen}
        promotionId={selectedPromotionId}
        promotionTitle={selectedPromotionTitle}
      />
    </>
  );
}
