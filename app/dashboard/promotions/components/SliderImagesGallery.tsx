'use client';
import React, { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';

import { Eye } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
import { removeSliderImage } from '../actions/removeSliderImage';
// Removed Icon import: import { Icon } from '@/components/icons';

interface SliderImage {
  id: string;
  imageUrl: string | null;
  createdAt: Date | string;
}

interface SliderImagesGalleryProps {
  images: SliderImage[];
}

const SliderImagesGallery: React.FC<SliderImagesGalleryProps> = ({ images }) => {
  const [dialogOpenId, setDialogOpenId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function handleDelete(id: string) {
    await removeSliderImage(id);
    setDialogOpenId(null);
  }

  function handlePreview(imageUrl: string) {
    setPreviewImage(imageUrl);
  }

  function closePreview() {
    setPreviewImage(null);
  }

  if (!images || images.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <svg width='120' height='80' viewBox='0 0 120 80' fill='none' className='mb-4 opacity-60'>
          <rect x='10' y='20' width='100' height='50' rx='8' fill='#f3f4f6' />
          <circle cx='35' cy='45' r='8' fill='#e5e7eb' />
          <rect x='60' y='40' width='30' height='10' rx='3' fill='#e5e7eb' />
        </svg>
        <div className='mb-2 text-lg text-muted-foreground'>لا توجد صور في السلايدر بعد.</div>
        <div className='mb-4 text-sm text-muted-foreground'>
          يمكنك إضافة صورة جديدة للسلايدر من خلال النموذج أعلاه.
        </div>
        <a
          href='#add-offer-form'
          className='inline-block rounded bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40'
        >
          إضافة صورة جديدة
        </a>
      </div>
    );
  }
  return (
    <>
      <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
        {images.map((img) => (
          <div
            key={img.id}
            className='flex flex-col items-center overflow-hidden rounded-xl border border-primary/10 bg-card p-4 shadow-md transition-shadow hover:shadow-lg'
          >
            <div
              className='group relative aspect-[12/5] w-full cursor-pointer overflow-hidden rounded-lg bg-muted focus-within:ring-2 focus-within:ring-primary/50'
              onClick={() => handlePreview(img.imageUrl || '')}
              title='عرض الصورة بالحجم الكامل'
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handlePreview(img.imageUrl || '');
              }}
              role='button'
              aria-label='عرض الصورة بالحجم الكامل'
            >
              <Image
                src={img.imageUrl || ''}
                alt='صورة السلايدر'
                fill
                className='object-cover transition-opacity group-hover:opacity-80'
                sizes='(max-width: 768px) 100vw, 33vw'
                priority={false}
                onError={(e) => (e.currentTarget.src = '/fallback/fallback.webp')}
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100'>
                <Eye className={iconVariants({ size: 'lg', className: 'text-white' })} /> {/* Use direct import + CVA */}
              </div>
            </div>
            <div className='mt-3 text-xs text-muted-foreground'>
              {new Date(img.createdAt).toLocaleString('ar-EG', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
            <Button
              variant='destructive'
              size='sm'
              className='mt-3'
              onClick={() => setDialogOpenId(img.id)}
              aria-label='حذف صورة السلايدر'
            >
              حذف
            </Button>
            <Dialog
              open={dialogOpenId === img.id}
              onOpenChange={(open) => setDialogOpenId(open ? img.id : null)}
            >
              <DialogContent dir='rtl'>
                <DialogTitle>تأكيد حذف الصورة</DialogTitle>
                <div className='py-2 text-sm text-muted-foreground'>
                  هل أنت متأكد أنك تريد حذف هذه الصورة من السلايدر؟ لا يمكن التراجع عن هذا الإجراء.
                </div>
                <DialogFooter className='flex flex-row-reverse gap-2'>
                  <Button variant='destructive' onClick={() => handleDelete(img.id)}>
                    نعم، حذف
                  </Button>
                  <Button variant='outline' onClick={() => setDialogOpenId(null)}>
                    إلغاء
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={closePreview}>
        <DialogContent className='flex max-w-2xl flex-col items-center justify-center' dir='rtl'>
          <DialogTitle>معاينة الصورة</DialogTitle>
          {previewImage && (
            <div className='flex w-full items-center justify-center'>
              <Image
                src={previewImage}
                alt='معاينة الصورة بالحجم الكامل'
                width={900}
                height={375}
                className='rounded-lg bg-black object-contain'
                style={{ maxHeight: 400, width: 'auto', maxWidth: '100%' }}
                priority
                onError={(e) => (e.currentTarget.src = '/fallback/fallback.webp')}
              />
            </div>
          )}
          <Button variant='outline' onClick={closePreview} className='mt-4'>
            إغلاق
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SliderImagesGallery;
