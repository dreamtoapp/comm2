"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import db from '@/lib/prisma';
import { prevState } from '@/types/commonType';

const categorySchema = z.object({
  metaTitle: z.string().max(120, 'Meta title must be 120 characters or fewer').optional(),
  metaDescription: z.string().max(320, 'Meta description must be 320 characters or fewer').optional(),
  id: z.string().min(1, 'Category ID is required'),
  keywords: z.string().optional(),
});

export async function updateCategory(_prevState: prevState, formData: FormData) {
  const validatedFields = categorySchema.safeParse({
    id: formData.get('id'),
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    keywords: formData.get('keywords'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation Error',
      errors: validatedFields.error.flatten().fieldErrors,
      formError: null,
    };
  }

  const { id, metaTitle, metaDescription, keywords } = validatedFields.data;

  try {
    await db.category.update({
      where: { id },
      data: {
        metaTitle: metaTitle === '' ? null : metaTitle,
        metaDescription: metaDescription === '' ? null : metaDescription,
        keywords: keywords
          ? keywords === ''
            ? []
            : keywords.split(',').map((keyword: string) => keyword.trim())
          : [],
      },
    });

    revalidatePath(`/seo/categories`);

    return {
      success: true,
      message: 'Category updated successfully.',
      errors: {},
      formError: null,
    };

  } catch (e) {
    return {
      success: false,
      message: 'Database Error',
      errors: {},
      formError: 'A database error occurred while updating the category.',
    };
  }
}
