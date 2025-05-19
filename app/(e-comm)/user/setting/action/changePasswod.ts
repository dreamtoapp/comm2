'use server';

import { auth } from '@/auth';
import db from '@/lib/prisma';

export const changePassword = async (password: string) => {
  try {
    const session = await auth();
    const userid = session?.user.id;
    await db.user.update({
      where: { id: userid },
      data: { password },
    });
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error('Failed to change password');
  }
};
