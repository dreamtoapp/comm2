// lib/revalidate.ts
import { revalidateTag } from 'next/cache';

export async function revalidateDriversList() {
  // This will force revalidation of the drivers_list cache
  return revalidateTag('drivers_list');
}
