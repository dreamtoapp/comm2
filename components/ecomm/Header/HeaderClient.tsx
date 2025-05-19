// HeaderClient.tsx
'use client';

import {
  useEffect,
  useState
} from 'react';
import BackButton from './BackButton';

import { Session } from 'next-auth';
import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

const CartIcon = dynamic(() => import('./CartIcon'), {
  ssr: false,
  loading: () => <Skeleton className='h-9 w-9 rounded-full' />,
});

const UserMenu = dynamic(() => import('./UserMenu'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center gap-2'>
      <Skeleton className='h-9 w-9 rounded-full' />
      <Skeleton className='h-4 w-20' />
    </div>
  ),
});

const MobileMenu = dynamic(() => import('./MobileMenu'), {
  ssr: false,
  loading: () => <Skeleton className='h-9 w-9 rounded-lg md:hidden' />,
});

interface HeaderClientProps {
  session: Session | null; // Allow null
}

export default function HeaderClient({ session }: HeaderClientProps) {
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className='flex items-center gap-4 md:gap-6'>
      {/* Burger menu for mobile only (first action) */}
      <span className="md:hidden">
        <MobileMenu aria-label="القائمة الرئيسية" />
      </span>
      {/* Back button for mobile only */}
      <span className="md:hidden">
        <BackButton />
      </span>
      <CartIcon aria-label='Cart' />
      <UserMenu session={session} aria-label="User account menu" />
    </div>
  );
}
