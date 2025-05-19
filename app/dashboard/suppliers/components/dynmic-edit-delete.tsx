// app/dashboard/suppliers/components/supplier-actions.client.tsx
'use client';

import dynamic from 'next/dynamic';

import { ButtonSkeleton } from '@/components/ui/ButtonSkeleton';

export const EditSupplierDialog = dynamic(() => import('./EditSupplierDialog'), {
  ssr: false,
  loading: () => <ButtonSkeleton />,
});

export const DeleteSupplierAlert = dynamic(() => import('./DeleteSupplierAlert'), {
  ssr: false,
  loading: () => <ButtonSkeleton />,
});
