/**
 * Order Status Case Fix Script (ESM Version)
 * 
 * This script ensures all order status values in the database match the exact case
 * of the OrderStatusEnum values defined in the Prisma schema.
 */

import { PrismaClient } from '@prisma/client';

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Define the exact enum values as they appear in the schema
const OrderStatusEnum = {
  PENDING: 'PENDING',
  IN_WAY: 'IN_WAY',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED'
};

async function fixOrderStatusValues() {
  console.log('Starting order status case fix...');
  
  try {
    // Fix 'Delivered' to 'DELIVERED'
    const deliveredResult = await prisma.order.updateMany({
      where: {
        status: 'Delivered'
      },
      data: {
        status: OrderStatusEnum.DELIVERED
      }
    });
    console.log(`Fixed ${deliveredResult.count} orders with 'Delivered' status`);
    
    // Fix 'Pending' to 'PENDING'
    const pendingResult = await prisma.order.updateMany({
      where: {
        status: 'Pending'
      },
      data: {
        status: OrderStatusEnum.PENDING
      }
    });
    console.log(`Fixed ${pendingResult.count} orders with 'Pending' status`);
    
    // Fix 'InWay' to 'IN_WAY'
    const inWayResult = await prisma.order.updateMany({
      where: {
        status: 'InWay'
      },
      data: {
        status: OrderStatusEnum.IN_WAY
      }
    });
    console.log(`Fixed ${inWayResult.count} orders with 'InWay' status`);
    
    // Fix 'canceled' to 'CANCELED'
    const canceledResult = await prisma.order.updateMany({
      where: {
        status: 'canceled'
      },
      data: {
        status: OrderStatusEnum.CANCELED
      }
    });
    console.log(`Fixed ${canceledResult.count} orders with 'canceled' status`);
    
    console.log('Order status case fix completed successfully');
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the fix function
fixOrderStatusValues();
