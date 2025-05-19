// app/dashboard/suppliers/actions/supplierActions.ts
'use server';
import db from '@/lib/prisma';

export async function getProducts(supplierId?: string) {
  return await db.product.findMany({
    where: supplierId ? { supplierId } : undefined,
  });
}

// Fetch a Single Product by ID
export async function getProductById(id: string) {
  return await db.product.findUnique({ where: { id } });
}

// Create or Update a Product
// export async function createOrUpdateProduct(id: string | null, data: any) {
//   if (id) {
//     await db.product.update({ where: { id }, data });
//   } else {
//     await db.product.create({ data });
//   }
// }

// Delete a Product
export async function deleteProduct(id: string) {
  // Check if the product is associated with any orders
  const orderCount = await db.order.count({
    where: {
      items: {
        some: {
          productId: id,
        },
      },
    },
  });

  if (orderCount > 0) {
    throw new Error('Cannot delete this product because it is linked to one or more orders.');
  }

  await db.product.delete({ where: { id } });
}
