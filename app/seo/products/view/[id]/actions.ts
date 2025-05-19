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


export async function getSeoProducById(id: string) { // New function
  try {
    const seoEntry = await db.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
      },
    });
    return seoEntry;
  } catch (error) {
    console.error(`Error fetching SEO entry with ID ${id}:`, error);
    return null; // Return null on error
  }
}