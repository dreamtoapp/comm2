'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const SkeletonLoader = () => <div className='animate-pulse'>Loading...</div>;

const CategoryList = dynamic(() => import('./supplier/CategoryList'), {
  loading: SkeletonLoader,
});

// Add new import for real category list
const RealCategoryList = dynamic(() => import('./categories/CategoryList'), {
  loading: SkeletonLoader,
});

const CheckUserActivation = dynamic(() => import('./CheckUserActivation'), {
  loading: SkeletonLoader,
});
const CheckUserLocation = dynamic(() => import('./CheckUserLocation'), {
  loading: SkeletonLoader,
});

// Props for each wrapper
export function CategoryListClient(props: React.ComponentProps<typeof CategoryList>) {
  return <CategoryList {...props} />;
}

// Add new client wrapper for real categories
export function RealCategoryListClient(props: React.ComponentProps<typeof RealCategoryList>) {
  return <RealCategoryList {...props} />;
}

export function CheckUserActivationClient(props: React.ComponentProps<typeof CheckUserActivation>) {
  return <CheckUserActivation {...props} />;
}

export function CheckUserLocationClient(props: React.ComponentProps<typeof CheckUserLocation>) {
  return <CheckUserLocation {...props} />;
}
