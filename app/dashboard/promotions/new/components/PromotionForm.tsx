'use client';
import {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react'; // Added useState

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { getProductsByIds } from '@/app/dashboard/products/actions'; // For fetching initial product details
import type { SelectableProduct } from '@/app/dashboard/products/actions/get-products-for-select';
import ImageUpload from '@/components/image-upload'; // Assuming for promotion image
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import { Badge } from '@/components/ui/badge'; // Added Badge import
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DiscountType,
  Promotion,
  PromotionType,
} from '@prisma/client';

// Info icon will be rendered by InfoTooltip
import { createPromotion } from '../../actions/createPromotion';
import { updatePromotion } from '../../actions/updatePromotion';
import ProductSelectorModal from '../../components/ProductSelectorModal'; // Import the modal

interface PromotionFormProps {
  initialData?: Promotion; // For editing
  // productsForSelect prop removed
}

export default function PromotionForm({ initialData }: PromotionFormProps) { // productsForSelect removed
  const router = useRouter();
  const isEditing = !!initialData;

  const formatDateForDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [selectedProducts, setSelectedProducts] = useState<SelectableProduct[]>([]);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  // State for currently selected promotion type to drive dynamic fields
  const [currentPromotionType, setCurrentPromotionType] = useState<PromotionType>(
    initialData?.type || PromotionType.PERCENTAGE_PRODUCT
  );

  const actionToUse = isEditing ? updatePromotion : createPromotion;
  const [state, formAction, isPending] = useActionState(actionToUse, {
    success: false,
    message: '',
    errors: undefined, // Changed from null to undefined to match optional type more closely
  });

  // Effect to load details for initially selected products when editing
  useEffect(() => {
    if (isEditing && initialData?.productIds && initialData.productIds.length > 0 && selectedProducts.length === 0) {
      const fetchInitialProductDetails = async () => {
        const products = await getProductsByIds(initialData.productIds);
        setSelectedProducts(products);
      };
      fetchInitialProductDetails();
    }
    // Only run on mount if editing and initial products are present but not yet loaded into selectedProducts state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, initialData?.productIds]);


  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      router.push('/dashboard/promotions');
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleImageSelect = (files: File[] | null) => {
    const file = files && files.length > 0 ? files[0] : null;
    setImageFile(file);
    setImageUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (isEditing && initialData) {
      formData.append('id', initialData.id);
    }
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    } else if (imageUrl === null && initialData?.imageUrl) {
      formData.append('removeImage', 'true');
    }
    // Use selectedProducts to get IDs for submission
    formData.append('productIds', selectedProducts.map(p => p.id).join(','));
    startTransition(() => {
      formAction(formData);
    });
  };

  // Get enum values for select options
  const promotionTypeOptions = Object.values(PromotionType);
  const discountTypeOptions = Object.values(DiscountType);

  // Helper to get Arabic display name for PromotionType
  const getPromotionTypeDisplay = (type: PromotionType): string => {
    switch (type) {
      case PromotionType.PERCENTAGE_PRODUCT: return 'خصم نسبة على منتجات محددة';
      case PromotionType.FIXED_PRODUCT: return 'خصم مبلغ ثابت على منتجات محددة';
      case PromotionType.PERCENTAGE_ORDER: return 'خصم نسبة على إجمالي الطلب';
      case PromotionType.FIXED_ORDER: return 'خصم مبلغ ثابت على إجمالي الطلب';
      case PromotionType.FREE_SHIPPING: return 'شحن مجاني';
      default: return type; // Fallback to the enum key if not mapped
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 rounded-xl border border-border bg-card p-6 shadow-lg md:p-8'
    >
      <InputField name="title" label="عنوان العرض" defaultValue={initialData?.title || ''} required />
      <TextareaField name="description" label="الوصف (اختياري)" defaultValue={initialData?.description || ''} rows={3} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Label htmlFor="type">نوع العرض</Label>
            <InfoTooltip
              title="أنواع العروض:"
              content={
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong>خصم نسبة على منتجات:</strong> يطبق خصمًا مئويًا على منتجات محددة.</li>
                  <li><strong>خصم مبلغ ثابت على منتجات:</strong> يخصم مبلغًا ثابتًا من سعر منتجات محددة.</li>
                  <li><strong>خصم نسبة على إجمالي الطلب:</strong> يطبق خصمًا مئويًا على إجمالي قيمة الطلب.</li>
                  <li><strong>خصم مبلغ ثابت على إجمالي الطلب:</strong> يخصم مبلغًا ثابتًا من إجمالي قيمة الطلب.</li>
                  <li><strong>شحن مجاني:</strong> يوفر شحنًا مجانيًا للطلب.</li>
                </ul>
              }
            />
          </div>
          <Select
            name="type"
            defaultValue={currentPromotionType}
            onValueChange={(value) => setCurrentPromotionType(value as PromotionType)}
          >
            <SelectTrigger id="type"><SelectValue placeholder="اختر نوع العرض" /></SelectTrigger>
            <SelectContent>
              {promotionTypeOptions.map(typeValue => (
                <SelectItem key={typeValue} value={typeValue}>
                  {getPromotionTypeDisplay(typeValue)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Discount Value Field */}
        {(currentPromotionType === PromotionType.PERCENTAGE_PRODUCT ||
          currentPromotionType === PromotionType.FIXED_PRODUCT ||
          currentPromotionType === PromotionType.PERCENTAGE_ORDER ||
          currentPromotionType === PromotionType.FIXED_ORDER) && (
            <InputField
              name="discountValue"
              label={
                currentPromotionType === PromotionType.PERCENTAGE_PRODUCT || currentPromotionType === PromotionType.PERCENTAGE_ORDER
                  ? "نسبة الخصم (%)"
                  : "مبلغ الخصم (ر.س)"
              }
              type="number"
              step="0.01"
              defaultValue={initialData?.discountValue?.toString() || ''}
              placeholder={
                currentPromotionType === PromotionType.PERCENTAGE_PRODUCT || currentPromotionType === PromotionType.PERCENTAGE_ORDER
                  ? "مثال: 10 (لـ 10%)"
                  : "مثال: 50 (لـ 50 ر.س)"
              }
              required
            />
          )}

        {/* Conditional Discount Type Field (often implicit from PromotionType, but can be explicit) */}
        {/* For simplicity, we can make DiscountType hidden and automatically set based on PromotionType,
            or only show it if PromotionType allows both (which our current setup doesn't explicitly do).
            Let's hide it for now if it's directly implied by PromotionType.
            If PromotionType is PERCENTAGE_*, discountType is PERCENTAGE.
            If PromotionType is FIXED_*, discountType is FIXED_AMOUNT.
            FREE_SHIPPING doesn't need it.
        */}
        {(currentPromotionType === PromotionType.PERCENTAGE_PRODUCT ||
          currentPromotionType === PromotionType.FIXED_PRODUCT ||
          currentPromotionType === PromotionType.PERCENTAGE_ORDER ||
          currentPromotionType === PromotionType.FIXED_ORDER) && (
            <input
              type="hidden"
              name="discountType"
              value={
                currentPromotionType === PromotionType.PERCENTAGE_PRODUCT || currentPromotionType === PromotionType.PERCENTAGE_ORDER
                  ? DiscountType.PERCENTAGE
                  : DiscountType.FIXED_AMOUNT
              }
            />
            // Optionally, display the implied discount type as read-only text if helpful, or remove the Select below.
            // For now, keeping the original Select but it will be redundant if we use hidden input.
            // A better UX might be to remove the DiscountType select entirely and derive it in the server action.
          )}
        {/* The original DiscountType select - can be removed or made read-only based on currentPromotionType */}
        {(currentPromotionType !== PromotionType.FREE_SHIPPING) && (
          <div>
            <Label htmlFor="discountType" className={(currentPromotionType === PromotionType.PERCENTAGE_PRODUCT || currentPromotionType === PromotionType.FIXED_PRODUCT || currentPromotionType === PromotionType.PERCENTAGE_ORDER || currentPromotionType === PromotionType.FIXED_ORDER) ? 'opacity-50' : ''}>
              نوع قيمة الخصم (تلقائي)
            </Label>
            <Select
              name="discountType"
              value={ // Controlled value
                (currentPromotionType === PromotionType.PERCENTAGE_PRODUCT || currentPromotionType === PromotionType.PERCENTAGE_ORDER)
                  ? DiscountType.PERCENTAGE
                  : (currentPromotionType === PromotionType.FIXED_PRODUCT || currentPromotionType === PromotionType.FIXED_ORDER)
                    ? DiscountType.FIXED_AMOUNT
                    : initialData?.discountType || DiscountType.PERCENTAGE // Fallback for other types if any, or default
              }
              disabled={ // Disable if implied by PromotionType
                currentPromotionType === PromotionType.PERCENTAGE_PRODUCT ||
                currentPromotionType === PromotionType.FIXED_PRODUCT ||
                currentPromotionType === PromotionType.PERCENTAGE_ORDER ||
                currentPromotionType === PromotionType.FIXED_ORDER
              }
            >
              <SelectTrigger id="discountType"><SelectValue placeholder="اختر نوع القيمة" /></SelectTrigger>
              <SelectContent>
                {discountTypeOptions.map(typeValue => (
                  <SelectItem key={typeValue} value={typeValue}>{typeValue === DiscountType.PERCENTAGE ? 'نسبة مئوية (%)' : 'مبلغ ثابت (ر.س)'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Product Selection Section */}
      <div>
        {/* Label for Product Selection - this one is fine as it's not directly for an InputField */}
        <div className="flex items-center gap-1 mb-1">
          <Label htmlFor="productSelection">المنتجات المستهدفة</Label>
          <InfoTooltip
            content={
              <>
                اختر المنتجات التي ينطبق عليها هذا العرض. <br />
                ينطبق هذا إذا كان "نوع العرض" يستهدف منتجات محددة. <br />
                اتركه فارغًا إذا كان العرض على مستوى الطلب (مثل خصم على إجمالي الطلب أو شحن مجاني).
              </>
            }
          />
        </div>
        <div className="p-3 border rounded-md min-h-[60px] bg-muted/30">
          {selectedProducts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map(product => (
                <Badge key={product.id} variant="secondary" className="text-xs">
                  {product.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 rtl:mr-1 rtl:ml-0 p-0"
                    onClick={() => setSelectedProducts(prev => prev.filter(p => p.id !== product.id))}
                  >
                    &times;
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">لم يتم اختيار منتجات.</p>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setIsProductSelectorOpen(true)} className="mt-2">
          اختيار المنتجات ({selectedProducts.length})
        </Button>
        <ProductSelectorModal
          isOpen={isProductSelectorOpen}
          onOpenChange={setIsProductSelectorOpen}
          initialSelectedProductIds={
            // If selectedProducts has items, use their IDs. Otherwise, use initialData.productIds (for edit mode initial load)
            selectedProducts.length > 0
              ? selectedProducts.map(p => p.id)
              : (initialData?.productIds || [])
          }
          onProductsSelected={(newlySelectedFullProducts) => {
            setSelectedProducts(newlySelectedFullProducts);
          }}
        // allProducts prop removed
        />
        {/* Hidden input to submit productIds if needed by form structure, or handle in JS */}
        {/* <input type="hidden" name="productIds" value={selectedProductIds.join(',')} /> */}
        {/* productIds are already added to formData in handleSubmit */}
      </div>

      {/* <div>
        <InputField
          name="couponCode"
          label="كود الخصم (اختياري)"
          defaultValue={initialData?.couponCode || ''}
          placeholder="مثال: RAMADAN25"
          labelSuffix={
            <InfoTooltip
              content={
                <>
                  إذا أدخلت كود هنا، يجب على العميل استخدام هذا الكود لتفعيل العرض. <br />
                  اتركه فارغًا إذا كان العرض يطبق تلقائيًا بدون كود. <br />
                  يجب أن يكون الكود فريدًا. مثال: RAMADAN25
                </>
              }
            />
          }
        />
      </div> */}

      <div>
        <InputField
          name="minimumOrderValue"
          label="الحد الأدنى لقيمة الطلب (اختياري)"
          type="number"
          step="0.01"
          defaultValue={initialData?.minimumOrderValue?.toString() || ''}
          placeholder="مثال: 100"
          labelSuffix={
            <InfoTooltip
              content={
                <>
                  إذا تم تحديد قيمة، يجب أن يتجاوز إجمالي طلب العميل هذا المبلغ لتفعيل العرض. <br />
                  مفيد لعروض مثل "خصم 10% على الطلبات فوق 200 ر.س" أو "شحن مجاني للطلبات فوق 150 ر.س". <br />
                  اتركه فارغًا إذا لم يكن هناك حد أدنى.
                </>
              }
            />
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          name="startDate"
          label="تاريخ البدء (اختياري)"
          type="datetime-local"
          defaultValue={
            initialData?.startDate
              ? formatDateForDateTimeLocal(new Date(initialData.startDate))
              : formatDateForDateTimeLocal(new Date()) // Default to current date/time for new forms
          }
        />
        <InputField
          name="endDate"
          label="تاريخ الانتهاء (اختياري)"
          type="datetime-local"
          defaultValue={
            initialData?.endDate
              ? formatDateForDateTimeLocal(new Date(initialData.endDate))
              : '' // Default to empty for new forms, as it's optional
          }
        />
      </div>

      <div>
        <div className="flex items-center gap-1 mb-1">
          <Label htmlFor="image-upload">صورة العرض (اختياري)</Label>
          <InfoTooltip
            content={
              <>
                لأفضل ظهور، استخدم صورة عرضية بأبعاد 800x450 بكسل (نسبة 16:9) أو أكبر، وبجودة عالية. <br />
                الحجم الأقصى 2 ميجابايت. <br />
                الأنواع المسموحة: JPG, PNG, WEBP.
              </>
            }
          />
        </div>
        <ImageUpload
          name="image-upload"
          initialImage={imageUrl}
          onImageUpload={handleImageSelect}
          aspectRatio={16 / 9}
          maxSizeMB={2}
          minDimensions={{ width: 800, height: 450 }}
          uploadLabel="تحميل صورة العرض"
        />
      </div>

      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Checkbox id="active" name="active" defaultChecked={initialData?.active ?? false} />
        <Label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          العرض فعال؟
        </Label>
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/promotions')}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-[120px]">
          {isPending ? 'جارٍ الحفظ...' : (isEditing ? 'حفظ التعديلات' : 'إنشاء العرض')}
        </Button>
      </div>
    </form>
  );
}
