/**
 * Order Status Migration Script
 * 
 * This script migrates existing order status values from string literals to the new OrderStatusEnum values.
 * It should be run after deploying the schema changes to ensure data consistency.
 */

import { PrismaClient } from '@prisma/client';
import { OrderStatus } from '../constant/order-status';

const prisma = new PrismaClient();

async function migrateOrderStatus() {
  console.log('Starting order status migration...');

  try {
    // Get all orders
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
      },
    });

    console.log(`Found ${orders.length} orders to migrate`);

    // Track counts for reporting
    const counts = {
      pending: 0,
      inWay: 0,
      delivered: 0,
      canceled: 0,
      unknown: 0,
      total: orders.length,
    };

    // Process orders in batches to avoid overwhelming the database
    const batchSize = 100;
    const batches = Math.ceil(orders.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, orders.length);
      const batch = orders.slice(start, end);
      
      console.log(`Processing batch ${i + 1}/${batches} (${batch.length} orders)...`);

      // Process each order in the batch
      for (const order of batch) {
        // Get the current status as a string
        const currentStatus = order.status as string;
        
        // Map the string status to the new enum value
        let newStatus: OrderStatus;
        
        switch (currentStatus) {
          case 'Pending':
            newStatus = OrderStatus.PENDING;
            counts.pending++;
            break;
          case 'InWay':
            newStatus = OrderStatus.IN_WAY;
            counts.inWay++;
            break;
          case 'Delivered':
            newStatus = OrderStatus.DELIVERED;
            counts.delivered++;
            break;
          case 'canceled':
            newStatus = OrderStatus.CANCELED;
            counts.canceled++;
            break;
          default:
            // Handle any unexpected status values
            console.warn(`Unknown status "${currentStatus}" for order ${order.id}, defaulting to PENDING`);
            newStatus = OrderStatus.PENDING;
            counts.unknown++;
            break;
        }

        // Update the order with the new status
        await prisma.order.update({
          where: { id: order.id },
          data: { status: newStatus },
        });
      }
    }

    // Log the results
    console.log('\nMigration completed successfully!');
    console.log('Status migration summary:');
    console.log(`- Total orders: ${counts.total}`);
    console.log(`- Pending → PENDING: ${counts.pending}`);
    console.log(`- InWay → IN_WAY: ${counts.inWay}`);
    console.log(`- Delivered → DELIVERED: ${counts.delivered}`);
    console.log(`- canceled → CANCELED: ${counts.canceled}`);
    
    if (counts.unknown > 0) {
      console.log(`- Unknown status (defaulted to PENDING): ${counts.unknown}`);
    }
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateOrderStatus()
  .then(() => {
    console.log('Migration script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
