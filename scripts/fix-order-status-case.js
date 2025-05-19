/**
 * Fix Order Status Case Script
 * 
 * This script fixes case sensitivity issues with order status values
 * by ensuring all status values match the exact case of the OrderStatusEnum.
 */

const { PrismaClient } = require('@prisma/client');
const { OrderStatus } = require('../constant/order-status');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting order status case fix script...');
  
  // Fix 'canceled' to 'CANCELED'
  const canceledResult = await prisma.order.updateMany({
    where: {
      // We're intentionally looking for invalid status values
      status: 'canceled'
    },
    data: {
      status: OrderStatus.CANCELED
    }
  });
  console.log(`Fixed ${canceledResult.count} orders with 'canceled' status`);
  
  // Fix 'pending' to 'PENDING'
  const pendingResult = await prisma.order.updateMany({
    where: {
      status: 'pending'
    },
    data: {
      status: OrderStatus.PENDING
    }
  });
  console.log(`Fixed ${pendingResult.count} orders with 'pending' status`);
  
  // Fix 'delivered' to 'DELIVERED'
  const deliveredResult = await prisma.order.updateMany({
    where: {
      status: 'delivered'
    },
    data: {
      status: OrderStatus.DELIVERED
    }
  });
  console.log(`Fixed ${deliveredResult.count} orders with 'delivered' status`);
  
  // Fix 'in_way' to 'IN_WAY'
  const inWayResult = await prisma.order.updateMany({
    where: {
      status: 'in_way'
    },
    data: {
      status: OrderStatus.IN_WAY
    }
  });
  console.log(`Fixed ${inWayResult.count} orders with 'in_way' status`);
  
  // Fix 'InWay' to 'IN_WAY'
  const inWayCapResult = await prisma.order.updateMany({
    where: {
      status: 'InWay'
    },
    data: {
      status: OrderStatus.IN_WAY
    }
  });
  console.log(`Fixed ${inWayCapResult.count} orders with 'InWay' status`);
  
  console.log('Order status case fix completed successfully');
}

main()
  .catch((e) => {
    console.error('Error in fix script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
