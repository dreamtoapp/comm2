'use server';

import db from '@/lib/prisma';

export async function debugProductSlugs() {
  try {
    // Get all products with their slugs
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 20, // Limit to 20 products for brevity
    });

    return {
      success: true,
      products,
      count: products.length,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: 'Failed to fetch products',
    };
  }
}

export async function findProductBySlug(slug: string) {
  try {
    // Try both the original and decoded slug
    const decodedSlug = decodeURIComponent(slug);

    // Search for products with similar slugs (for debugging)
    const similarProducts = await db.product.findMany({
      where: {
        OR: [
          { slug: { contains: decodedSlug.split('-')[0] } },
          { name: { contains: decodedSlug.split('-')[0] } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 5,
    });

    return {
      success: true,
      originalSlug: slug,
      decodedSlug,
      similarProducts,
      count: similarProducts.length,
    };
  } catch (error) {
    console.error('Error finding product:', error);
    return {
      success: false,
      error: 'Failed to find product',
    };
  }
}
