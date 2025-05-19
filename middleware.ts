import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This middleware runs on every request
export function middleware(_request: NextRequest) {
  // Get the response
  const response = NextResponse.next();

  // Set cache-control headers to enable backforward cache
  // This will override the default no-store header
  response.headers.set(
    'Cache-Control',
    'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  );

  // Remove headers that prevent backforward cache
  response.headers.delete('Cache-Control-no-store');

  // Add performance-related headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add security headers
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Add resource hints for critical resources
  response.headers.set(
    'Link',
    '</fonts/cairo-v28-arabic-regular.woff2>; rel=preload; as=font; crossorigin=anonymous',
  );

  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all routes under e-comm
    '/(e-comm)/:path*',
    // Apply to static assets
    '/images/:path*',
    '/fonts/:path*',
    '/fallback/:path*',
  ],
};
