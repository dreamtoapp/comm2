import { headers } from 'next/headers';
// Removed unused import: import { CarouselImage } from '@/types/carouselTypes';

import SimpleCarousel from './SimpleCarousel';

// Remove local definition
// interface CarouselImage {
//   id: string;
//   url: string; // This component receives 'url'
//   alt: string;
// }

interface CarouselItem {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
  discountValue?: number | null;
  discountType?: string | null;
  linkUrl?: string;
}

interface ServerCarouselProps {
  images: CarouselItem[];
  className?: string;
}

export default async function ServerCarousel({ images, className }: ServerCarouselProps) {
  // Get the user agent from the request headers - using async/await as per Next.js 15 best practices
  let deviceType = 'desktop'; // Default to desktop

  try {
    // In Next.js 15, headers() is an async function that should be awaited
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    // Determine device type based on user agent
    if (userAgent.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      deviceType = 'mobile';
    } else if (userAgent.match(/iPad|tablet|Tablet|TabletPC/i)) {
      deviceType = 'tablet';
    }
  } catch (error) {
    console.error('Error accessing headers:', error);
    // Fall back to desktop if there's an error
  }

  // Map the received 'images' (with 'url') to the format expected by SimpleCarousel (with 'src')
  const mappedImages = images.map(img => ({
    id: img.id,
    src: img.url, // Map url to src
    alt: img.alt,
    title: img.title,
    description: img.description,
    discountValue: img.discountValue,
    discountType: img.discountType,
    linkUrl: img.linkUrl,
  }));

  return <SimpleCarousel images={mappedImages} deviceType={deviceType} className={className} />;
}
