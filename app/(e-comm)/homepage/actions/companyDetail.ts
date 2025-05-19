'use server';

import db from '@/lib/prisma';

export const companyInfo = async () => {
  return await db.company.findFirst();
};
