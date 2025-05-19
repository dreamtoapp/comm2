import Image from 'next/image';
import React, { forwardRef } from 'react';

// Constants for image optimization
const COMMON_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

const IMAGE_QUALITY_SETTINGS = {
  thumbnail: 60,
  preview: 75,
  standard: 85,
  high: 95,
} as const;

const DEFAULT_BLUR_BASE64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR0XFx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

export interface ResponsiveImageSource {
  src: string;
  width: number;
  height: number;
  breakpoint?: keyof typeof COMMON_BREAKPOINTS;
}

export interface ImageSEOProps {
  // Required props
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: keyof typeof IMAGE_QUALITY_SETTINGS;
  // Art direction support
  responsiveSources?: ResponsiveImageSource[];
  // SEO metadata
  caption?: string;
  title?: string;
  description?: string;
  license?: string;
  creditText?: string;
  // Performance
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
  onError?: () => void;
  // Next.js specific props
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  unoptimized?: boolean;
}

/**
 * OptimizedImage component for SEO-friendly images
 * - Generates blur placeholder
 * - Handles lazy loading
 * - Ensures proper dimensions
 * - Supports responsive sizes
 * - Implements proper alt text
 */
export const OptimizedImage = forwardRef<HTMLImageElement, ImageSEOProps>(({
  // Required props
  src,
  alt,
  width,
  height,
  // Optional props with Next.js recommended defaults
  quality = 75, // Next.js recommended default
  loading = 'lazy',
  sizes = '100vw',
  className = '',
  priority = false,
  // Advanced optimization props
  responsiveSources,
  caption,
  title,
  description,
  license,
  creditText,
  fetchPriority = priority ? 'high' : 'auto',
  decoding = 'async',
  // Next.js specific props
  placeholder = 'blur',
  blurDataURL,
  unoptimized = false,

}, ref) => {
  // Generate responsive sizes string if not provided
  const defaultSizes = responsiveSources
    ? responsiveSources
        .map(
          (source: ResponsiveImageSource) =>
            `(min-width: ${COMMON_BREAKPOINTS[source.breakpoint || 'sm']}px) ${source.width}px`
        )
        .join(', ')
    : '100vw';

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!responsiveSources) return undefined;
    return responsiveSources
      .map((source: ResponsiveImageSource) => `${source.src} ${source.width}w`)
      .join(', ');
  };

  // Get quality setting
  const imageQuality = typeof quality === 'string' 
    ? IMAGE_QUALITY_SETTINGS[quality as keyof typeof IMAGE_QUALITY_SETTINGS]
    : (quality ?? IMAGE_QUALITY_SETTINGS.standard);

  return (
    <figure className={className}>
      <Image
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes={sizes || defaultSizes}
        quality={imageQuality}
        placeholder={placeholder || 'blur'}
        blurDataURL={blurDataURL || DEFAULT_BLUR_BASE64}
        unoptimized={unoptimized}
        className="max-w-full h-auto"
        priority={priority}
        fetchPriority={fetchPriority}
        decoding={decoding}
        {...(responsiveSources && { srcSet: generateSrcSet() })}
      />
      {(caption || title || description || creditText) && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {title && <strong className="block">{title}</strong>}
          {caption && <p>{caption}</p>}
          {description && <p className="text-xs mt-1">{description}</p>}
          {creditText && (
            <p className="text-xs mt-1 italic">
              Credit: {creditText}
              {license && ` (${license})`}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
});

/**
 * Helper function to generate image metadata for SEO
 */
export const generateImageMetadata = (image: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) => ({
  url: image.src,
  alt: image.alt,
  width: image.width,
  height: image.height,
  type: image.src.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
});

/**
 * Utility to validate image dimensions and aspect ratio
 */
export const validateImageDimensions = ({
  width,
  height,
  minWidth = 200,
  maxWidth = 2048,
  minHeight = 200,
  maxHeight = 2048,
  aspectRatio,
}: {
  width: number;
  height: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
}) => {
  const isValidWidth = width >= minWidth && width <= maxWidth;
  const isValidHeight = height >= minHeight && height <= maxHeight;
  const isValidAspectRatio = !aspectRatio || Math.abs(width / height - aspectRatio) < 0.01;

  return {
    isValid: isValidWidth && isValidHeight && isValidAspectRatio,
    errors: {
      width: !isValidWidth ? `Width must be between ${minWidth} and ${maxWidth}px` : null,
      height: !isValidHeight ? `Height must be between ${minHeight} and ${maxHeight}px` : null,
      aspectRatio: !isValidAspectRatio ? `Invalid aspect ratio` : null,
    },
  };
};
