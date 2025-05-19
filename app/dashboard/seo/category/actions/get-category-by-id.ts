// Server action to get a single category by ID
import { db } from '@/lib/db';

export async function getCategoryById(id: string) {
  return db.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true, // 'name' is correct for Category model
      // Add other fields as needed
    },
  });
}
