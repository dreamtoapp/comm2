'use client';
import {
  useActionState,
  useState,
} from 'react';
import { Image as ImageIcon, Loader2, ShoppingBasket } from 'lucide-react'; // Import directly, alias Image
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
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

import { createSupplier } from '../actions/add-supplier';

// Extracted Form Component
const SupplierForm = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Update signature to accept File[] | null
  const handleFileSelect = (files: File[] | null) => {
    const file = files && files.length > 0 ? files[0] : null; // Get first file
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const [state, addAction, isPending] = useActionState(createSupplier, {
    success: false,
    message: '',
  });

  return (
    <form action={addAction} className='mt-4 max-h-[350px] space-y-4 overflow-y-auto p-4'>
      <InputWithValidation
        name='name'
        label='اسم الشركة'
        placeholder='أدخل اسم الشركة'
        required
        error='الاسم  مطلوب'
      />

      <Label className='block'>
        <span className='mb-2 flex items-center gap-1'>
          <ImageIcon className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA (aliased) */}
          شعار الشركة
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
            <Loader2 className={iconVariants({ size: 'xs', animation: 'spin', className: 'mr-2' })} /> {/* Use direct import + CVA */}
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
export default function AddSupplierDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default' aria-label='تعديل'>
          <ShoppingBasket className={iconVariants({ size: 'xs', className: 'text-primary-foreground' })} /> {/* Use direct import + CVA */} اضافة شركة
          جديدة
        </Button>
      </DialogTrigger>

      <DialogContent
        className='min-h-[500px] border-border bg-background text-foreground shadow-lg sm:max-w-[425px]'
        dir='rtl'
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
            <ShoppingBasket className={iconVariants({ size: 'xs', className: 'text-primary' })} /> {/* Use direct import + CVA */} اضافة شركة جديدة
          </DialogTitle>
          <DialogDescription className='text-right'>قم باضافة تفاصيل الشركة هنا</DialogDescription>
        </DialogHeader>

        <SupplierForm />
      </DialogContent>
    </Dialog>
  );
}

// await createSupplier(formData, logoFile);
