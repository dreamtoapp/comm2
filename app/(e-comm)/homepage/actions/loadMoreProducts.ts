'use server';

import { Prisma } from '@prisma/client'; // Import Prisma
import db from '@/lib/prisma';
import { Product } from '@/types/product';

// Simple server action to load more products
export async function loadMoreProducts(slug: string, page: number): Promise<Product[]> {
  // Calculate how many to skip based on page number
  const skip = page * 8;

  try {
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

    // Fetch next page of products
    const products = await db.product.findMany({
      where: whereClause,
      skip,
      take: 8,
      include: { supplier: true },
      orderBy: { createdAt: 'desc' },
    });

    // Add default image if needed and derive inStock
    return products.map((product) => ({
      ...product,
      details: product.details === null ? undefined : product.details,
      size: product.size === null ? undefined : product.size,
      rating: product.rating === null ? undefined : product.rating,
      imageUrl: product.imageUrl === null ? undefined : product.imageUrl || '/fallback/fallback.avif',
      supplier: product.supplier === null ? undefined : product.supplier,
      images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
      inStock: !product.outOfStock, // Derive inStock
    }));
  } catch (error) {
    console.error('Error loading more products:', error);
    return [];
  }
}
