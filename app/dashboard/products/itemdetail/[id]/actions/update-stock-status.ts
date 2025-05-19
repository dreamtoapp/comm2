'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateStockStatus(productId: string, outOfStock: boolean) {
  try {
    const updated = await db.product.update({
      where: { id: productId },
      data: { outOfStock },
    });
    // Revalidate product detail and main product list
    revalidatePath(`/dashboard/products/itemdetail/${productId}`);
    revalidatePath(`/`);
    return { success: true, outOfStock: updated.outOfStock };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
