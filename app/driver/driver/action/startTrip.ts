'use server';
import db from '@/lib/prisma';
import { OrderInWay } from '@prisma/client';

type Result<T = OrderInWay> =
  | { success: true; data: T }
  | { success: false; error: string };

const isValidId = (id: string) => /^[0-9a-f]{24}$/.test(id);

export const startTrip = async (
  orderId: string,
  driverId: string,
  latitude: number,
  longitude: number,
): Promise<Result> => {
  if (!isValidId(orderId) || !isValidId(driverId)) {
    return { success: false, error: 'Invalid ID format' };
  }

  try {
    const existingTrip = await db.orderInWay.findFirst({
      where: { driverId },
    });

    if (existingTrip) {
      return {
        success: false,
        error: 'يوجد رحلة نشطة بالفعل. يجب إغلاق الرحلة الحالية أولاً',
      };
    }

    const record = await db.orderInWay.create({
      data: {
        orderId,
        driverId,
        latitude,
        longitude,
      },
    });

    await db.order.update({
      where: { id: orderId },
      data: { isTripStart: true },
    });

    return { success: true, data: record };
  } catch (error) {
    console.error('Database error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'فشل بدء الرحلة'
    };
  }
};

export const updateCoordinates = async (
  orderId: string,
  driverId: string,
  latitude: number,
  longitude: number,
): Promise<Result> => {
  if (!isValidId(orderId) || !isValidId(driverId)) {
    return { success: false, error: 'Invalid ID format' };
  }

  try {
    const updated = await db.orderInWay.update({
      where: { orderId_driverId: { orderId, driverId } },
      data: { latitude, longitude },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error('Update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update failed'
    };
  }
};