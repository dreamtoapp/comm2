'use server';
import db from '@/lib/prisma';

export const getOfferCategory = async () => {
  const offerCategory = await db.supplier.findMany({
    where: {
      type: 'offer',
    },
    select: {
      id: true,
      name: true,
    },
  });
  return offerCategory;
};
