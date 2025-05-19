'use server';

import db from '@/lib/prisma';

/**
 * Fetch related products from the same supplier
 */
export async function getRelatedProducts(supplierId: string, excludeId: string, limit: number = 4) {
  try {
    if (!supplierId) {
      return [];
    }

    // Find related products from the same supplier
    const products = await db.product.findMany({
      where: {
        supplierId: supplierId,
        id: {
          not: excludeId || undefined,
        },
        outOfStock: false,
      },
      select: { // Select all fields needed for Product type
        id: true,
        name: true,
        slug: true,
        price: true,
        // salePrice: true, // Not in schema
        details: true,
        size: true,
        published: true,
        outOfStock: true,
        imageUrl: true,
        images: true,
        type: true,
        rating: true,
        reviewCount: true,
        supplierId: true,
        createdAt: true,
        updatedAt: true,
        // We don't need the full supplier object here for related products card
      },
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    });

    // Map to ensure conformance with Product type
    return products.map((product) => ({
      ...product,
      inStock: !product.outOfStock, // Derive inStock
      // Handle potential nulls/defaults for optional fields if needed
      imageUrl: product.imageUrl || '/fallback/product-fallback.avif', // Keep fallback
      images: product.images ?? [], // Default images to empty array
      details: product.details,
      size: product.size,
      rating: product.rating,
      reviewCount: product.reviewCount,
      supplierId: product.supplierId, // Already selected
      // 'supplier' object is intentionally omitted as not selected/needed here
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
