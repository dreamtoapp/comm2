'use server';

import prisma from '@/lib/prisma';

export interface PromotionAnalyticsData {
  promotionId: string;
  promotionTitle: string;
  timesUsed: number;
  totalSalesGenerated: number; // Total revenue from orders that used this promotion
  averageOrderValue: number; // Average order value for orders that used this promotion
  // Could add more: e.g., total discount value if calculable
}

export async function getPromotionAnalytics(
  promotionId: string,
): Promise<PromotionAnalyticsData | null> {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
      select: { title: true, couponCode: true }, // Keep couponCode select for now, though unused
    });

    if (!promotion) {
      console.error(`Promotion with ID ${promotionId} not found.`);
      return null;
    }

    // Since coupon codes are being commented out for this version from the form/table,
    // and the Order model linkage (e.g., via 'usedCouponCode') is unconfirmed or was problematic,
    // we will return default zeroed analytics.
    // This effectively disables per-promotion analytics tracking until
    // a reliable link between Order and Promotion is established and used.
    return {
      promotionId,
      promotionTitle: promotion.title,
      timesUsed: 0,
      totalSalesGenerated: 0,
      averageOrderValue: 0,
    };

    // --- The following logic is commented out as it relies on coupon code tracking ---
    // // Assumption: The Order model has an 'appliedCouponCode' field (String type).
    // // If the promotion does not have a coupon code, these analytics might not be directly applicable
    // // unless there's another way to link auto-applied promotions to orders (e.g., an 'appliedPromotionId' on Order).
    // if (!promotion.couponCode) {
    //   return {
    //     promotionId,
    //     promotionTitle: promotion.title,
    //     timesUsed: 0, // Cannot track usage without a coupon or direct link
    //     totalSalesGenerated: 0,
    //     averageOrderValue: 0,
    //   };
    // }

    // const ordersUsingPromotion = await prisma.order.findMany({
    //   where: {
    //     // This would be the place to use the correct field from the Order model
    //     // e.g., usedCouponCode: promotion.couponCode,
    //     status: { notIn: ['Cancelled', 'Failed'] } // Consider only successful/completed orders
    //   },
    //   select: {
    //     amount: true,
    //   },
    // });

    // const timesUsed = ordersUsingPromotion.length;
    // const totalSalesGenerated = ordersUsingPromotion.reduce(
    //   (sum, order) => sum + order.amount,
    //   0,
    // );
    // const averageOrderValue =
    //   timesUsed > 0 ? totalSalesGenerated / timesUsed : 0;

    // return {
    //   promotionId,
    //   promotionTitle: promotion.title,
    //   timesUsed,
    //   totalSalesGenerated,
    //   averageOrderValue,
    // };
  } catch (error) {
    console.error(`Error fetching analytics for promotion ${promotionId}:`, error);
    return null;
  }
}
