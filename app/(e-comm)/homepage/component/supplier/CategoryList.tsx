import Image from 'next/image';

import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Supplier {
  id: string;
  name: string;
  logo?: string | null;
  slug: string;
  type: string;
  _count?: { products: number };
}

interface ProductCategoryProps {
  suppliers: Supplier[];
  cardHeader: string;
  cardDescription: string;
}

const SupplierCard = ({ supplier, index }: { supplier: Supplier; index: number }) => {
  const productCount = supplier._count?.products ?? 0;
  const hasProducts = productCount > 0;

  return (
    <div className='group relative h-32 w-48 min-w-[150px] flex-shrink-0'>
      <div className={`'} absolute inset-0 rounded-lg border bg-card transition-all`}>
        <div className='relative h-full w-full overflow-hidden rounded-lg'>
          {supplier.logo ? (
            <Image
              src={supplier.logo}
              alt={supplier.name}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              className='object-cover'
              // loading="lazy"
              priority={index < 6}
              decoding='async'
            />
          ) : (
            <div className='absolute inset-0 bg-gradient-to-br from-muted/50 to-muted' />
          )}
        </div>

        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-2 text-white'>
          <h3 className='truncate text-xs font-medium'>{supplier.name}</h3>
          <Badge
            className={`mt-1 text-[0.65rem] font-medium transition-colors ${hasProducts ? 'bg-primary/90 hover:bg-primary' : 'bg-destructive/90'} `}
          >
            {hasProducts ? `${productCount} منتجات` : 'لا توجد منتجات'}
          </Badge>
          {supplier.type}
        </div>
      </div>
    </div>
  );
};

const CategoryList = ({ suppliers, cardHeader, cardDescription }: ProductCategoryProps) => (
  <Card className='mx-auto w-full bg-transparent shadow-sm'>
    <CardContent className='p-4'>
      <div className='flex items-center justify-between pb-3'>
        <div className='space-y-0.5'>
          <h2 className='text-lg font-semibold text-foreground'>{cardHeader}</h2>
          <p className='text-xs text-muted-foreground'>{cardDescription}</p>
        </div>
      </div>

      <ScrollArea className='w-full'>
        <div className='flex gap-3 pb-4'>
          {suppliers.map((supplier, index) => (
            <Link
              key={supplier.id}
              href={`?slug=${supplier.slug}`}
              scroll={false}
              shallow
              prefetch={false}
              className='outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <SupplierCard supplier={supplier} index={index} />
            </Link>
          ))}
        </div>
        <ScrollBar orientation='horizontal' className='h-2 [&>div]:bg-muted-foreground/30' />
      </ScrollArea>
    </CardContent>
  </Card>
);

export default CategoryList;
