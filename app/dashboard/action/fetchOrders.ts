'use server';
import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';
import { Order } from '@/types/cardType';

// Define the argument type for clarity
type FetchOrdersArgs = {
  status?: string;
  page?: number;
  pageSize?: number;
};

// Cached fetchOrdersAction
export const fetchOrdersAction = cacheData<
  [FetchOrdersArgs?], // Args type: An array containing zero or one FetchOrdersArgs object
  Order[], // Return type
  (args?: FetchOrdersArgs) => Promise<Order[]> // Update T to reflect optional arg
>(
  // Modify implementation to accept optional arg and handle undefined
  async (args?: FetchOrdersArgs) => {
    const { status, page = 1, pageSize = 10 } = args || {}; // Handle undefined args before destructuring
    try {
      // Create a where clause for status filtering
      let whereClause = {};
      
      if (status) {
        // Use the status directly as a string value
        whereClause = { status };
      }
      
      const orders = await db.order.findMany({
        where: whereClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          status: true,
          isTripStart: true,
          resonOfcancel: true,
          amount: true,
          createdAt: true,
          updatedAt: true,
          customerId: true,
          shiftId: true,
          driverId: true,
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
          shift: {
            select: {
              id: true,
              name: true,
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
        },
        orderBy: { updatedAt: 'desc' },
      });
      return orders as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders.');
    }
  },
  ['fetchOrders'], // Cache key
  { revalidate: 3600 }, // Revalidate every hour
);
