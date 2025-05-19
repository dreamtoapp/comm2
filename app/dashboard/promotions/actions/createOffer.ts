'use server';
import db from '@/lib/prisma';
import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils';

export async function createOffer(formData: FormData) {
  try {
    // Extract form data with proper type assertions
    const image = formData.get('image') as File; // Expecting image as File object
    const title = formData.get('title') as string || 'Special Offer'; // Default title if none provided

    let imageUrl = '';
    if (image) {
      // Use the correct preset for slider images
      const imageUrlData = await ImageToCloudinary(
        image,
        process.env.CLOUDINARY_UPLOAD_PRESET_SLIDER || '',
      );
      imageUrl = imageUrlData.result?.secure_url ?? '';
    }

    // Validate required fields
    if (!image) throw new Error('صورة العرض مطلوبة');

    // Generate slug
    let baseSlug = slugify(title);
    if (!baseSlug) {
      baseSlug = 'special-offer';
    }
    
    // Make sure slug is unique
    let slug = baseSlug;
    let counter = 1;
    
    while (await db.promotion.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newOffer = await db.promotion.create({
      data: {
        title,
        slug,
        imageUrl: imageUrl,
      },
    });

    // Revalidate the promotions page path after creating a new offer
    revalidatePath('/dashboard/promotions');
    revalidatePath('/');

    return newOffer;
  } catch (error) {
    console.error('Error creating offer:', error);
    return { message: 'حدث خطأ أثناء إنشاء العرض. يرجى المحاولة مرة أخرى.' };
  }
}
