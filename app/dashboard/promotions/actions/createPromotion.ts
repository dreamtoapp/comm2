'use server';
import { revalidatePath } from 'next/cache';
import { Prisma, PromotionType, DiscountType } from '@prisma/client';
import db from '@/lib/prisma';
import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import { slugify } from '@/lib/utils';

interface PrevState {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | null>; // Field-specific errors
}

export async function createPromotion(prevState: PrevState, formData: FormData): Promise<PrevState> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const type = formData.get('type') as PromotionType | null;
  const discountValueStr = formData.get('discountValue') as string | null;
  const discountType = formData.get('discountType') as DiscountType | null;
  const productIdsStr = formData.get('productIds') as string | null;
  // const couponCode = formData.get('couponCode') as string | null; // Commented out
  const minimumOrderValueStr = formData.get('minimumOrderValue') as string | null;
  const startDateStr = formData.get('startDate') as string | null;
  const endDateStr = formData.get('endDate') as string | null;
  const imageFile = formData.get('image') as File | null;
  const active = formData.get('active') === 'on'; // Checkbox value is 'on' or null

  // --- Validation ---
  if (!title) return { success: false, message: "عنوان العرض مطلوب.", errors: { title: ["العنوان مطلوب"] } };
  if (!type) return { success: false, message: "نوع العرض مطلوب.", errors: { type: ["النوع مطلوب"] } };

  let discountValue: number | null = null;
  if (discountValueStr) {
    discountValue = parseFloat(discountValueStr);
    if (isNaN(discountValue)) return { success: false, message: "قيمة الخصم يجب أن تكون رقمًا.", errors: { discountValue: ["قيمة غير صالحة"] } };
  }

  // Discount type is required if discount value is present
  if (discountValue !== null && !discountType) {
    return { success: false, message: "نوع قيمة الخصم مطلوب عند إدخال قيمة للخصم.", errors: { discountType: ["مطلوب"] } };
  }

  // Validate product IDs if provided
  let productIds: string[] = [];
  if (productIdsStr && productIdsStr.trim() !== '') {
    productIds = productIdsStr.split(',').map(id => id.trim()).filter(id => id);
    // Optional: Further validation to check if these product IDs exist in DB
  }

  let minimumOrderValue: number | null = null;
  if (minimumOrderValueStr) {
    minimumOrderValue = parseFloat(minimumOrderValueStr);
    if (isNaN(minimumOrderValue)) return { success: false, message: "الحد الأدنى لقيمة الطلب يجب أن يكون رقمًا.", errors: { minimumOrderValue: ["قيمة غير صالحة"] } };
  }

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  if (startDate && endDate && startDate >= endDate) {
    return { success: false, message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.", errors: { endDate: ["يجب أن يكون بعد تاريخ البدء"] } };
  }

  // --- Image Upload ---
  let imageUrl: string | undefined = undefined;
  if (imageFile && imageFile.size > 0) {
    try {
      const imageData = await ImageToCloudinary(
        imageFile,
        process.env.CLOUDINARY_UPLOAD_PRESET_PROMOTIONS || 'default_preset_for_promotions' // Use a specific preset
      );
      if (imageData.result?.secure_url) {
        imageUrl = imageData.result.secure_url;
      } else {
        console.warn("Promotion image upload failed, but proceeding without image:", imageData.error);
      }
    } catch (uploadError) {
      console.error("Error uploading promotion image:", uploadError);
    }
  }

  // Generate slug from title
  let baseSlug = slugify(title);
  if (!baseSlug) {
    // Fallback if title doesn't produce a valid slug
    baseSlug = 'promotion-' + Date.now().toString();
  }

  // Ensure slug is unique
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug already exists
  while (await db.promotion.findFirst({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // --- Prepare Data for Prisma ---
  const promotionData: Prisma.PromotionCreateInput = {
    title,
    slug, // Add the generated slug
    description: description || undefined,
    type,
    discountValue,
    discountType,
    productIds,
    // couponCode: couponCode || undefined, // Commented out
    minimumOrderValue,
    startDate,
    endDate,
    active,
    imageUrl,
  };
  // if (!promotionData.couponCode) delete promotionData.couponCode; // Commented out as couponCode is removed from promotionData

  try {
    await db.promotion.create({ data: promotionData });
    revalidatePath('/dashboard/promotions');
    return { success: true, message: 'تم إنشاء العرض بنجاح!' };
  } catch (error: unknown) {
    console.error('Error creating promotion:', error);
    // Commented out couponCode specific error handling
    // if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (error.code === 'P2002' && error.meta?.target === 'Promotion_couponCode_key') {
    //     return { success: false, message: 'كود الخصم هذا مستخدم بالفعل. يرجى اختيار كود آخر.', errors: { couponCode: ["مستخدم بالفعل"] } };
    //   }
    // }
    return { success: false, message: 'فشل إنشاء العرض. يرجى المحاولة مرة أخرى.' };
  }
  // Fallback return to satisfy TypeScript, though ideally all paths are covered.
  return { success: false, message: 'حدث خطأ غير متوقع وغير معالج.' };
}
