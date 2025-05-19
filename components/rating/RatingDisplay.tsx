'use client';
import { Star, StarHalf } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

import { cn } from '@/lib/utils';
// Removed Icon import: import { Icon } from '@/components/icons';
import RatingPreview from './RatingPreview';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
  productId?: string; // Optional product ID for linking to product page
  productSlug?: string; // Optional product slug for SEO-friendly URLs
}

export default function RatingDisplay({
  rating,
  reviewCount = 0,
  size = 'md',
  showCount = true,
  className,
  productId,
  productSlug,
}: RatingDisplayProps) {
  // Ensure rating is between 0 and 5
  const safeRating = Math.max(0, Math.min(5, rating));

  // Calculate full and partial stars
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;

  // Map component size to Icon component size
  const iconSize = {
    sm: 'xs' as const, // 14px -> xs (16px)
    md: 'sm' as const, // 16px -> sm (20px)
    lg: 'md' as const, // 20px -> md (24px)
  }[size];

  // Determine text size based on prop
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  // If productId AND productSlug are provided, use RatingPreview component for clickable ratings
  if (productId && productSlug) {
    return (
      <RatingPreview
        productId={productId}
        productSlug={productSlug}
        rating={rating}
        reviewCount={showCount ? reviewCount : 0}
        size={size === 'lg' ? 'md' : 'sm'}
        className={className}
        disableLink={false} // Allow linking since this is a standalone rating display
      />
    );
  }

  // Otherwise, use the standard display
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className='flex'>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star // Use direct import + CVA
            key={`full-${i}`}
            className={iconVariants({ size: iconSize, className: 'fill-amber-400 text-amber-400' })}
          />
        ))}

        {/* Half star if needed */}
        {hasHalfStar && (
          <StarHalf // Use direct import + CVA
            key='half'
            className={iconVariants({ size: iconSize, className: 'fill-amber-400 text-amber-400' })}
          />
        )}

        {/* Empty stars */}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} className={iconVariants({ size: iconSize, className: 'text-gray-300' })} /> // Use direct import + CVA
        ))}
      </div>

      {showCount && (
        <span className={cn('text-muted-foreground', textSize)}>
          {safeRating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
