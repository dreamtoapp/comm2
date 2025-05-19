'use client';
import { useCallback, useState } from 'react';

import { Loader2 } from 'lucide-react';

import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';

import { createOffer } from '../actions/createOffer';
import { toast } from 'sonner';

// Centralized UI text for localization
const UI_TEXT = {
  title: 'إضافة صورة للسلايدر',
  fields: {
    image: 'صورة السلايدر',
  },
  errors: {
    imageRequired: 'صورة السلايدر مطلوبة',
  },
  buttons: {
    submit: 'رفع الصورة',
    submitting: 'جاري الحفظ...',
  },
};

export default function AddOfferForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Handle file input changes (update signature)
  const handleFileSelect = useCallback((files: File[] | null) => {
    const file = files && files.length > 0 ? files[0] : null; // Get first file
    setImageFile(file);
    setErrors((prev) => ({ ...prev, imageUrl: '' }));
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!imageFile) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: UI_TEXT.errors.imageRequired,
        }));
        setLoading(false);
        return;
      }
      // Create FormData object
      const form = new FormData();
      form.append('image', imageFile);
      // Call the server action
      await createOffer(form);
      toast.success('تمت إضافة الصورة بنجاح!');
      setImageFile(null);
      // Optionally, trigger a refresh instead of reload
      // window.location.reload();
    } catch (e) {
      let errorMessage = 'Failed to add offer.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error('Error adding offer:', errorMessage);
      toast.error(errorMessage); // Also show error to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto mt-8 max-w-lg rounded-xl border border-primary/10 bg-background p-8 text-foreground shadow-lg'>
      <header className='mb-6 text-center'>
        <h2 className='mb-1 text-2xl font-bold text-primary'>{UI_TEXT.title}</h2>
        <p className='mt-1 text-base text-muted-foreground'>
          هذه الصورة ستظهر في السلايدر الرئيسي على الصفحة الرئيسية. الرجاء رفع صورة عالية الجودة
          (يفضل أبعاد 1200×500 بكسل).
        </p>
      </header>
      <form
        className='space-y-6'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className='mb-1 block text-sm font-medium text-foreground' htmlFor='image'>
            {UI_TEXT.fields.image}
          </label>
          <ImageUpload
            onImageUpload={handleFileSelect}
            error={errors.imageUrl}
            uploadLabel='اختر صورة للسلايدر أو اسحبها هنا'
            showInstruction={true}
            width={1200}
            height={500}
            maxSizeMB={2}
            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
            i18n={{
              uploadLabel: 'اسحب وأفلت الصورة هنا أو انقر للتحميل',
              chooseImage: 'اختر صورة',
              noImage: 'لا توجد صورة',
              previewTitle: 'معاينة الصورة',
              maxSize: 'الحد الأقصى للحجم: 2 ميجابايت',
              minDimensions: 'الأبعاد الدنيا: 1200×500',
              allowedTypes: 'الأنواع المسموحة: JPG, PNG, WEBP',
              errorFallback: 'تعذر تحميل الصورة',
              errorRejected: 'تم رفض الصورة',
            }}
            className='border-2 border-dashed border-primary/30 bg-muted/30 transition-all focus-within:border-primary/80 hover:border-primary/70'
            initialImage={imageFile ? URL.createObjectURL(imageFile) : undefined}
          />
          {errors.imageUrl && (
            <span className='mt-1 text-xs text-destructive'>{errors.imageUrl}</span>
          )}
          <p className='mt-2 text-xs text-muted-foreground'>
            يفضل رفع صورة أفقية واضحة بأبعاد 1200×500 بكسل.
          </p>
        </div>
        <div className='flex justify-center pt-2'>
          <Button
            type='submit'
            className='w-full rounded-lg bg-primary py-2 text-lg font-semibold text-white transition-colors hover:bg-primary/90 md:w-1/2'
            disabled={loading || !imageFile}
            aria-disabled={loading || !imageFile}
            aria-busy={loading}
          >
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <Loader2 className='h-5 w-5 animate-spin' />
                {UI_TEXT.buttons.submitting}
              </span>
            ) : (
              UI_TEXT.buttons.submit
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
