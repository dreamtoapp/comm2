'use server';
import { auth } from '@/auth';
import db from '@/lib/prisma';
import { prevState } from '@/types/commonType';

export const updateUserProfile = async (_prevState: prevState, formData: FormData) => {
  try {
    // 1. Get authenticated user
    const session = await auth();
    // const session = await getSession();
    if (!session?.user) {
      return { success: false, message: 'لابد من التسجيل لاتمام العتحديث' };
    }
    const userId = session.user.id;

    // 2. Get existing user data
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return { success: false, message: 'معلومات العميل غير متوفرة حاليا ' };
    }

    // Extract form data
    const updateData = {
      name: formData.get('name') as string | undefined,
      // phone: formData.get('phone') as string | undefined,
      email: formData.get('email') as string | undefined,
      password: formData.get('password') as string | undefined,
      address: formData.get('address') as string | undefined,
      latitude: formData.get('latitude') as string | undefined,
      longitude: formData.get('longitude') as string | undefined,
    };

    // 3. Check if the new email already exists in the database
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await db.user.findFirst({
        where: { email: updateData.email },
      });

      if (emailExists) {
        return { success: false, message: 'البريد الإلكتروني الجديد مستخدم بالفعل' };
      }
    }

    // 4. Update the user profile
    await db.user.update({
      where: { id: userId },
      data: {
        ...updateData,
      },
    });

    return { success: true, message: 'تم التحديث بنجاح' };
  } catch (error) {
    console.error('Update failed:', error);
    return { success: false, message: 'Update failed' };
  }
};
