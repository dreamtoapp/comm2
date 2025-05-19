'use client';
import {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';

import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Tabs components are no longer needed
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@/components/ui/tabs';
import InputField from '../../../../components/InputField';
import TextareaField from '../../../../components/TextareaField';
import SupplierSelect from '../../products-control/components/SupplierSelect';
import { createProduct } from '../actions';

interface SimpleCategory {
  id: string;
  name: string;
}

interface AddProductFormProps {
  supplierId?: string;
  onSuccess?: () => void;
  categories: SimpleCategory[];
}

export default function AddProductForm({
  supplierId: initialSupplierId,
  onSuccess,
  categories,
}: AddProductFormProps) {
  const [supplierId, setSupplierId] = useState<string | null>(initialSupplierId ?? null);
  // State for single main image
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string | null>(null);
  // State for gallery images
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [errors] = useState<Record<string, string | undefined>>({});
  const [manageInventoryChecked, setManageInventoryChecked] = useState(true); // For conditional stockQuantity

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
      setGalleryPreviewUrls([]);
    }
  };

  const [state, addAction, isPending] = useActionState(createProduct, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success && state.message) {
      import('@/lib/swal-config').then(({ default: ReactSwal }) => {
        ReactSwal.fire({
          icon: 'success',
          title: 'تمت إضافة المنتج بنجاح',
          text: state.message,
          timer: 2000,
          showConfirmButton: false,
          position: 'top',
          toast: true,
        });
      });
      if (onSuccess) onSuccess();
    }
  }, [state, onSuccess]);

  // Determine if a supplier is effectively selected, either initially or by user action
  // This will now primarily control the submit button's disabled state
  const isSupplierEffectivelySelected = !!(initialSupplierId || supplierId);

  // Main form content, rendered if a supplier is selected or was provided initially.
  return (
    <form
      className='space-y-4 rounded-xl border border-border bg-gradient-to-br from-background to-muted/60 p-4 shadow-xl'
      onSubmit={(e) => {
        e.preventDefault();
        // Use internal supplierId state if initialSupplierId wasn't provided, otherwise use initialSupplierId
        const finalSupplierId = initialSupplierId || supplierId;
        if (!finalSupplierId) {
          import('@/lib/swal-config').then(({ default: ReactSwal }) => {
            ReactSwal.fire({
              icon: 'error',
              title: 'خطأ في الإدخال',
              text: 'يجب اختيار المورد أولاً.',
              confirmButtonText: 'حسنًا',
            });
          });
          return;
        }

        // Client-side validation for categories
        if (selectedCategoryIds.length === 0) {
          import('@/lib/swal-config').then(({ default: ReactSwal }) => {
            ReactSwal.fire({
              icon: 'error',
              title: 'خطأ في الإدخال',
              text: 'يجب اختيار صنف واحد على الأقل للمنتج.',
              confirmButtonText: 'حسنًا',
            });
          });
          return; // Prevent form submission
        }

        const formData = new FormData(e.currentTarget);
        formData.append('supplierId', finalSupplierId);
        selectedCategoryIds.forEach(catId => formData.append('categoryIds', catId));
        // Append main image file
        if (mainImageFile) {
          formData.append('image', mainImageFile, mainImageFile.name);
        }
        galleryImageFiles.forEach((file) => {
          formData.append('galleryImages', file, file.name);
        });
        startTransition(() => {
          addAction(formData);
        });
      }}
    >
      {/* Form sections will now be sequential */}
      <div className="space-y-6"> {/* Added a wrapper for spacing between cards */}

        {/* Supplier Selection - always visible if no initialSupplierId */}
        {!initialSupplierId && (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-foreground">اختيار المورد</h3>
            <SupplierSelect
              label="المورد" // Using the new label prop
              required={true} // Mark as required
              value={supplierId}
              onChange={setSupplierId}
            />
            {!supplierId && ( // Show message only if user hasn't selected one from the dropdown
              <div className='mt-2 text-sm text-destructive'>يرجى اختيار المورد لإكمال العملية.</div>
            )}
          </div>
        )}

        {/* Section 1: Basic Information */}
        {/* This section (and subsequent ones) will now always be rendered, 
            but submit button will be disabled if supplier isn't selected */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">1. المعلومات الأساسية</h3>
          <fieldset>
            <div className='flex flex-col justify-start gap-6 md:flex-row'>
              {/* Container for Main ImageUpload */}
              <div className='flex flex-1 flex-col items-center justify-center gap-2 md:items-start'>
                <ImageUpload
                  name='image' // Reverted to 'image' for single main file
                  initialImage={mainPreviewUrl} // Pass single URL
                  onImageUpload={handleMainFileSelect} // Use main file handler
                  aspectRatio={1}
                  maxSizeMB={2}
                  multiple={false} // Single file selection
                  allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
                  uploadLabel='صورة المنتج الرئيسية' // Clarify label
                  previewType='contain'
                  alt='صورة المنتج الرئيسية'
                  minDimensions={{ width: 300, height: 300 }}
                  required={true}
                />
              </div>
              <div className='mx-auto flex w-full max-w-2xl flex-[2] flex-col gap-4'>
                <InputField
                  name='name'
                  label='اسم المنتج'
                  placeholder='أدخل اسم المنتج'
                  error={errors.name}
                  className='w-full shadow-sm'
                  required={true}
                />
                <InputField
                  name='price'
                  label='السعر'
                  type='number'
                  placeholder='أدخل السعر'
                  error={errors.price}
                  className='flex-1 shadow-sm'
                  required={true}
                />
                <InputField
                  name='compareAtPrice'
                  label='السعر قبل الخصم (إن وجد)'
                  type='number'
                  placeholder='يُستخدم لإظهار سعر مشطوب بجانب سعر البيع'
                  error={errors.compareAtPrice}
                  className='flex-1 shadow-sm'
                />
                <InputField
                  name='costPrice'
                  label='سعر التكلفة (اختياري)'
                  type='number'
                  placeholder='أدخل سعر تكلفة المنتج'
                  error={errors.costPrice}
                  className='flex-1 shadow-sm'
                />
                <InputField
                  name='size'
                  label='الحجم'
                  placeholder='أدخل الحجم (مثل: 1 لتر، 500 مل)'
                  error={errors.size}
                  className='w-full rounded-lg shadow-sm'
                />
                <TextareaField
                  name='details'
                  label='تفاصيل المنتج'
                  placeholder='أدخل تفاصيل المنتج...'
                  error={errors.details}
                  className='min-h-[60px] w-full shadow-sm'
                  rows={3}
                  maxLength={300}
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Section 1.b: Product Gallery */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">معرض صور المنتج (اختياري)</h3>
          <fieldset>
            <ImageUpload
              name="galleryImages"
              initialImage={galleryPreviewUrls}
              onImageUpload={handleGalleryFileSelect}
              aspectRatio={1} // Or adjust as needed for gallery images
              maxSizeMB={2}
              multiple={true}
              maxFiles={10} // Changed to 10
              allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
              uploadLabel="أضف صورًا للمعرض (حتى 10 صور)" // Updated label
              previewType="cover" // 'cover' might be better for gallery thumbnails
              alt="صور معرض المنتج"
              required={false} // Gallery is optional
            />
          </fieldset>
        </div>

        {/* Section 2: Categories */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">2. الأصناف</h3>
          <fieldset>
            <div className="space-y-2">
              <Label className="text-right block mb-1 font-medium">الأصناف (اختر واحدًا أو أكثر) <span className="text-red-500">*</span></Label>
              <div className="max-h-60 overflow-y-auto rounded-md border p-3 space-y-2 bg-input/30">
                {categories.length > 0 ? categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategoryIds.includes(category.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCategoryIds(prevIds =>
                          checked
                            ? [...prevIds, category.id]
                            : prevIds.filter(id => id !== category.id)
                        );
                      }}
                    />
                    <Label htmlFor={`category-${category.id}`} className="font-normal cursor-pointer">
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

        {/* Section 3: Specifications */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-foreground">3. المواصفات</h3>
          <fieldset>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <InputField
                  name='productCode'
                  label='رمز المنتج (SKU)'
                  placeholder='أدخل رمز المنتج'
                  error={errors.productCode}
                  className='w-full shadow-sm'
                /> */}
              {/* <InputField
                  name='gtin'
                  label='GTIN (الرقم العالمي للمنتج)'
                  placeholder='أدخل UPC, EAN, ISBN, etc.'
                  error={errors.gtin}
                  className='w-full shadow-sm'
                /> */}
              <InputField
                name='brand'
                label='العلامة التجارية'
                placeholder='أدخل العلامة التجارية'
                error={errors.brand}
                className='w-full shadow-sm'
              />
              <InputField
                name='material'
                label='الخامة'
                placeholder='أدخل الخامة المصنوع منها المنتج'
                error={errors.material}
                className='w-full shadow-sm'
              />
              <InputField
                name='color'
                label='اللون'
                placeholder='أدخل لون المنتج'
                error={errors.color}
                className='w-full shadow-sm'
              />
              <InputField
                name='dimensions'
                label='الأبعاد (مثال: 10x5x2 سم)'
                placeholder='أدخل أبعاد المنتج'
                error={errors.dimensions}
                className='w-full shadow-sm'
              />
              <InputField
                name='weight'
                label='الوزن (مثال: 0.5 كجم)'
                placeholder='أدخل وزن المنتج'
                error={errors.weight}
                className='w-full shadow-sm'
              />
            </div>
            <div className="mt-4">
              <TextareaField
                name='features'
                label='الميزات (افصل بينها بفاصلة)'
                placeholder='مثال: مقاوم للماء، بطارية طويلة، شاشة لمس'
                error={errors.features}
                className='min-h-[60px] w-full shadow-sm'
                rows={3}
              />
              <p className="text-[0.8rem] text-muted-foreground mt-1">أدخل الميزات مفصولة بفاصلة ( , )</p>
            </div>
          </fieldset>
        </div>

        {/* Section 4: Inventory, Shipping & Publishing */}
        <div className="bg-card p-6 rounded-lg shadow-md"> {/* Changed to card, removed border-b */}
          <h3 className="text-xl font-semibold mb-6 text-foreground">4. المخزون والشحن والنشر</h3>
          <fieldset>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="manageInventory"
                  name="manageInventory"
                  checked={manageInventoryChecked}
                  onCheckedChange={(checkedState) => setManageInventoryChecked(Boolean(checkedState))}
                />
                <Label htmlFor="manageInventory" className="font-normal cursor-pointer">
                  تتبع كمية المخزون
                </Label>
              </div>
              {manageInventoryChecked && (
                <InputField
                  name='stockQuantity'
                  label='كمية المخزون الحالية'
                  type='number'
                  placeholder='أدخل الكمية المتوفرة'
                  error={errors.stockQuantity}
                  className='w-full md:w-1/2 shadow-sm'
                  required={manageInventoryChecked}
                />
              )}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="outOfStock" name="outOfStock" />
                <Label htmlFor="outOfStock" className="font-normal cursor-pointer">
                  المنتج غير متوفر حاليًا (نفذ من المخزون)
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="requiresShipping" name="requiresShipping" defaultChecked={true} />
                <Label htmlFor="requiresShipping" className="font-normal cursor-pointer">
                  هذا المنتج يتطلب شحن
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="published" name="published" />
                <Label htmlFor="published" className="font-normal cursor-pointer">
                  نشر المنتج (جعله مرئيًا للعملاء)
                </Label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      {/* Submit button and messages remain at the bottom of the form */}
      {state.message && (
        <div
          className={`mt-4 rounded p-3 ${state.success ? 'bg-emerald-600 text-white' : 'bg-destructive text-destructive-foreground'}`}
        >
          {state.message}
        </div>
      )}
      <div className='flex justify-end gap-2 pt-2'>
        <Button
          disabled={isPending || !isSupplierEffectivelySelected} // Submit button depends on supplier selection
          type='submit'
          className='min-w-[140px] bg-primary font-bold text-primary-foreground shadow-md hover:bg-primary/90'
        >
          {isPending ? 'جارٍ الإضافة...' : 'إضافة المنتج'}
        </Button>
      </div>
    </form>
  );
}
