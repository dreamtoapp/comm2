'use server';

import db from '../../../../lib/prisma';

export const fetchTrackInfo = async (orderid: string) => {
  const latAndlong = await db.orderInWay.findUnique({
    where: { orderId: orderid },
    include: { order: true, driver: true },
  });
  console.log('latAndlong', latAndlong);
  return latAndlong;
};
