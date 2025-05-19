'use server';
import db from '@/lib/prisma';

export async function fetchSuppliers() {
  return db.supplier.findMany({
    select: {
      id: true,
      name: true,
      logo: true,
      type: true,
    },
    orderBy: { name: 'asc' },
  });
}
