'use server';

import prisma from '@/lib/prisma';
import { Product } from '@/types/product';
import { PromotionType, DiscountType } from '@prisma/client';

export interface DiscountedProduct extends Product {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  promotionId?: string;
  promotionTitle?: string;
}

export async function applyPromotionsToProducts(products: Product[]): Promise<DiscountedProduct[]> {
  // Get all active promotions
  const activePromotions = await prisma.promotion.findMany({
    where: {
      active: true,
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } }
      ],
      AND: [
        { startDate: null },
        { startDate: { lte: new Date() } }
      ]
    }
  });

  // Apply promotions to products
  return products.map(product => {
    // Find applicable product-specific promotions
    const applicablePromotions = activePromotions.filter(
      promo => promo.productIds.includes(product.id) &&
      (promo.type === PromotionType.PERCENTAGE_PRODUCT || promo.type === PromotionType.FIXED_PRODUCT)
    );

    if (applicablePromotions.length === 0) {
      return { 
        ...product, 
        originalPrice: product.price,
        discountedPrice: product.price,
        discountPercentage: 0
      };
    }

    // Find the best promotion (highest discount)
    const bestPromotion = applicablePromotions.reduce((best, current) => {
      let currentDiscount = 0;
      
      if (current.type === PromotionType.PERCENTAGE_PRODUCT && current.discountValue) {
        currentDiscount = product.price * (current.discountValue / 100);
      } else if (current.type === PromotionType.FIXED_PRODUCT && current.discountValue) {
        currentDiscount = current.discountValue;
      }
      
      let bestDiscount = 0;
      if (best.type === PromotionType.PERCENTAGE_PRODUCT && best.discountValue) {
        bestDiscount = product.price * (best.discountValue / 100);
      } else if (best.type === PromotionType.FIXED_PRODUCT && best.discountValue) {
        bestDiscount = best.discountValue;
      }
      
      return currentDiscount > bestDiscount ? current : best;
    }, applicablePromotions[0]);

    // Calculate discounted price
    let discountedPrice = product.price;
    let discountPercentage = 0;
    
    if (bestPromotion.type === PromotionType.PERCENTAGE_PRODUCT && bestPromotion.discountValue) {
      discountedPrice = product.price * (1 - bestPromotion.discountValue / 100);
      discountPercentage = bestPromotion.discountValue;
    } else if (bestPromotion.type === PromotionType.FIXED_PRODUCT && bestPromotion.discountValue) {
      discountedPrice = Math.max(0, product.price - bestPromotion.discountValue);
      discountPercentage = Math.round((bestPromotion.discountValue / product.price) * 100);
    }

    return {
      ...product,
      originalPrice: product.price,
      discountedPrice,
      discountPercentage,
      promotionId: bestPromotion.id,
      promotionTitle: bestPromotion.title
    };
  });
} 