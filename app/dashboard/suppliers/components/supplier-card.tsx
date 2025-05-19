import React from 'react';

import { Package, TriangleAlert } from 'lucide-react';

import CardImage from '@/components/CardImage';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { DeleteSupplierAlert, EditSupplierDialog } from './dynmic-edit-delete';

// import DeleteSupplierAlert from './DeleteSupplierAlert';
// import EditSupplierDialog from './EditSupplierDialog';

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    logo: string | null;
    productCount: number;
  };
}

const ProductCountBadge = ({
  hasProducts,
  productCount,
}: {
  hasProducts: boolean;
  productCount: number;
}) => (
  <Badge variant={hasProducts ? 'default' : 'destructive'} className='absolute right-0 top-0 w-fit'>
    {hasProducts ? (
      <div className='flex items-center gap-2'>
        <Package size={14} />
        <span>{productCount} منتج</span>
      </div>
    ) : (
      <div className='flex items-center gap-2'>
        <TriangleAlert size={14} />
        <span>لا توجد منتجات</span>
      </div>
    )}
  </Badge>
);

const SupplierCardHeader = ({ name }: { name: string }) => (
  <CardHeader className='space-y-4 p-4'>
    <div className='flex flex-col items-end gap-2'>
      <CardTitle className='text-lg font-bold'>{name}</CardTitle>
    </div>
  </CardHeader>
);

const SupplierLogo = ({
  logo,
  name,
  hasProducts,
  productCount,
}: {
  logo: string | null;
  name: string;
  hasProducts: boolean;
  productCount: number;
}) => (
  <div className='relative flex w-full items-center gap-2'>
    <CardImage
      imageUrl={logo || undefined}
      altText={`شعار ${name}`}
      aspectRatio='square'
      fallbackSrc='/default-logo.png'
      className='h-24 w-24 rounded-lg border'
    />
    <ProductCountBadge hasProducts={hasProducts} productCount={productCount} />
  </div>
);

const ProductManagementLink = ({
  hasProducts,
  supplierId,
}: {
  hasProducts: boolean;
  supplierId: string;
}) => (
  <Link
    href={`/dashboard/products?supplierId=${supplierId}`}
    className={buttonVariants({
      variant: hasProducts ? 'secondary' : 'outline',
      size: 'sm',
      className: `flex w-full items-center gap-2 text-center text-sm ${hasProducts ? '' : 'border-destructive/40'}`,
    })}
  >
    {hasProducts ? 'إدارة المنتجات' : 'إضافة منتج'}
  </Link>
);

const ActionButtons = ({ supplier }: SupplierCardProps) => (
  <div className='flex w-full justify-end gap-2'>
    <EditSupplierDialog supplier={supplier} />
    <DeleteSupplierAlert supplierId={supplier.id} />
  </div>
);

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier }) => {
  const hasProducts = supplier.productCount > 0;

  return (
    <Card className='flex h-full flex-col justify-between overflow-hidden transition-shadow hover:shadow-sm'>
      <SupplierCardHeader name={supplier.name} />

      <CardContent className='relative flex flex-col items-center gap-4 p-4'>
        <SupplierLogo
          logo={supplier.logo}
          name={supplier.name}
          hasProducts={hasProducts}
          productCount={supplier.productCount}
        />
        <Separator />
        <ProductManagementLink hasProducts={hasProducts} supplierId={supplier.id} />
      </CardContent>

      <CardFooter className='bg-muted/50 p-4'>
        <ActionButtons supplier={supplier} />
      </CardFooter>
    </Card>
  );
};

SupplierCard.displayName = 'SupplierCard';
export default SupplierCard;
