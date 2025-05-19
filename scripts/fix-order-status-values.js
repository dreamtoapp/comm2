/**
 * Order Status Values Fix Script
 * 
 * This script updates all order status values in the database to match the OrderStatusEnum values.
 * It fixes any case sensitivity issues or incorrect values.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the correct enum values from the schema
const OrderStatusEnum = {
  PENDING: 'PENDING',
  IN_WAY: 'IN_WAY',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED'
};

// Define mappings from possible variations to the correct enum values
const statusMappings = {
  'pending': OrderStatusEnum.PENDING,
  'Pending': OrderStatusEnum.PENDING,
  'PENDING': OrderStatusEnum.PENDING,
  
  'in_way': OrderStatusEnum.IN_WAY,
  'inway': OrderStatusEnum.IN_WAY,
  'InWay': OrderStatusEnum.IN_WAY,
  'In Way': OrderStatusEnum.IN_WAY,
  'IN_WAY': OrderStatusEnum.IN_WAY,
  
  'delivered': OrderStatusEnum.DELIVERED,
  'Delivered': OrderStatusEnum.DELIVERED,
  'DELIVERED': OrderStatusEnum.DELIVERED,
  
  'canceled': OrderStatusEnum.CANCELED,
  'cancelled': OrderStatusEnum.CANCELED,
  'Canceled': OrderStatusEnum.CANCELED,
  'Cancelled': OrderStatusEnum.CANCELED,
  'CANCELED': OrderStatusEnum.CANCELED,
  'CANCELLED': OrderStatusEnum.CANCELED
};

async function fixOrderStatusValues() {
  console.log('Starting order status values fix...');
  
  try {
    // Get all orders
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true
      }
    });
    
    console.log(`Found ${orders.length} orders to check`);
    
    // Track statistics
    const stats = {
      total: orders.length,
      updated: 0,
      skipped: 0,
      errors: 0,
      statusCounts: {}
    };
    
    // Process each order
    for (const order of orders) {
      try {
        const currentStatus = order.status;
        
        // Skip if the status is already one of the exact enum values
        if (Object.values(OrderStatusEnum).includes(currentStatus)) {
          stats.skipped++;
          stats.statusCounts[currentStatus] = (stats.statusCounts[currentStatus] || 0) + 1;
          continue;
        }
        
        // Find the correct mapping
        const correctStatus = statusMappings[currentStatus];
        
        if (correctStatus) {
          // Update the order with the correct status
          await prisma.order.update({
            where: { id: order.id },
            data: { status: correctStatus }
          });
          
          console.log(`Updated order ${order.id}: ${currentStatus} → ${correctStatus}`);
          stats.updated++;
          stats.statusCounts[correctStatus] = (stats.statusCounts[correctStatus] || 0) + 1;
        } else {
          console.warn(`Unknown status value for order ${order.id}: ${currentStatus}`);
          stats.errors++;
        }
      } catch (err) {
        console.error(`Error processing order ${order.id}:`, err);
        stats.errors++;
      }
    }
    
    // Print summary
    console.log('\nFix Summary:');
    console.log(`Total orders: ${stats.total}`);
    console.log(`Updated: ${stats.updated}`);
    console.log(`Skipped (already correct): ${stats.skipped}`);
    console.log(`Errors: ${stats.errors}`);
    
    console.log('\nStatus Distribution:');
    for (const status of Object.values(OrderStatusEnum)) {
      console.log(`${status}: ${stats.statusCounts[status] || 0}`);
    }
    
    console.log('\nOrder status values fix completed successfully');
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix function
fixOrderStatusValues();
