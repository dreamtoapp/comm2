'use server';

import { Prisma } from '@prisma/client'; // Import Prisma
import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';
import { Product } from '@/types/product';

async function fetchPaginatedProductsFromDB(
  page: number = 1,
  limit: number = 20,
  slug: string = '',
): Promise<Product[]> {
  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

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

  // Fetch paginated products
  const products = await db.product.findMany({
    where: whereClause,
    skip,
    take: limit,
    include: { supplier: true },
    orderBy: { createdAt: 'desc' },
  });

  // Add default image if needed, ensure price is a valid number
  return products.map((product) => ({
    ...product,
    details: product.details === null ? undefined : product.details,
    size: product.size === null ? undefined : product.size,
    rating: product.rating === null ? undefined : product.rating,
    imageUrl: product.imageUrl === null ? undefined : product.imageUrl,
    supplier: product.supplier === null ? undefined : product.supplier,
    images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
    inStock: !product.outOfStock, // Derive inStock
    // Always return a string for imageUrl
    imageUrl: product.imageUrl === null ? undefined : (product.imageUrl as string),
    // Ensure price is a valid number
    price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
    // Ensure slug is available
    slug: product.slug || product.id,
  }));
}

// Cache the paginated products with a unique key based on page, limit, and slug
export const fetchPaginatedProducts = cacheData<
  [number?, number?, string?], // Args type
  Product[], // Return type
  typeof fetchPaginatedProductsFromDB // Function type T
>(
  fetchPaginatedProductsFromDB,
  ['fetchPaginatedProducts'],
  { revalidate: 3600 }, // Revalidate every hour
);
