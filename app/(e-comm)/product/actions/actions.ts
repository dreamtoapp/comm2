'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import db from '@/lib/prisma';

import { verifyUserPurchase } from './rating';

/**
 * Get product details by slug
 */
export async function getProductBySlug(slug: string) {
  try {
    // Decode the URL-encoded slug
    const decodedSlug = decodeURIComponent(slug);

    // First try with the decoded slug
    let product = await db.product.findUnique({
      where: { slug: decodedSlug },
      include: {
        supplier: true,
        reviews: true,
      },
    });

    // If not found, try with the original slug
    if (!product) {
      product = await db.product.findUnique({
        where: { slug },
        include: {
          supplier: true,
          reviews: true,
        },
      });
    }

    // If still not found, try to find similar products for debugging
    if (!product) {
      await db.product.findMany({
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
    }

    // Add the derived inStock field if product is found
    return product ? { ...product, inStock: !product.outOfStock } : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Get product reviews
 */
export async function getProductReviews(productId: string) {
  try {
    const reviews = await db.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

/**
 * Check if the current user has purchased this product
 */
export async function checkUserPurchase(productId: string) {
  try {
    const hasPurchased = await verifyUserPurchase(productId);
    return { hasPurchased };
  } catch (error) {
    console.error('Error checking purchase:', error);
    return { hasPurchased: false };
  }
}

/**
 * Check if a product is in the user's wishlist
 */
export async function isProductInWishlist(productId: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    const wishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return !!wishlistItem;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}

/**
 * Add a product to the user's wishlist
 */
export async function addToWishlist(
  productId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة المنتج إلى المفضلة',
      };
    }

    // Check if the product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        message: 'المنتج غير موجود',
      };
    }

    // Check if the product is already in the wishlist
    const existingWishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingWishlistItem) {
      return {
        success: false,
        message: 'المنتج موجود بالفعل في المفضلة',
      };
    }

    // Add the product to the wishlist
    await db.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    // Revalidate paths
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/user/wishlist');

    return {
      success: true,
      message: 'تمت إضافة المنتج إلى المفضلة',
    };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة المنتج إلى المفضلة',
    };
  }
}

/**
 * Remove a product from the user's wishlist
 */
export async function removeFromWishlist(
  productId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإزالة المنتج من المفضلة',
      };
    }

    // Check if the product is in the wishlist
    const wishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      return {
        success: false,
        message: 'المنتج غير موجود في المفضلة',
      };
    }

    // Get the product for its slug
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });

    // Remove the product from the wishlist
    await db.wishlistItem.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    // Revalidate paths
    if (product?.slug) {
      revalidatePath(`/product/${product.slug}`);
    }
    revalidatePath('/user/wishlist');

    return {
      success: true,
      message: 'تمت إزالة المنتج من المفضلة',
    };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إزالة المنتج من المفضلة',
    };
  }
}
