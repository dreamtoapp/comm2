'use server';
import { revalidatePath } from 'next/cache';

import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import db from '@/lib/prisma';
import { prevState } from '@/types/commonType';
import { Slugify } from '@/utils/slug';

/**
 * Update a product by ID with partial fields.
 * Revalidates product management and root paths for fresh data.
 * Throws with descriptive error if update fails.
 */
export async function updateProduct(_prevState: prevState, formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const size = formData.get('size') as string | null;
  const details = formData.get('details') as string | null;
  const image = formData.get('image') as File | null;
  const id = formData.get('id') as string;

  // جلب المنتج القديم دائمًا
  const oldProduct = await db.product.findUnique({ where: { id } });
  const oldImageUrl = oldProduct?.imageUrl || '';

  // رفع الصورة إذا وجدت
  let imageUrl = '';
  if (image) {
    const imageUrlData = await ImageToCloudinary(
      image,
      process.env.CLOUDINARY_UPLOAD_PRESET_PRODUCTS || '',
    );
    imageUrl = imageUrlData.result?.secure_url ?? '';
  }

  // تحديد الرابط النهائي للصورة
  const finalImageUrl = imageUrl !== '' ? imageUrl : oldImageUrl;

  // بناء بيانات التحديث
  const offerData = {
    name,
    price,
    size,
    details,
    slug: Slugify(name),
    imageUrl: finalImageUrl,
  };

  try {
    await db.product.update({ // Remove unused variable assignment
      where: { id },
      data: offerData,
    });
    // Revalidate relevant pages after update
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/products-control');
    revalidatePath('/');
    return { success: true, message: 'تم تحديث المنتج بنجاح' };
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('فشل تحديث المنتج');
  }
}
