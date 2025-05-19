import { cache as reactCache } from 'react';
import { unstable_cache as nextCache } from 'next/cache';

// We're using generics now, so explicit 'any' is less of an issue here.
// The original eslint-disable might have been for the 'any' in the old Callback.
// Consider if it's still needed or can be refined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<Args extends unknown[], Return> = (...args: Args) => Promise<Return>;

export function cacheData<
  Args extends unknown[],
  Return,
  T extends Callback<Args, Return>
>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] },
) {
  return nextCache(reactCache(cb), keyParts, options);
}
