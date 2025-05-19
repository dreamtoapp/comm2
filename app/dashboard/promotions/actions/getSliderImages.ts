import db from '@/lib/prisma';

export async function getSliderImages() {
  // Fetch all slider images from the promotion table
  // Adjust the query if you have a different table/field
  return db.promotion.findMany({
    select: {
      id: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
