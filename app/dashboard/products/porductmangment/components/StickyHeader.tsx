import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Supplier } from '@prisma/client'; // Added import

import FilterSection from './FilterSection';
import ProductCountBadge from './ProductCountBadge';

interface StickyHeaderProps {
  suppliers: Supplier[];
  productCount: number;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ suppliers, productCount }) => {
  return (
    <div className='sticky top-0 z-50 border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <Card className='rounded-none border-x-0 border-t-0 shadow-none'>
        <CardContent className='flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center'>
          {/* Filter Section */}
          <FilterSection suppliers={suppliers} />

          {/* Product Count Badge */}
          <ProductCountBadge productCount={productCount} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StickyHeader;
