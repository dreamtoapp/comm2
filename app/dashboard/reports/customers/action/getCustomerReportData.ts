import db from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Import Prisma

// Define type for User including nested orders and items
type UserWithOrders = Prisma.UserGetPayload<{
  include: {
    orders: { include: { items: true } }
  }
}>;
type OrderWithItems = UserWithOrders['orders'][number]; // Helper type for an order within UserWithOrders

// Define type for the processed customer data
interface CustomerReportData {
  id: string;
  name: string;
  phone: string;
  email: string;
  orderCount: number;
  totalSpend: number;
  createdAt: Date;
}

/**
 * احصائيات العملاء: العدد الإجمالي، العملاء الجدد، العملاء الدائمين، الأعلى طلباً، الأعلى إنفاقاً، بيانات للرسم البياني.
 */
export async function getCustomerReportData({ from, to }: { from?: string; to?: string }) {
  // تاريخ الفلترة للطلبات - Use OrderWhereInput as it filters orders
  let orderDateFilter: Prisma.OrderWhereInput = {};
  if (from || to) {
    orderDateFilter = {
      createdAt: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    };
  }

  // جلب جميع المستخدمين مع الطلبات
  const users: UserWithOrders[] = await db.user.findMany({ // Type the users constant
    include: {
      orders: {
        where: orderDateFilter,
        include: {
          items: true,
        },
      },
    },
  });

  // معالجة بيانات العملاء
  const customers: CustomerReportData[] = users.map((user: UserWithOrders) => { // Type user parameter
    const orderCount = user.orders.length;
    const totalSpend = user.orders.reduce((sum: number, o: OrderWithItems) => sum + (o.amount ?? 0), 0); // Type sum and o
    return {
      id: user.id,
      name: user.name ?? '-',
      phone: user.phone ?? '-',
      email: user.email ?? '-',
      orderCount,
      totalSpend,
      createdAt: user.createdAt,
    };
  });

  // KPIs
  const totalCustomers = customers.length;
  const totalOrders = customers.reduce((sum: number, c: CustomerReportData) => sum + c.orderCount, 0); // Type sum and c
  const totalSpendAll = customers.reduce((sum: number, c: CustomerReportData) => sum + c.totalSpend, 0); // Type sum and c
  // الأعلى طلباً
  const topCustomer = customers.reduce(
    (best: CustomerReportData | undefined, c: CustomerReportData) => (c.orderCount > (best?.orderCount ?? 0) ? c : best), // Type c
    undefined, // Correctly typed initial value
  );
  // الأعلى إنفاقاً
  const topSpender = customers.reduce(
    (best: CustomerReportData | undefined, c: CustomerReportData) => (c.totalSpend > (best?.totalSpend ?? 0) ? c : best), // Type c
    undefined, // Correctly typed initial value
  );

  // رسم بياني: اسم العميل وعدد الطلبات
  // Define type for chart data items
  type ChartDataItem = { name: string; orderCount: number; totalSpend: number };

  const chartData = customers
    .map((c: CustomerReportData): ChartDataItem => ({ // Type c and return value
      name: c.name,
      orderCount: c.orderCount,
      totalSpend: c.totalSpend,
    }))
    .sort((a: ChartDataItem, b: ChartDataItem) => b.orderCount - a.orderCount) // Type a and b
    .slice(0, 10); // أعلى 10 فقط

  const kpis = [
    { label: 'إجمالي العملاء', value: totalCustomers },
    { label: 'إجمالي الطلبات', value: totalOrders },
    { label: 'إجمالي الإنفاق', value: totalSpendAll.toFixed(2) },
    { label: 'الأكثر طلباً', value: topCustomer ? topCustomer.name : '-' },
    { label: 'الأعلى إنفاقاً', value: topSpender ? topSpender.name : '-' },
  ];

  return {
    customers,
    kpis,
    chartData,
  };
}
