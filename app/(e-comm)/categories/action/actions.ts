'use server';


import prisma from '@/lib/prisma';
import { applyPromotionsToProducts } from '../../promotions/actions/promotionService';

/**
 * Fetches a single category by its slug, including products
 * @param slug - The slug of the category to fetch
 * @returns An object with success status and the category data or an error message
 */
export async function getCategoryBySlug(slug: string) {
  console.log(`[getCategoryBySlug] Received slug: "${slug}" (length: ${slug.length})`);
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        productAssignments: {
          include: {
            product: true, // Fetch full product details for category pages
          },
        },
      },
    });
    
    if (!category) {
      console.log(`[getCategoryBySlug] Category not found for slug: "${slug}"`);
      return { success: false, error: 'Category not found.' };
    }
    
    console.log(`[getCategoryBySlug] Found category: ${category.name} (ID: ${category.id}) for slug: "${slug}"`);
    return { success: true, category };
  } catch (error: unknown) {
    console.error(`[getCategoryBySlug] Error fetching category by slug "${slug}":`, error);
    return { success: false, error: 'Failed to fetch category.' };
  }
}

/**
 * Fetches products for a given category slug with pagination
 * @param categorySlug - The slug of the category
 * @param page - The current page number (default: 1)
 * @param pageSize - The number of products per page (default: 10)
 * @returns An object with success status, category details, products, and pagination details or an error message
 */
export async function getProductsByCategorySlug(categorySlug: string, page = 1, pageSize = 10) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true, name: true, description: true, imageUrl: true },
    });

    if (!category) {
      return { success: false, error: 'Category not found.' };
    }

    const skip = (page - 1) * pageSize;
    const [rawProducts, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          categoryAssignments: { some: { categoryId: category.id } },
          published: true,
        },
        include: {
          supplier: true, // Include the full supplier object
          reviews: { take: 5, orderBy: { createdAt: 'desc' } },
          _count: { select: { reviews: true } },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({
        where: {
          categoryAssignments: { some: { categoryId: category.id } },
          published: true,
        },
      }),
    ]);

    // Process products to ensure compatibility with the ProductCard component's expected Product type
    const products = rawProducts.map(product => {
      // Start with the original product
      if (rawProducts.length > 0) {
        console.log('DEBUG: First raw product fields:', Object.entries(rawProducts[0]).map(([k, v]) => [k, v, typeof v]));
      }
      const processedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice === null || product.compareAtPrice === undefined ? undefined : product.compareAtPrice,
        costPrice: product.costPrice === null || product.costPrice === undefined ? undefined : product.costPrice,
        details: product.details === null || product.details === undefined ? undefined : product.details,
        size: product.size === null || product.size === undefined ? undefined : product.size,
        published: product.published,
        outOfStock: product.outOfStock,
        imageUrl: product.imageUrl === null || product.imageUrl === undefined ? null : product.imageUrl,
        images: Array.isArray(product.images) ? product.images : undefined,
        type: product.type,
        stockQuantity: product.stockQuantity === null || product.stockQuantity === undefined ? undefined : product.stockQuantity,
        manageInventory: product.manageInventory ?? true,
        productCode: product.productCode === null || product.productCode === undefined ? undefined : product.productCode,
        gtin: product.gtin === null || product.gtin === undefined ? undefined : product.gtin,
        brand: product.brand === null || product.brand === undefined ? undefined : product.brand,
        material: product.material === null || product.material === undefined ? undefined : product.material,
        color: product.color === null || product.color === undefined ? undefined : product.color,
        dimensions: product.dimensions === null || product.dimensions === undefined ? undefined : product.dimensions,
        weight: product.weight === null || product.weight === undefined ? undefined : product.weight,
        features: Array.isArray(product.features) ? product.features : undefined,
        requiresShipping: product.requiresShipping ?? true,
        shippingDays: product.shippingDays === null || product.shippingDays === undefined ? undefined : product.shippingDays,
        returnPeriodDays: product.returnPeriodDays === null || product.returnPeriodDays === undefined ? undefined : product.returnPeriodDays,
        hasQualityGuarantee: product.hasQualityGuarantee ?? true,
        careInstructions: product.careInstructions === null || product.careInstructions === undefined ? undefined : product.careInstructions,
        tags: Array.isArray(product.tags) ? product.tags : undefined,
        metaTitle: product.metaTitle === null || product.metaTitle === undefined ? undefined : product.metaTitle,
        metaDescription: product.metaDescription === null || product.metaDescription === undefined ? undefined : product.metaDescription,
        rating: product.rating === null || product.rating === undefined ? undefined : product.rating,
        reviewCount: typeof product.reviewCount === 'number' ? product.reviewCount : 0,
        supplier: product.supplier && typeof product.supplier === 'object' ? { id: product.supplier.id, name: product.supplier.name } : null,
        supplierId: product.supplierId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };



      
      return processedProduct;
    });

    // Apply promotions to products
    const productsWithPromotions = await applyPromotionsToProducts(products);

    return {
      success: true,
      category,
      products: productsWithPromotions,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      totalProducts,
    };
  } catch (error) {
    console.error('Error fetching products by category slug:', error);
    return { success: false, error: 'Failed to fetch products for this category.' };
  }
} 