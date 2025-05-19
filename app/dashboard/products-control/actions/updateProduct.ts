'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface UpdateProductInput {
  id: string;
  name?: string;
  price?: number;
  size?: string;
  details?: string;
  imageUrl?: string;
  supplierId?: string;
  published?: boolean;
  outOfStock?: boolean;
}

export async function updateProduct(data: UpdateProductInput) {
  const { id, ...update } = data;
  const product = await db.product.update({
    where: { id },
    data: update,
  });
  revalidatePath('/dashboard/products-control');
  return product;
}
