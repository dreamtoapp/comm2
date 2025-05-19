'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(productId: string) {
  // Check for related transactions (order items)
  const relatedOrderItem = await db.orderItem.findFirst({ where: { productId } });
  if (relatedOrderItem) {
    throw new Error('لا يمكن حذف المنتج لأنه مرتبط بمعاملات أو طلبات.');
  }
  await db.product.delete({ where: { id: productId } });
  revalidatePath('/dashboard/products-control');
  revalidatePath('/dashboard/products'); // Revalidate the supplier-specific product list page
  return { success: true };
}
