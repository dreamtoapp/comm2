"use server";

import db from '@/lib/prisma';

export interface OrderAnalyticsData {
  totalOrders: number;
  ordersByStatus: { status: string; _count: { status: number } }[];
  totalRevenue: number;
  firstOrder?: {
    orderNumber: string;
    createdAt: Date;
  };
  lastOrder?: {
    orderNumber: string;
    createdAt: Date;
  };
  todayOrdersByStatus: { status: string; _count: { status: number } }[];
  unfulfilledOrders: number;
  returnsCount: number;
  salesTrends: { date: string; orders: number; revenue: number }[];
  topProducts: { name: string; count: number }[];
  topCustomers: { name: string; total: number }[];
}

export interface GetOrderAnalyticsResult {
  success: boolean;
  data?: OrderAnalyticsData;
  error?: string;
}

export async function getOrderAnalytics(): Promise<GetOrderAnalyticsResult> {
  try {
    const totalOrders = await db.order.count();

    const ordersByStatus = await db.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const revenueResult = await db.order.aggregate({
      _sum: {
        amount: true,
      },
    });

    const totalRevenue = revenueResult._sum.amount || 0;

    // Fetch the first order
    const firstOrder = await db.order.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        orderNumber: true,
        createdAt: true,
      },
    });

    // Fetch the last order
    const lastOrder = await db.order.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        orderNumber: true,
        createdAt: true,
      },
    });

    // Calculate today's orders by status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrdersByStatus = await db.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _count: {
        status: true,
      },
    });

    // Unfulfilled orders (not delivered or canceled)
    const unfulfilledOrders = await db.order.count({
      where: { status: { notIn: ['Delivered', 'CANCELED'] } },
    });

    // Returns (orders with status 'RETURNED' or similar)
    const returnsCount = await db.order.count({
      where: { status: { in: ['RETURNED', 'REFUNDED'] } },
    });

    // Sales trends (group by day for last 30 days)
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 29);
    const salesTrendsRaw = await db.order.findMany({
      where: { createdAt: { gte: fromDate } },
      select: { createdAt: true, amount: true },
    });
    const salesTrendsMap: Record<string, { date: string; orders: number; revenue: number }> = {};
    salesTrendsRaw.forEach((o) => {
      const date = o.createdAt.toISOString().slice(0, 10);
      if (!salesTrendsMap[date]) salesTrendsMap[date] = { date, orders: 0, revenue: 0 };
      salesTrendsMap[date].orders += 1;
      salesTrendsMap[date].revenue += o.amount || 0;
    });
    const salesTrends = Object.values(salesTrendsMap).sort((a, b) => a.date.localeCompare(b.date));

    // Top products (by quantity)
    const topProductsRaw = await db.orderItem.findMany({
      select: { productId: true, quantity: true, product: { select: { name: true } } },
    });
    const productMap: Record<string, { name: string; count: number }> = {};
    topProductsRaw.forEach((item) => {
      if (!item.product) return;
      if (!productMap[item.productId]) productMap[item.productId] = { name: item.product.name, count: 0 };
      productMap[item.productId].count += item.quantity;
    });
    const topProducts = Object.values(productMap).sort((a, b) => b.count - a.count).slice(0, 5);

    // Top customers (by total order value)
    const topCustomersRaw = await db.order.findMany({
      select: { customerName: true, amount: true },
      where: { customerName: { not: null } },
    });
    const customerMap: Record<string, number> = {};
    topCustomersRaw.forEach((o) => {
      if (!o.customerName) return;
      customerMap[o.customerName] = (customerMap[o.customerName] || 0) + (o.amount || 0);
    });
    const topCustomers = Object.entries(customerMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const analyticsData: OrderAnalyticsData = {
      totalOrders,
      ordersByStatus,
      totalRevenue,
      firstOrder: firstOrder ? {
        orderNumber: firstOrder.orderNumber,
        createdAt: firstOrder.createdAt,
      } : undefined,
      lastOrder: lastOrder ? {
        orderNumber: lastOrder.orderNumber,
        createdAt: lastOrder.createdAt,
      } : undefined,
      todayOrdersByStatus,
      unfulfilledOrders,
      returnsCount,
      salesTrends,
      topProducts,
      topCustomers,
    };

    return { success: true, data: analyticsData };
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    return { success: false, error: "Failed to fetch order analytics." };
  }
}
