'use server';

import db from '@/lib/prisma';

export const updateDriverLocation = async (data: {
  driverId: string;
  orderId: string;
  latitude: number;
  longitude: number;
}) => {
  try {
    const updatedOrder = await db.orderInWay.update({
      where: { driverId: data.driverId },
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
      include: {
        order: true,
        driver: true,
      },
    });

    await db.locationHistory.create({
      data: {
        driverId: data.driverId,
        orderId: data.orderId,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    return { success: true, data: updatedOrder };
  } catch (error) {
    console.error('Failed to update driver location:', error);
    return { success: false, error: 'Failed to update location' };
  }
};
