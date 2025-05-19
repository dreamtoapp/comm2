// actions/createOrder.ts
'use server';
import { auth } from '@/auth';
import db from '@/lib/prisma';
import { pusherServer } from '@/lib/pusherServer';
// import { pusherServer } from '@/lib/pusherSetting'; // Commented out for reference
//  TODO:import { OrderCartItem } from '../../../../types/order'; need to remove and refactore
import { OrderCartItem } from '../../../../types/order';
import { generateOrderNumber } from '../helpers/orderNumber';

export async function CreateOrderInDb(orderData: {
  userId: string;
  phone: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  cart: OrderCartItem[];
  totalAmount: number;
  totalItems: number;
  shiftId: string;
}) {
  try {
    // Check if the user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      throw new Error('User is not authenticated');
    }

    const userId = session.user.id;
    if (!userId) {
      throw new Error('Authenticated user ID is missing');
    }

    const orderNumber = await generateOrderNumber();

    const createdOrder = await db.order.create({
      data: {
        orderNumber,
        customerId: userId,
        // TODO:remove custemr name no need any more relate it with the user info from UserTable
        customerName: orderData.name,
        amount: orderData.totalAmount,
        shiftId: orderData.shiftId,
        latitude: orderData.lat,
        longitude: orderData.lng,
        items: {
          create: orderData.cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // إنشاء إشعار الطلب
    const notificationMessage = `طلب جديد #${orderNumber} -- ${orderData.totalAmount}`;

    const puserNotifactionmsg = {
      message: `طلب جديد #${orderNumber} -- ${orderData.totalAmount}`,
      type: 'order',
    };

    // Save the notification to the database
    await db.notification.create({
      data: {
        message: notificationMessage,
        type: 'order',
        status: 'unread',
        userId: userId, // Associate the notification with the authenticated user
      },
    });

    // إرسال الإشعار عبر Pusher
    await pusherServer.trigger('admin', 'new-order', {
      message: notificationMessage, // Send the message as a string
      type: puserNotifactionmsg.type, // Include the type explicitly
    });

    return createdOrder.orderNumber;
  } catch (error) {
    console.error('فشل في إنشاء الطلب:', error);
    throw new Error('حدث خطأ أثناء إنشاء الطلب');
  }
}
