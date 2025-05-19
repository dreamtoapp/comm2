"use server"

import db from '@/lib/prisma';

export async function syncOrderInWay() {
  console.log('🔄 Syncing OrderInWay table with orders where isTripStart=true...');
  const tripOrders = await db.order.findMany({ where: { isTripStart: true } });
  console.log(tripOrders.length, 'orders found with isTripStart=true');
  let addedCount = 0;
  for (const order of tripOrders) {
    if (!order.driverId) continue;
    const existing = await db.orderInWay.findUnique({ where: { driverId: order.driverId } });
    if (!existing) {
      await db.orderInWay.create({
        data: {
          orderId: order.id,
          driverId: order.driverId,
          orderNumber: order.orderNumber,
          latitude: order.latitude ? parseFloat(order.latitude) : 0,
          longitude: order.longitude ? parseFloat(order.longitude) : 0,
        },
      });
      addedCount++;
    }
  }
  console.log(`✅ Sync complete. Added ${addedCount} missing OrderInWay records.`);
}
