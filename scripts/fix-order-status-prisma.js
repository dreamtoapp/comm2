/**
 * Order Status Fix Script using Prisma
 * 
 * This script fixes order status values in the database to match the OrderStatusEnum values.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the correct enum values
const OrderStatus = {
  PENDING: 'PENDING',
  IN_WAY: 'IN_WAY',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED'
};

async function fixOrderStatus() {
  console.log('Starting order status fix...');
  
  try {
    // Get all orders with incorrect status values
    const orders = await prisma.$queryRaw`
      SELECT id, status FROM "Order"
      WHERE status NOT IN ('PENDING', 'IN_WAY', 'DELIVERED', 'CANCELED')
    `;
    
    console.log(`Found ${orders.length} orders with incorrect status values`);
    
    // Process each order with incorrect status
    for (const order of orders) {
      const currentStatus = order.status;
      let correctStatus = null;
      
      // Map incorrect status values to correct ones
      if (currentStatus === 'Pending' || currentStatus === 'pending') {
        correctStatus = OrderStatus.PENDING;
      } else if (currentStatus === 'InWay' || currentStatus === 'inWay' || currentStatus === 'in_way') {
        correctStatus = OrderStatus.IN_WAY;
      } else if (currentStatus === 'Delivered' || currentStatus === 'delivered') {
        correctStatus = OrderStatus.DELIVERED;
      } else if (currentStatus === 'Canceled' || currentStatus === 'canceled' || currentStatus === 'Cancelled') {
        correctStatus = OrderStatus.CANCELED;
      }
      
      if (correctStatus) {
        // Update the order with the correct status
        await prisma.order.update({
          where: { id: order.id },
          data: { status: correctStatus }
        });
        
        console.log(`Updated order ${order.id}: ${currentStatus} → ${correctStatus}`);
      } else {
        console.warn(`Unknown status value for order ${order.id}: ${currentStatus}`);
      }
    }
    
    console.log('Order status fix completed successfully');
  } catch (error) {
    console.error('Error fixing order status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix function
fixOrderStatus();
