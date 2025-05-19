// lib/check-is-login.ts
'use server';

import { auth } from '@/auth';
import { CustomSession } from '@/types/customSesstion';

export const checkIsLogin = async (): Promise<CustomSession | null> => {
  try {
    const session = await auth();

    if (!session?.user) return null;

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone,
        role: session.user.role,
        address: session.user.address,
        latitude: session.user.latitude,
        longitude: session.user.longitude,
        image: session.user.image,
        isOauth: session.user.isOauth,
        isOtp: session.user.isOtp,
      },
    } as CustomSession;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return null;
  }
};
