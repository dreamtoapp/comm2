/**
 * Order Status Fix Script for MongoDB
 * 
 * This script directly updates the MongoDB database to fix order status values
 * to match the OrderStatusEnum values defined in the Prisma schema.
 */

// Import MongoDB driver
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Get MongoDB connection string from environment variables
const uri = process.env.DATABASE_URL;

async function fixOrderStatus() {
  if (!uri) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Get the database name from the connection string
    const dbName = uri.split('/').pop().split('?')[0];
    const db = client.db(dbName);
    
    // Get the Order collection
    const orderCollection = db.collection('Order');
    
    console.log('Fixing order status values...');
    
    // Fix 'InWay' to 'IN_WAY'
    const inWayResult = await orderCollection.updateMany(
      { status: 'InWay' },
      { $set: { status: 'IN_WAY' } }
    );
    console.log(`Updated ${inWayResult.modifiedCount} orders from 'InWay' to 'IN_WAY'`);
    
    // Fix 'Delivered' to 'DELIVERED'
    const deliveredResult = await orderCollection.updateMany(
      { status: 'Delivered' },
      { $set: { status: 'DELIVERED' } }
    );
    console.log(`Updated ${deliveredResult.modifiedCount} orders from 'Delivered' to 'DELIVERED'`);
    
    // Fix 'Pending' to 'PENDING'
    const pendingResult = await orderCollection.updateMany(
      { status: 'Pending' },
      { $set: { status: 'PENDING' } }
    );
    console.log(`Updated ${pendingResult.modifiedCount} orders from 'Pending' to 'PENDING'`);
    
    // Fix 'Canceled' to 'CANCELED'
    const canceledResult = await orderCollection.updateMany(
      { status: 'Canceled' },
      { $set: { status: 'CANCELED' } }
    );
    console.log(`Updated ${canceledResult.modifiedCount} orders from 'Canceled' to 'CANCELED'`);
    
    console.log('Order status fix completed successfully');
  } catch (error) {
    console.error('Error fixing order status:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the fix function
fixOrderStatus();
