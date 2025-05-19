'use server';
import db from '@/lib/prisma';

export async function getSuppliers() {
  try {
    const suppliers = await db.supplier.findMany({
      // where: { // Removing type filter for now to show all suppliers
      //   type: 'company', 
      // },
      select: {
        id: true,
        name: true,
        logo: true,
        email: true,
        phone: true,
        type: true,
        createdAt: true,
        slug: true,      // Added
        address: true,   // Added
        updatedAt: true, // Added
        _count: { select: { products: true } },
      },
      orderBy: {
        createdAt: 'desc', // Optional: order by creation date
      }
    });

    return suppliers.map((supplier) => ({
      ...supplier,
      productCount: supplier._count.products,
    }));
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error('Failed to fetch suppliers.');
  }
}
