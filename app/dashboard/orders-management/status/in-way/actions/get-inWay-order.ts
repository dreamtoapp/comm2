'use server';
import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';

export async function fetchOrders({
  status,
  driverId,
}: {
  status?: string;
  driverId?: string;
}): Promise<{ orders: any[] }> {
  try {
    const where: any = status ? { status } : {};
    if (driverId) where.driverId = driverId;

    const orders = await db.order.findMany({
      where,
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
        driver: {
          select: {
            name: true,
            phone: true,
          },
        },
        orderInWay: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { orders };
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function fetchAnalytics() {
  try {

    const orderCount = await db.order.count({
      where: { status: ORDER_STATUS.IN_TRANSIT }
    });



    return orderCount;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return default analytics on error
    return 0
  }
}