import {
  ORDER_STATUS,
  OrderStatus,
} from '@/constant/order-status';
import db from '@/lib/prisma';

export async function getDashboardSummary() {
  // Orders
  const totalOrders = await db.order.count();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday = await db.order.count({ where: { createdAt: { gte: today } } });
  const pendingOrders = await db.order.count({ where: { status: ORDER_STATUS.PENDING } });
  const completedOrders = await db.order.count({ where: { status: ORDER_STATUS.DELIVERED } });
  const cancelledOrders = await db.order.count({ where: { status: ORDER_STATUS.CANCELED } });

  // Sales
  const totalSales = await db.order.aggregate({ _sum: { amount: true } });
  const salesToday = await db.order.aggregate({
    _sum: { amount: true },
    where: { createdAt: { gte: today } },
  });

  // Customers
  const totalCustomers = await db.user.count({ where: { role: 'customer' } });
  const newCustomersToday = await db.user.count({
    where: { role: 'customer', createdAt: { gte: today } },
  });

  // Products
  const totalProducts = await db.product.count();
  const outOfStockProducts = await db.product.count({ where: { outOfStock: true } });

  // Drivers
  const totalDrivers = await db.driver.count();

  // Sales by Month (last 6 months)
  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  const salesByMonth = await Promise.all(
    months.map(async ({ year, month }) => {
      const from = new Date(year, month - 1, 1);
      const to = new Date(year, month, 1);
      const sales = await db.order.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: from, lt: to } },
      });
      return {
        name: `${year}-${month.toString().padStart(2, '0')}`,
        sales: sales._sum.amount || 0,
      };
    }),
  );

  // Top Products (by total sales amount)
  const topProductsRaw = await db.orderItem.groupBy({
    by: ['productId'],
    _sum: { price: true, quantity: true },
    orderBy: { _sum: { price: 'desc' } },
    take: 5,
  });
  const topProductIds = topProductsRaw.map((p) => p.productId);
  const topProductDetails = await db.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true },
  });
  const topProducts = topProductsRaw.map((p) => {
    const prod = topProductDetails.find((d) => d.id === p.productId);
    return {
      name: prod?.name || '---',
      sales: p._sum.price || 0,
      quantity: p._sum.quantity || 0,
    };
  });

  // Order Status Distribution
  // Use a direct query to ensure we only get valid enum values
  const statusCounts = await db.order.groupBy({
    by: ['status'],
    _count: { _all: true },
    where: {
      status: {
        in: [ORDER_STATUS.PENDING, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELED]
      }
    }
  });
  const orderStatus = statusCounts.map((s) => ({
    name: s.status as OrderStatus, // Cast to OrderStatus
    value: s._count?._all || 0 // Handle potential undefined
  }));

  // Recent Orders (last 5)
  const recentOrders = await db.order.findMany({
    where: {
      status: {
        in: [ORDER_STATUS.PENDING, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELED]
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return {
    orders: {
      total: totalOrders,
      today: ordersToday,
      pending: pendingOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
    },
    sales: { total: totalSales._sum.amount || 0, today: salesToday._sum.amount || 0 },
    customers: { total: totalCustomers, today: newCustomersToday },
    products: { total: totalProducts, outOfStock: outOfStockProducts },
    drivers: { total: totalDrivers },
    salesByMonth,
    topProducts,
    orderStatus,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      customer: o.customer?.name || '---',
      amount: o.amount,
      status: o.status as OrderStatus, // Cast to OrderStatus
      date: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
    })),
  };
}
