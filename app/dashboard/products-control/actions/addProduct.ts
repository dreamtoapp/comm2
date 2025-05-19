'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface AddProductInput {
  name: string;
  price: number;
  size?: string;
  details?: string;
  imageUrl?: string;
  supplierId: string;
  published?: boolean;
  outOfStock?: boolean;
}

export async function addProduct(data: AddProductInput) {
  const product = await db.product.create({
    data: {
      name: data.name,
      price: data.price,
      size: data.size,
      details: data.details,
      imageUrl: data.imageUrl,
      supplierId: data.supplierId,
      published: data.published ?? false,
      outOfStock: data.outOfStock ?? false,
    },
  });
  revalidatePath('/dashboard/products-control');
  return product;
}
