// Server action to get a single promotion by ID
import db from '@/lib/prisma';

export async function getPromotionById(id: string) {
  return db.promotion.findUnique({
    where: { id },
    select: {
      id: true,
      title: true, // Use 'title' instead of 'name' for Promotion
      // Add other fields as needed
    },
  });
}
