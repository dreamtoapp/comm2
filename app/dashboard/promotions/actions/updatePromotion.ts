'use server';
import { revalidatePath } from 'next/cache';
import { Prisma, PromotionType, DiscountType } from '@prisma/client';
import db from '@/lib/prisma';
import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import { slugify } from '@/lib/utils';

interface PrevState {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | null>;
}

export async function updatePromotion(prevState: PrevState, formData: FormData): Promise<PrevState> {
  const id = formData.get('id') as string;
  if (!id) {
    return { success: false, message: "معرف العرض مفقود." };
  }

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
  const removeImage = formData.get('removeImage') === 'true';
  const active = formData.get('active') === 'on';

  // --- Validation ---
  if (!title) return { success: false, message: "عنوان العرض مطلوب.", errors: { title: ["العنوان مطلوب"] } };
  if (!type) return { success: false, message: "نوع العرض مطلوب.", errors: { type: ["النوع مطلوب"] } };

  let discountValue: number | null = null;
  if (discountValueStr) {
    discountValue = parseFloat(discountValueStr);
    if (isNaN(discountValue)) return { success: false, message: "قيمة الخصم يجب أن تكون رقمًا.", errors: { discountValue: ["قيمة غير صالحة"] } };
  }
  if (discountValue !== null && !discountType) {
    return { success: false, message: "نوع قيمة الخصم مطلوب عند إدخال قيمة للخصم.", errors: { discountType: ["مطلوب"] } };
  }

  let productIds: string[] = [];
  if (productIdsStr && productIdsStr.trim() !== '') {
    productIds = productIdsStr.split(',').map(id => id.trim()).filter(id => id);
  }

  let minimumOrderValue: number | null = null;
  if (minimumOrderValueStr) {
    minimumOrderValue = parseFloat(minimumOrderValueStr);
    if (isNaN(minimumOrderValue)) return { success: false, message: "الحد الأدنى لقيمة الطلب يجب أن تكون رقمًا.", errors: { minimumOrderValue: ["قيمة غير صالحة"] } };
  }

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;
  if (startDate && endDate && startDate >= endDate) {
    return { success: false, message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.", errors: { endDate: ["يجب أن يكون بعد تاريخ البدء"] } };
  }

  // Get existing promotion to check if title changed
  const existingPromotion = await db.promotion.findUnique({
    where: { id },
    select: { title: true, slug: true }
  });

  if (!existingPromotion) {
    return { success: false, message: "العرض غير موجود." };
  }

  // Generate new slug only if title changed
  let slug = existingPromotion.slug;
  if (title !== existingPromotion.title) {
    let baseSlug = slugify(title);
    if (!baseSlug) {
      baseSlug = 'promotion-' + Date.now().toString();
    }

    // Check if this new slug already exists for a different promotion
    slug = baseSlug;
    let counter = 1;
    while (await db.promotion.findFirst({ 
      where: { 
        slug, 
        id: { not: id } 
      } 
    })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // --- Upload new image if provided ---
  let imageUrl: string | undefined = undefined;
  if (imageFile && imageFile.size > 0) {
    try {
      const imageData = await ImageToCloudinary(
        imageFile,
        process.env.CLOUDINARY_UPLOAD_PRESET_PROMOTIONS || 'default_preset_for_promotions'
      );
      imageUrl = imageData.result?.secure_url;
    } catch (error) {
      console.error('Error uploading promotion image:', error);
    }
  }

  // --- Prepare Update Data ---
  const updateData: Prisma.PromotionUpdateInput = {
    title,
    slug,
    description: description ?? undefined,
    type,
    discountValue,
    discountType,
    productIds,
    // couponCode: couponCode || undefined, // Commented out
    minimumOrderValue,
    startDate,
    endDate,
    active,
  };

  // Only update image if a new one was uploaded or if remove flag is set
  if (imageUrl) {
    updateData.imageUrl = imageUrl;
  } else if (removeImage) {
    updateData.imageUrl = null;
  }

  try {
    await db.promotion.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/dashboard/promotions');
    return { success: true, message: "تم تحديث العرض بنجاح!" };
  } catch (error) {
    console.error('Error updating promotion:', error);
    return { success: false, message: "فشل تحديث العرض. يرجى المحاولة مرة أخرى." };
  }
}
