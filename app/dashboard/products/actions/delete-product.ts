'use server';
import db from '../../../../lib/prisma';

/**
 * Deletes a product by its ID.
 */
export async function deleteProduct(productId: string) {
  try {
    await db.product.delete({
      where: { id: productId },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product.');
  }
}
