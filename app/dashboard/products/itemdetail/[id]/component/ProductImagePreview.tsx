import React, { useState } from 'react';

import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductImagePreviewProps {
  src: string;
  alt: string;
  fallbackSrc: string;
}

// Renders the product image with a loading skeleton and aspect ratio
const ProductImagePreview: React.FC<ProductImagePreviewProps> = ({ src, alt, fallbackSrc }) => {
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <div className='relative flex min-h-[120px] min-w-[200px] items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm md:min-h-[180px] md:min-w-[320px]'>
      <AspectRatio ratio={16 / 9}>
        <Image
          src={src || fallbackSrc}
          alt={alt}
          fill
          className='h-full w-full bg-background object-cover'
          onLoad={() => setImageLoading(false)}
          sizes='(max-width: 640px) 90vw, (max-width: 1200px) 33vw, 25vw'
          priority={false}
        />
        {imageLoading && <Skeleton className='absolute inset-0 z-10 h-full w-full bg-muted/60' />}
      </AspectRatio>
    </div>
  );
};

export default ProductImagePreview;
