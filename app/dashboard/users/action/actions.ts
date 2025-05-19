'use server';
import db from '@/lib/prisma';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Define the User type
export type UserWithOrders = {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  role: string;
  address: string | null;
  isOtp: boolean;
  latitude: string;
  longitude: string;
  orders: { id: string; status: string; orderNumber: string }[];
};

// Fetch users with search and role filters
export async function getUsers() {
  try {
    return await prisma.user.findMany({
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            orderNumber: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

export async function getUserToUpdate(userId: string) {
  try {
    const userData = await db.user.findFirst({
      where: { id: userId },
    });
    return userData;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

export async function updateUserData(formData: FormData) {
  try {
    const userId = formData.get('id') as string;
    if (!userId) {
      throw new Error('User ID is required');
    }

    const data = {
      phone: formData.get('phone') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string | null,
      address: formData.get('address') as string | null,
      role: formData.get('role') as string | 'user',
      isOtp: formData.get('isOtp') === 'true',
      latitude: formData.get('latitude') as string,
      longitude: formData.get('longitude') as string,
    };

    // Check if phone or email already exists for another user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: data.phone, NOT: { id: userId } },
          { email: data.email, NOT: { id: userId } },
        ],
      },
    });

    if (existingUser) {
      return { msg: 'رقم الهاتف أو البريد الإلكتروني موجود بالفعل لمستخدم آخر' };
    }

    await prisma.user.update({
      where: { id: userId },
      data,
    });
    revalidatePath('/dashboard/users');
    return { msg: 'تم تحديث المستخدم بنجاح' };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

export async function userData(id: string) {
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
