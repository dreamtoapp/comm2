'use server';

import { revalidatePath } from 'next/cache';

import db from '@/lib/prisma';

export async function updateProduct(id: string, metaTitle: string, metaDescription: string, tags: string[]) {
  try {
    await db.product.update({
      where: { id: id },
      data: {
        metaTitle: metaTitle,
        metaDescription: metaDescription,
        tags: tags,
      },
    });

    // Revalidate the specific dynamic page path
    revalidatePath(`/dashboard/products/edit/${id}`, 'page');
    return { message: 'Product updated successfully!' };
  } catch (error) {
    console.error('Error updating product:', error);
    return { message: 'Failed to update product.' };
  }
}
