'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PromotionBadgeProps {
    discountPercentage: number;
    className?: string;
}

export default function PromotionBadge({ discountPercentage, className }: PromotionBadgeProps) {
    if (!discountPercentage || discountPercentage <= 0) return null;

    return (
        <Badge
            className={cn(
                'absolute right-3 top-3 z-10 bg-red-500 text-white',
                className
            )}
        >
            خصم {Math.round(discountPercentage)}%
        </Badge>
    );
} 