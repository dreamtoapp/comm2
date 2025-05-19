'use server';
import { revalidatePath } from 'next/cache';

import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import db from '@/lib/prisma';
import { prevState } from '@/types/commonType';
import { Slugify } from '@/utils/slug';

export async function createOffer(_prevState: prevState, formData: FormData) {
  const name = formData.get('name') as string;
  const logoFile = (formData.get('logo') as File) || null;
  let imageUrl = '';

  if (logoFile) {
    const imageUrlData = await ImageToCloudinary(
      // formData.get("logo") as File,
      logoFile,
      process.env.CLOUDINARY_UPLOAD_PRESET_SUPPLIER || '',
    );

    imageUrl = imageUrlData.result?.secure_url ?? '';
  }

  const supplierData = {
    name: name,
    slug: Slugify(name),
    type: 'offer',
    ...(imageUrl ? { logo: imageUrl } : {}), // Only include logo if imageUrl is not empty
  };

  try {
    await db.supplier.create({
      data: supplierData,
    });

    revalidatePath('/dashboard/suppliers');
    revalidatePath('/');
    return { success: true, message: 'تم تحديث المعلومات' };
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw new Error('Failed to update supplier data.');
  }
}
