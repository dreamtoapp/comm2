'use server';
import db from '@/lib/prisma';
import { Prisma, PromotionType, DiscountType } from '@prisma/client';

export interface PromotionReportKpi {
  label: string;
  value: string | number;
}

export interface PromotionReportDataItem {
  id: string;
  title: string;
  type: PromotionType;
  discountValue: number | null;
  discountType: DiscountType | null;
  startDate: Date | null;
  endDate: Date | null;
  active: boolean;
  // usageCount: number; // Removed as it's causing type errors
  productCount: number;
}

export interface PromotionUsageChartItem {
  name: string; // Promotion title or type
  usage: number; // This chart might become non-functional or show 0
}

export interface GetPromotionsReportDataParams {
  from?: string;
  to?: string;
}

export async function getPromotionsReportData({ from, to }: GetPromotionsReportDataParams) {
  try {
    const dateFilter: Prisma.PromotionWhereInput = {};
    if (from && to) {
      dateFilter.createdAt = {
        gte: new Date(from),
        lte: new Date(new Date(to).setDate(new Date(to).getDate() + 1)),
      };
    } else if (from) {
      dateFilter.createdAt = { gte: new Date(from) };
    } else if (to) {
      dateFilter.createdAt = { lte: new Date(new Date(to).setDate(new Date(to).getDate() + 1)) };
    }

    const promotions = await db.promotion.findMany({
      where: dateFilter,
      orderBy: { createdAt: 'desc' },
      select: { // Select fields explicitly, excluding usageCount if it's problematic
        id: true,
        title: true,
        type: true,
        discountValue: true,
        discountType: true,
        startDate: true,
        endDate: true,
        active: true,
        productIds: true,
        createdAt: true,
        // usageCount: true, // Removed
      }
    });

    const reportItems: PromotionReportDataItem[] = promotions.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      discountValue: p.discountValue,
      discountType: p.discountType,
      startDate: p.startDate,
      endDate: p.endDate,
      active: p.active,
      // usageCount: p.usageCount ?? 0, // Removed
      productCount: p.productIds.length,
    }));

    // KPIs
    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter((p) => p.active && (!p.endDate || p.endDate > new Date())).length;
    // const totalUsage = promotions.reduce((sum, p) => sum + (p.usageCount ?? 0), 0); // Removed

    const kpis: PromotionReportKpi[] = [
      { label: 'إجمالي العروض', value: totalPromotions },
      { label: 'العروض النشطة حاليًا', value: activePromotions },
      { label: 'إجمالي مرات استخدام العروض', value: "N/A (تتبع غير متوفر)" }, // Indicate N/A
    ];

    // Chart Data: Top 5 used promotions - will show 0 usage or be empty
    const topUsedPromotionsChart: PromotionUsageChartItem[] = [...reportItems]
      .map(p => ({ name: p.title, usage: 0 })) // Assuming 0 usage if not tracked
      .slice(0, 5);


    // Chart Data: Usage by promotion type - will show 0 usage or be empty
    const usageByTypeChart: PromotionUsageChartItem[] = [];
    const usageByTypeMap = new Map<PromotionType, number>();
    reportItems.forEach(p => {
      // Since usageCount is not available, this map will effectively sum zeros
      usageByTypeMap.set(p.type, (usageByTypeMap.get(p.type) || 0) + 0);
    });
    usageByTypeMap.forEach((usage, type) => {
      usageByTypeChart.push({ name: String(type), usage });
    });

    return {
      kpis,
      promotions: reportItems,
      topUsedPromotionsChart,
      usageByTypeChart,
    };
  } catch (error) {
    console.error("Error fetching promotions report data:", error);
    return {
      kpis: [],
      promotions: [],
      topUsedPromotionsChart: [],
      usageByTypeChart: [],
      error: "Failed to fetch report data.",
    };
  }
}
