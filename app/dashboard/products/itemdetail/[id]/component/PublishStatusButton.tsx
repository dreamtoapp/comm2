'use client';
import { useState } from 'react';
import { XCircle, CheckCircle } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { updatePublishStatus } from '../actions';

interface PublishStatusButtonProps {
  published: boolean;
  productName: string;
  productId: string;
  onStatusChange?: (publish: boolean) => void;
}

export default function PublishStatusButton({
  published,
  productName,
  productId,
  onStatusChange,
}: PublishStatusButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    const nextStatus: boolean = !published;
    try {
      const res = await updatePublishStatus(productId, nextStatus);
      if (res && typeof res.published === 'boolean') {
        onStatusChange?.(res.published);
        setOpen(false);
      } else {
        setError((res && res.error) || 'حدث خطأ غير متوقع');
      }
    } catch {
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={published ? 'destructive' : 'outline'}
          className='h-10 gap-2 transition-all hover:bg-primary/20'
        >
          {published ? (
            <XCircle className={iconVariants({ size: 'xs' })} /> // Use direct import + CVA
          ) : (
            <CheckCircle className={iconVariants({ size: 'xs' })} /> // Use direct import + CVA
          )}
          {published ? 'إيقاف النشر' : 'نشر'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {published ? 'تأكيد إيقاف النشر' : 'تأكيد نشر المنتج'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {published ? (
              <>
                سيتم إيقاف نشر المنتج <span className='font-bold'>{productName}</span> ولن يظهر
                للزبائن بعد الآن.
              </>
            ) : (
              <>
                سيتم نشر المنتج <span className='font-bold'>{productName}</span> ليكون متاحاً
                للزبائن.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? '...جاري التنفيذ' : published ? 'تأكيد الإيقاف' : 'تأكيد النشر'}
          </AlertDialogAction>
        </AlertDialogFooter>
        {error && <div className='mt-2 text-sm text-destructive'>{error}</div>}
      </AlertDialogContent>
    </AlertDialog>
  );
}
