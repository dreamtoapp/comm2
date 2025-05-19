'use server';
import db from '../../../../lib/prisma';

/**
 * Fetches a single product by its ID.
 */
export async function getProductById(productId: string) {
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        supplierId: true,
      },
    });

    if (!product) {
      throw new Error('Product not found.');
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product.');
  }
}
