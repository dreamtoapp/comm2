'use client';
import {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';

import ImageUpload from '@/components/image-upload';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import ReactSwal from '@/lib/swal-config';
import { Product } from '@/types/product';

import { updateProduct } from '../actions/update-product';

interface SimpleCategory {
  id: string;
  name: string;
}

interface UpdateProductFormProps {
  product: Product & { categoryAssignments?: { categoryId: string }[], features?: string[] };
  onSuccess?: () => void;
  categories: SimpleCategory[];
}

export default function UpdateProductForm({ product, onSuccess, categories }: UpdateProductFormProps) {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string | null>(product?.imageUrl || null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>(product?.images || []);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    product?.categoryAssignments?.map(ca => ca.categoryId) || []
  );
  const [errors] = useState<Record<string, string | undefined>>({}); // Consider using this for server errors

  // State for checkboxes, mirroring AddProductForm
  const [manageInventoryChecked, setManageInventoryChecked] = useState(product?.manageInventory ?? true);
  // Note: 'published', 'outOfStock', 'requiresShipping' are direct form fields,
  // their defaultChecked will be set from product data.

  const handleMainFileSelect = (files: File[] | null) => {
    const file = files && files.length > 0 ? files[0] : null;
    setMainImageFile(file);
    setMainPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleGalleryFileSelect = (files: File[] | null) => {
    if (files && files.length > 0) {
      setGalleryImageFiles(files);
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setGalleryPreviewUrls(newPreviewUrls);
    } else {
      setGalleryImageFiles([]);
      setGalleryPreviewUrls([]); // Or revert to product.images if user clears selection
    }
  };

  const [state, formAction, isPending] = useActionState(updateProduct, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success && state.message) {
      ReactSwal.fire({
        icon: 'success',
        title: 'تم تحديث المنتج بنجاح',
        text: state.message,
        timer: 2000,
        showConfirmButton: false,
        position: 'top',
        toast: true,
      });
      if (onSuccess) onSuccess();
    } else if (!state.success && state.message) {
      ReactSwal.fire({
        icon: 'error',
        title: 'خطأ في التحديث',
        text: state.message,
        confirmButtonText: 'حسنًا',
      });
    }
  }, [state, onSuccess]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (mainImageFile) {
      formData.append('image', mainImageFile, mainImageFile.name);
    }
    galleryImageFiles.forEach((file) => {
      formData.append('galleryImages', file, file.name);
    });
    selectedCategoryIds.forEach(catId => formData.append('categoryIds', catId));

    // Ensure checkbox values are sent correctly even if unchecked
    // HTML forms don't send unchecked checkbox values, so server action needs to handle this.
    // Or, we can add hidden fields, but server-side handling is cleaner.
    // For 'published', 'outOfStock', 'manageInventory', 'requiresShipping',
    // their values will be 'on' if checked, or not present if unchecked.
    // The server action already handles this with !!formData.get('fieldName') or === 'on'.

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <>
      <form
        className='space-y-6 rounded-xl border border-border bg-gradient-to-br from-background to-muted/60 p-4 shadow-xl'
        onSubmit={handleSubmit}
        autoComplete='off'
      >
        <input type='hidden' name='id' value={product.id} />

        {/* Section 1: Basic Information */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">1. المعلومات الأساسية</h3>
          <fieldset>
            <div className='flex flex-col justify-start gap-6 md:flex-row'>
              <div className='flex flex-1 flex-col items-center justify-center gap-2 md:items-start'>
                <ImageUpload
                  name='image'
                  initialImage={mainPreviewUrl}
                  onImageUpload={handleMainFileSelect}
                  aspectRatio={1}
                  maxSizeMB={2}
                  multiple={false}
                  allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
                  uploadLabel='صورة المنتج الرئيسية'
                  previewType='contain'
                  alt='صورة المنتج الرئيسية'
                  minDimensions={{ width: 300, height: 300 }}
                  required={true} // Main image is required
                />
              </div>
              <div className='mx-auto flex w-full max-w-2xl flex-[2] flex-col gap-4'>
                <InputField name='name' label='اسم المنتج' defaultValue={product.name} error={errors.name} className='w-full shadow-sm' required />
                <InputField name='price' label='السعر' type='number' defaultValue={product.price} step={0.01} className='flex-1 shadow-sm' required />
                <InputField name='compareAtPrice' label='السعر قبل الخصم (إن وجد)' type='number' defaultValue={product.compareAtPrice ?? undefined} step={0.01} className='flex-1 shadow-sm' />
                <InputField name='costPrice' label='سعر التكلفة (اختياري)' type='number' defaultValue={product.costPrice ?? undefined} step={0.01} className='flex-1 shadow-sm' />
                <InputField name='size' label='الحجم' defaultValue={product.size ?? ''} error={errors.size} className='w-full rounded-lg shadow-sm' />
                <TextareaField name='details' label='تفاصيل المنتج' defaultValue={product.details ?? ''} error={errors.details} className='min-h-[60px] w-full shadow-sm' rows={3} maxLength={300} />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Section: Product Gallery */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">معرض صور المنتج (اختياري)</h3>
          <ImageUpload
            name="galleryImages"
            initialImage={galleryPreviewUrls}
            onImageUpload={handleGalleryFileSelect}
            aspectRatio={1}
            maxSizeMB={2}
            multiple={true}
            maxFiles={10}
            allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
            uploadLabel="أضف أو استبدل صور المعرض (حتى 10 صور)"
            previewType="cover"
            alt="صور معرض المنتج"
          />
        </div>

        {/* Section: Categories */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">الأصناف</h3>
          <fieldset>
            <div className="space-y-2">
              <Label className="text-right block mb-1 font-medium">الأصناف (اختر واحدًا أو أكثر) <span className="text-red-500">*</span></Label>
              <div className="max-h-60 overflow-y-auto rounded-md border p-3 space-y-2 bg-input/30">
                {categories.length > 0 ? categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`category-update-${category.id}`}
                      checked={selectedCategoryIds.includes(category.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCategoryIds(prevIds =>
                          checked
                            ? [...prevIds, category.id]
                            : prevIds.filter(id => id !== category.id)
                        );
                      }}
                    />
                    <Label htmlFor={`category-update-${category.id}`} className="font-normal cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-2">لا توجد أصناف متاحة.</p>
                )}
              </div>
            </div>
          </fieldset>
        </div>

        {/* Section: Specifications */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">المواصفات</h3>
          <fieldset>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <InputField name='productCode' label='رمز المنتج (SKU)' defaultValue={product.productCode ?? ''} className='w-full shadow-sm' /> */}
              {/* <InputField name='gtin' label='GTIN (الرقم العالمي للمنتج)' defaultValue={product.gtin ?? ''} className='w-full shadow-sm' /> */}
              <InputField name='brand' label='العلامة التجارية' defaultValue={product.brand ?? ''} className='w-full shadow-sm' />
              <InputField name='material' label='الخامة' defaultValue={product.material ?? ''} className='w-full shadow-sm' />
              <InputField name='color' label='اللون' defaultValue={product.color ?? ''} className='w-full shadow-sm' />
              <InputField name='dimensions' label='الأبعاد' defaultValue={product.dimensions ?? ''} className='w-full shadow-sm' />
              <InputField name='weight' label='الوزن' defaultValue={product.weight ?? ''} className='w-full shadow-sm' />
            </div>
            <div className="mt-4">
              <TextareaField name='features' label='الميزات (افصل بينها بفاصلة)' defaultValue={product.features?.join(', ') ?? ''} className='min-h-[60px] w-full shadow-sm' rows={3} />
              <p className="text-[0.8rem] text-muted-foreground mt-1">أدخل الميزات مفصولة بفاصلة ( , )</p>
            </div>
          </fieldset>
        </div>

        {/* Section: Inventory, Shipping & Publishing */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">المخزون والشحن والنشر</h3>
          <fieldset>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="manageInventory-update" name="manageInventory" defaultChecked={product.manageInventory} onCheckedChange={(checkedState) => setManageInventoryChecked(Boolean(checkedState))} />
                <Label htmlFor="manageInventory-update" className="font-normal cursor-pointer">تتبع كمية المخزون</Label>
              </div>
              {manageInventoryChecked && (
                <InputField name='stockQuantity' label='كمية المخزون الحالية' type='number' defaultValue={product.stockQuantity ?? undefined} className='w-full md:w-1/2 shadow-sm' required={manageInventoryChecked} />
              )}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="outOfStock-update" name="outOfStock" defaultChecked={product.outOfStock} />
                <Label htmlFor="outOfStock-update" className="font-normal cursor-pointer">المنتج غير متوفر حاليًا</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="requiresShipping-update" name="requiresShipping" defaultChecked={product.requiresShipping} />
                <Label htmlFor="requiresShipping-update" className="font-normal cursor-pointer">هذا المنتج يتطلب شحن</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="published-update" name="published" defaultChecked={product.published} />
                <Label htmlFor="published-update" className="font-normal cursor-pointer">نشر المنتج</Label>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Actions */}
        {state.message && (
          <div className={`mt-4 rounded p-3 ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {state.message}
          </div>
        )}
        <div className='flex justify-end gap-2 pt-2'>
          <Button disabled={isPending} type='submit' className='min-w-[140px] bg-primary font-bold text-primary-foreground shadow-md hover:bg-primary/90'>
            {isPending ? 'جارٍ التعديل...' : 'تعديل المنتج'}
          </Button>
        </div>
      </form>
    </>
  );
}
