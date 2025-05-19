'use server';

import prisma from '@/lib/prisma';

import type { SelectableProduct } from './get-products-for-select'; // Reuse the interface

export async function getProductsByIds(ids: string[]): Promise<SelectableProduct[]> {
  if (!ids || ids.length === 0) {
    return [];
  }

  try {
    const productsData = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
        images: true, // Assuming 'images' is a String[] field in Prisma
        price: true,
      },
    });

    // Preserve order of IDs if important, though findMany doesn't guarantee it.
    // For this use case, order might not matter as much as just getting the details.
    return productsData.map(product => ({
      id: product.id,
      name: product.name,
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
      price: product.price,
    }));
  } catch (error) {
    console.error('Failed to fetch products by IDs:', error);
    return []; // Return empty array on error
  }
}
