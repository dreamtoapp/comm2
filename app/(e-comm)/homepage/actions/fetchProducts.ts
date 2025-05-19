'use server';

import { Prisma } from '@prisma/client'; // Import Prisma
import db from '@/lib/prisma';

async function fetchProductsFromDB(slug?: string, limit?: number) {
  // Find supplier if slug is provided
  const whereClause: Prisma.ProductWhereInput = { published: true }; // Use const

  if (slug && slug.trim() !== '') {
    const supplier = await db.supplier.findFirst({
      where: { slug },
      select: { id: true },
    });

    if (supplier) {
      whereClause.supplierId = supplier.id;
    }
  }

  // Fetch products with optional limit
  const products = await db.product.findMany({
    where: whereClause,
    include: { supplier: true },
    ...(limit ? { take: limit } : {}),
    orderBy: { createdAt: 'desc' },
  });

  return products.map((product) => ({
    ...product,
    imageUrl: product.imageUrl || 'https://via.placeholder.com/150', // Default image if null
  }));
}

// Don't use cache for this function as it can exceed the 2MB limit
export const fetchProducts = fetchProductsFromDB;
