import db from '../../../../../lib/prisma';

export async function userStatment(id: string) {
  try {
    const userData = await db.user.findFirst({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            orderNumber: true,
            createdAt: true,
            amount: true,
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return userData;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}
