// console.warn("NEXTAUTH_URL at runtime:", process.env.NEXTAUTH_URL);

import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { getAccountById, getUserById } from './app/(e-comm)/auth/action';
import authConfig from './auth.config';
import db from './lib/prisma';

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  ...authConfig,
  callbacks: {
    async jwt({ token, trigger }) {
      if (trigger === 'update' && token.email) {
        return token;
      }

      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existAccuount = await getAccountById(existingUser.id);

      token.isOauth = !!existAccuount;
      token.id = existingUser.id;
      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.phone = existingUser.phone;
      token.image = existingUser.image;
      token.latitude = existingUser.latitude;
      token.longitude = existingUser.longitude;
      token.address = existingUser.address;
      token.isOtp = existingUser.isOtp;

      return token;
    },
    async session({ token, session }: { token: any; session: any }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string | undefined,
          role: token.role as string | undefined,
          name: token.name as string | null | undefined,
          email: token.email as string | null | undefined,
          phone: token.phone as string | undefined,
          image: token.image as string | undefined,
          latitude: token.latitude as number | undefined,
          longitude: token.longitude as number | undefined,
          address: token.address as string | undefined,
          isOtp: token.isOtp as boolean | undefined,
          isOauth: token.isOauth as boolean | undefined,
        },
      };
    },
  },
});
