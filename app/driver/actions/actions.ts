'use server';

import db from '../../../lib/prisma';

interface Driver {
  id: string;
  name: string;
  phone: string;
}

export async function authenticateDriver(
  formData: FormData,
): Promise<{ driver?: Driver; error?: string }> {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  try {
    const driver = await db.driver.findFirst({
      where: { phone, password },
      select: { id: true, name: true, phone: true },
    });

    if (!driver) {
      return { error: 'رقم الجوال أو كلمة المرور غير صحيحة' };
    }

    return { driver };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'فشل التحقق. الرجاء المحاولة لاحقًا.' };
  }
}
