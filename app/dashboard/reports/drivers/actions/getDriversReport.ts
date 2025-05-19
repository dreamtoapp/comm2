import db from '@/lib/prisma';

export async function getDriversReport() {
  // Fetch drivers and delivery stats
  return db.driver.findMany({
    include: {
      orders: true,
    },
    orderBy: [{ name: 'asc' }],
  });
}
