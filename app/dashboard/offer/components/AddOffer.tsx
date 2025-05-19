'use client';
import { useActionState, useEffect, useState } from 'react';

import { ImageIcon, Loader2, Tag } from 'lucide-react';

import ImageUpload from '@/components/image-upload';
import { InputWithValidation } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { createOffer } from '@/app/dashboard/offer/actions';



// Extracted Form Component
const OfferForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Update signature to accept File[] | null
  const handleFileSelect = (files: File[] | null) => {
    // Take the first file if the array exists and is not empty
    const file = files && files.length > 0 ? files[0] : null;
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const [state, addAction, isPending] = useActionState(createOffer, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={addAction} className='max-h-[350px] space-y-4 overflow-y-auto p-4'>
      <InputWithValidation
        name='name'
        label='اسم العرض'
        placeholder='أدخل اسم العرض'
        required
        error='الاسم  مطلوب'
      />

      <Label className='block'>
        <span className='mb-2 flex items-center gap-1'>
          <ImageIcon className='h-4 w-4' />
          شعار العرض
        </span>
        <ImageUpload
          name='logo'
          initialImage={previewUrl}
          onImageUpload={handleFileSelect}
          aspectRatio={1}
          maxSizeMB={2}
          allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
          uploadLabel='انقر لرفع الصورة'
          previewType='contain'
          className='h-36'
          alt='شعار الشركة'
          minDimensions={{ width: 300, height: 300 }}
        />
      </Label>

      {state.message && (
        <div
          className={`mt-4 rounded p-3 ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {state.message}
        </div>
      )}

      <Button
        type='submit'
        disabled={isPending}
        className='w-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90'
      >
        {isPending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            جاري الحفظ...
          </>
        ) : (
          'حفظ التغييرات'
        )}
      </Button>
    </form>
  );
};

// Main Dialog Component
export default function AddOffer() {
  const [open, setOpen] = useState(false);
  const handleSuccess = () => {
    setTimeout(() => setOpen(false), 1500);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default' aria-label='تعديل'>
          <Tag className='h-4 w-4 text-primary-foreground' /> اضافة عرض جديد
        </Button>
      </DialogTrigger>

      <DialogContent
        className='min-h-[500px] border-border bg-background text-foreground shadow-lg sm:max-w-[425px]'
        dir='rtl'
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
            <Tag className='h-4 w-4 text-primary' /> اضافة عرض جديدة
          </DialogTitle>
          <DialogDescription className='text-right'>قم باضافة تفاصيل العرض هنا</DialogDescription>
        </DialogHeader>
        <OfferForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
