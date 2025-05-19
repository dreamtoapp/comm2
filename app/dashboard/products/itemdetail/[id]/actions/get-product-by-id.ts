'use server';

import db from '../../../../../../lib/prisma';

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { supplier: true }, // Include supplier details
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Add derived inStock field
    return { ...product, inStock: !product.outOfStock };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}
