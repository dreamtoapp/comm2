import React from 'react';
import { Package } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

interface ProductCountBadgeProps {
  productCount: number;
}

const ProductCountBadge: React.FC<ProductCountBadgeProps> = ({ productCount }) => {
  return (
    <Badge
      variant='outline'
      className='flex items-center gap-2 border-primary px-5 py-3 text-lg font-semibold text-primary transition-colors hover:bg-primary/10'
    >
      <Package className={iconVariants({ size: 'sm' })} /> {/* Use direct import + CVA */} عدد المنتجات: {productCount}
    </Badge>
  );
};

export default ProductCountBadge;
