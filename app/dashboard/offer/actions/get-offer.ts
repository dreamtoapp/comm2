'use server';
import db from '@/lib/prisma';

export async function getOfferCount() {
  try {
    const suppliers = await db.supplier.findMany({
      where: {
        type: 'offer', // Only fetch suppliers that are not deleted
      },
      select: {
        id: true,
        name: true,

        logo: true,
        type: true,
        _count: { select: { products: true } }, // Count of associated products
      },
    });

    return suppliers.map((supplier) => ({
      ...supplier,
      productCount: supplier._count.products, // Add product count to the supplier object
    }));
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error('Failed to fetch suppliers.');
  }
}
