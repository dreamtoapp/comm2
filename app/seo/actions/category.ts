"use server"

import db from '@/lib/prisma';

export async function getCategoryById(id: string) {
  console.log({ id })
  try {
    const category = await db.category.findUnique({
      where: { id },
    });
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}
