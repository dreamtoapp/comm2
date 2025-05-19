import db from '@/lib/prisma';
import { cacheData } from '@/lib/cache'; // Import cacheData function

export const getDriver = cacheData(
  async () => {
    const data = await db.driver.findMany({ select: { id: true, name: true } });
    return data;
  },
  ['drivers_list'], // Cache key parts
  { revalidate: 60 }, // Cache options with revalidation every 60 seconds
);
