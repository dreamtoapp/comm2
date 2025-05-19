'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';

export async function assignDriver(orderId: string, driverId: string) {


  try {
    const session = await auth();

    if (!session?.user) {
      return {
        state: 'error',
        message: 'You must be logged in to assign a driver.',
      };
    }

    if (!orderId || !driverId) {
      return {
        state: 'error',
        message: 'Missing order or driver ID.',
      };
    }

    // Check if the driver exists
    const driver = await db.driver.findUnique({
      where: {
        id: driverId,
      },
    });

    if (!driver) {
      return {
        state: 'error',
        message: 'Driver not found.',
      };
    }

    // Update the order with the driver ID
    await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        driverId: driverId,
        status: ORDER_STATUS.IN_TRANSIT, // Update the order status to ASSIGNED
      },
    });

    revalidatePath('/dashboard/orders-management/status/pending');
    return {
      state: 'success',
      message: 'Driver assigned successfully!',
    };
  } catch (error: any) {
    console.error('Error assigning driver:', error);
    return {
      state: 'error',
      message: error.message || 'Failed to assign driver.',
    };
  }
}
