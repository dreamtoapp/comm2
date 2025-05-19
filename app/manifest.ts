import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'amwag',
    short_name: 'amwag',
    description: 'Your app description',
    start_url: '/driver-trip',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2196f3', // Match your theme color
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any', // Add for modern PWA support
      },
    ],
  };
}
