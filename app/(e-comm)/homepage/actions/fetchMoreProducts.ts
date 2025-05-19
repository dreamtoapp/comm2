'use server';

import { Prisma } from '@prisma/client'; // Import Prisma
import db from '@/lib/prisma';
import { Product } from '@/types/product';

/**
 * Server action to fetch additional products for infinite scrolling
 * This is called from the client component when more products need to be loaded
 */
export async function fetchMoreProducts(slug: string, page: number): Promise<Product[]> {
  const pageSize = 8;
  const skip = page * pageSize;

  try {
    // Find supplier if slug is provided
    const whereClause: Prisma.ProductWhereInput = { published: true }; // Use const as it's not reassigned

    if (slug && slug.trim() !== '') {
      const supplier = await db.supplier.findFirst({
        where: { slug },
        select: { id: true },
      });

      if (supplier) {
        whereClause.supplierId = supplier.id;
      }
    }

    // Fetch paginated products with a smaller page size to avoid cache issues
    const products = await db.product.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      select: { // Select all fields needed for Product type
        id: true,
        name: true,
        slug: true,
        price: true,
        details: true,
        size: true,
        published: true,
        outOfStock: true,
        imageUrl: true,
        images: true,
        rating: true,
        reviewCount: true,
        createdAt: true,
        updatedAt: true,
        supplier: { // Select all supplier fields needed
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            email: true,
            phone: true,
            address: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add default image if needed, ensure price is a valid number
    return products.map((product) => {
      // Always provide a valid string for imageUrl
      const fallbackImage = '/fallback/fallback.avif';

      // Check if the image URL exists and is valid
      const hasValidImageUrl =
        product.imageUrl &&
        typeof product.imageUrl === 'string' &&
        (product.imageUrl.startsWith('/') || // Local images
          product.imageUrl.startsWith('http')); // Remote images

      // Create a product object that matches the Product type
      const processedProduct: Product = { // Explicitly map all fields
        id: product.id,
        name: product.name || '',
        slug: product.slug || product.id,
        price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
        details: product.details === null ? undefined : product.details,
        size: product.size === null ? undefined : product.size,
        published: product.published,
        outOfStock: product.outOfStock,
        inStock: !product.outOfStock, // Derive inStock from outOfStock
        // Always return a string for imageUrl
        imageUrl: hasValidImageUrl ? (product.imageUrl === null ? undefined : product.imageUrl) : fallbackImage,
        images: Array.isArray(product.images) ? product.images.filter(Boolean) : [hasValidImageUrl ? product.imageUrl : fallbackImage],
        type: 'product', // Assuming 'product' is the correct default type here
        rating: product.rating === null ? undefined : product.rating,
        reviewCount: product.reviewCount,
        supplier: product.supplier === null ? undefined : product.supplier,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      return processedProduct;
    });
  } catch (error) {
    console.error('Error fetching more products:', error);
    return [];
  }
}
