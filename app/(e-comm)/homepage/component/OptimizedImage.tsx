'use client';

import { useState } from 'react';

import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  index?: number;
}

/**
 * Optimized image component that prioritizes first 8 images
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  index = 999, // Default high value to ensure it's lazy loaded if not specified
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Automatically set priority for first 8 images
  const shouldPrioritize = priority || index < 8;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {/* Loading state */}
      {isLoading && !hasError && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
          <div className='h-full w-full animate-pulse bg-gradient-to-r from-gray-200 to-gray-300'></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
          <span className='text-sm text-gray-500'>No Image Available</span>
        </div>
      )}

      {/* Image */}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        quality={80}
        loading={shouldPrioritize ? 'eager' : 'lazy'}
        priority={shouldPrioritize}
        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        className={`object-cover duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${hasError ? 'hidden' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          // Try to use fallback image
          if (imgSrc !== '/fallback/product-fallback.avif') {
            setImgSrc('/fallback/product-fallback.avif');
          } else {
            // If fallback also fails, show error state
            setHasError(true);
          }
        }}
      />
    </div>
  );
}
