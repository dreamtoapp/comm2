'use server';

import { prevState as _prevState } from '@/types/commonType';

import { signIn } from '../../../../../auth';
import db from '../../../../../lib/prisma';

export const userLogin = async (_prevState: _prevState, formData: FormData) => {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  // Validate input data
  if (!phone || !password) {
    return { success: false, message: 'جميع الحقةل مطلوبة' };
  }

  // Check if the user already exists
  const existingUser = await db.user.findUnique({
    where: { phone },
  });
  if (!existingUser) {
    return { success: false, message: 'المعلومات  غير صحيحية' };
  }

  if (existingUser.password !== password) {
    return { success: false, message: '... المعلومات  غير صحيحية' };
  }

  await signIn('credentials', {
    phone,
    password,
    // redirect: false,
    redirectTo: '/',
  });

  return { success: true, message: 'تم التسجيل بنجاح' };
};
