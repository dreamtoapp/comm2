'use server';
import db from '@/lib/prisma';

export async function getSupplierDetails(id: string) {
  const supplier = await db.supplier.findUnique({
    where: { id },
    include: {
      products: true, // Include related products
    },
  });

  if (!supplier) {
    throw new Error('Supplier not found.');
  }

  return {
    supplier,
    hasProducts: supplier.products.length > 0,
  };
}
