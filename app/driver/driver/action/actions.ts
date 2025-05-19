'use server';

import { OrderStatusEnum } from '@prisma/client';
import db from '../../../../lib/prisma';

export async function getInwayToDriver(driverId: string,) {
  try {
    const ordersToShip = await db.order.findMany({
      where: { driverId },
      select: {
        id: true,
        orderNumber: true,
        customerId: true,
        isTripStart: true,
        driverId: true,
        status: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            productId: true,
            quantity: true,
            price: true,
          },
        },
        customer: {
          select: {
            phone: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        shift: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return { ordersToShip };
  } catch (error) {
    console.error('Database error:', error);
    return { error: 'فشل في جلب البيانات. حاول مرة أخرى.' };
  }
}

export async function getActiveTrip(driverId: string) {
  const getOrderId = await db.orderInWay.findFirst({
    where: {
      driverId: driverId, // تأكد من أن driverId معرّف
    },
  });
  const orderId = getOrderId?.orderId;
  if (!orderId) {
    return false;
  }

  try {
    const activeOrder = await db.order.findFirst({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        isTripStart: true,
        customerId: true,
        customerName: true,
        shiftId: true,
        driverId: true,
        status: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            price: true,
            product: true,
          },
        },
        customer: {
          select: {
            id: true,
            phone: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        shift: { select: { name: true, id: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return activeOrder;
  } catch (error) {
    console.error('Database error:', error);
    // return { error: "فشل في جلب البيانات. حاول مرة أخرى." };
  }
}

export async function getOrderByStatus(driverId: string, status: OrderStatusEnum) {
  try {
    const ordersToShip = await db.order.findMany({
      where: { driverId, status, isTripStart: false },
      select: {
        id: true,
        orderNumber: true,
        customerId: true,
        isTripStart: true,
        driverId: true,
        status: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            productId: true,
            quantity: true,
            price: true,
          },
        },
        customer: {
          select: {
            phone: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        shift: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return { ordersToShip };
  } catch (error) {
    console.error('Database error:', error);
    return { error: 'فشل في جلب البيانات. حاول مرة أخرى.' };
  }
}

export async function getOrderCount(driverId: string) {
  try {
    const [inWayCount, canceledCount, deliveredCount] = await Promise.all([
      // عدد الطلبات في حالة التوصيل (InWay)
      db.order.count({
        where: {
          driverId,
          status: OrderStatusEnum.INWAY,
          isTripStart: false,
        },
      }),

      // عدد الطلبات الملغاة (canceled)
      db.order.count({
        where: {
          driverId,
          status: OrderStatusEnum.CANCELED,
          isTripStart: false,
        },
      }),

      // عدد الطلبات المكتملة (delivered)
      db.order.count({
        where: {
          driverId,
          status: OrderStatusEnum.DELIVERED,
          isTripStart: false,
        },
      }),
    ]);

    return {
      counts: {
        inWay: inWayCount,
        canceled: canceledCount,
        delivered: deliveredCount,
      },
    };
  } catch (error) {
    console.error('Database error:', error);
    return { error: 'فشل في جلب البيانات. حاول مرة أخرى.' };
  }
}

export const cancelOrder = async (orderId: string, reson: string) => {
  await db.order.update({
    where: { id: orderId },
    data: { status: OrderStatusEnum.CANCELED, isTripStart: false, resonOfcancel: reson },
  });
  await db.orderInWay.delete({
    where: { orderId: orderId },
  });
};

export const deleverOrder = async (orderId: string) => {
  await db.order.update({
    where: { id: orderId },
    data: { status: OrderStatusEnum.DELIVERED, isTripStart: false },
  });
  await db.orderInWay.delete({
    where: { orderId: orderId },
  });
};
