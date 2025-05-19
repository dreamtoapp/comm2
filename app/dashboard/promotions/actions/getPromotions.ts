'use server';
import db from '@/lib/prisma';
import { PromotionType, DiscountType } from '@prisma/client'; // Revert to direct enum imports

// Define the structure of the data returned for each promotion in the list
export interface PromotionListItem {
  id: string;
  title: string;
  type: PromotionType; // Use direct enum type
  discountValue: number | null;
  discountType: DiscountType | null; // Use direct enum type
  couponCode: string | null;
  productIds: string[];
  startDate: Date | null;
  endDate: Date | null;
  active: boolean;
  createdAt: Date;
}

export async function getPromotions(): Promise<PromotionListItem[]> {
  try {
    const promotions = await db.promotion.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        discountValue: true,
        discountType: true,
        couponCode: true,
        productIds: true,
        startDate: true,
        endDate: true,
        active: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
    });
    return promotions;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw new Error('Failed to fetch promotions.'); // Or return empty array: return [];
  }
}
