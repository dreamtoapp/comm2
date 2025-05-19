'use server';


import db from '@/lib/prisma';
import { Product } from '@/types/product';
import { applyPromotionsToProducts } from '../../promotions/actions/promotionService';
import { Prisma } from '@prisma/client'; // Import Prisma

/**
 * Server action to fetch a page of products with pagination
 *
 * @param slug - Category slug to filter products (optional)
 * @param page - Page number (starting from 1)
 * @param pageSize - Number of items per page
 * @returns Object containing products array and hasMore flag
 */
export async function fetchProductsPage(
  slug: string = '',
  page: number = 1,
  pageSize: number = 8,
): Promise<{ products: Product[]; hasMore: boolean }> {
  try {
    // Calculate how many items to skip
    const skip = (page - 1) * pageSize;

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

    // Request one extra item to determine if there are more pages
    const products = await db.product.findMany({
      where: whereClause,
      skip,
      take: pageSize + 1, // Request one extra to check if there are more
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        costPrice: true,
        details: true,
        size: true,
        published: true,
        outOfStock: true,
        imageUrl: true,
        images: true,
        type: true,
        stockQuantity: true,
        manageInventory: true,
        productCode: true,
        gtin: true,
        brand: true,
        material: true,
        color: true,
        dimensions: true,
        weight: true,
        features: true,
        requiresShipping: true,
        shippingDays: true,
        returnPeriodDays: true,
        hasQualityGuarantee: true,
        careInstructions: true,
        tags: true,
        metaTitle: true,
        metaDescription: true,
        rating: true,
        reviewCount: true,
        supplierId: true,
        supplier: {
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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check if there are more products
    const hasMore = products.length > pageSize;

    // Remove the extra item before returning
    const paginatedProducts = hasMore ? products.slice(0, pageSize) : products;

    // Apply promotions to products
    const productsWithPromotions = await applyPromotionsToProducts(paginatedProducts);

    return {
      products: productsWithPromotions,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching products page:', error);
    return { products: [], hasMore: false };
  }
}
