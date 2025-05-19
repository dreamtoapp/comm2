'use client';
import React, { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { FaBuilding, FaStar } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Supplier {
  id: string;
  name: string;
  type?: string;
  logo?: string | null;
  _count?: {
    products: number;
  };
}

interface ProductCategoryProps {
  suppliers: Supplier[];
}

const ProductCategory = ({ suppliers }: ProductCategoryProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [loadingSupplierId, setLoadingSupplierId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'offer' | 'company'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  // حساب عدد الموردين لكل نوع
  const offerCount = suppliers.filter((s) => s.type === 'offer').length;
  const companyCount = suppliers.filter((s) => s.type === 'company').length;

  useEffect(() => {
    const supplierName = searchParams.get('name');
    const supplierId = searchParams.get('sid');

    if (supplierName && supplierId) {
      const decodedSupplierName = decodeURIComponent(supplierName.replace(/-/g, ' '));
      const supplier = suppliers.find((s) => s.id === supplierId && s.name === decodedSupplierName);
      if (supplier) {
        setSelectedSupplier(supplier);
        setIsFilterApplied(true);
      }
    } else {
      setSelectedSupplier(null);
      setIsFilterApplied(false);
    }
  }, [searchParams, suppliers]);

  const handleSelectSupplier = async (supplier: Supplier) => {
    setLoadingSupplierId(supplier.id);
    const cleanSupplierName = supplier.name.replace(/\s+/g, '-');
    const encodedSupplierName = encodeURIComponent(cleanSupplierName);
    const newUrl = `?name=${encodedSupplierName}&sid=${supplier.id}` as const;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(newUrl);
    setSelectedSupplier(supplier);
    setIsFilterApplied(true);
    setLoadingSupplierId(null);
  };

  const handleRemoveFilter = async () => {
    setLoadingSupplierId('remove');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSelectedSupplier(null);
    setIsFilterApplied(false);
    router.push('/');
    setLoadingSupplierId(null);
  };

  const filteredSuppliers = suppliers
    .filter((supplier) => {
      if (filterType === 'all') return true;
      return supplier.type === filterType;
    })
    .sort((a, b) => {
      if (filterType === 'all') {
        if (a.type === 'offer' && b.type !== 'offer') return -1;
        if (a.type !== 'offer' && b.type === 'offer') return 1;
      }
      return 0;
    });

  return (
    <Card className='rtl mx-auto w-full max-w-screen-lg text-right shadow-lg dark:border-gray-800 dark:bg-gray-900'>
      {/* <CardHeader className="border-b p-2 dark:border-gray-800">
        <CardTitle className="text-lg font-bold text-foreground dark:text-gray-100">
          الفئات
        </CardTitle>
      </CardHeader> */}

      <CardContent className='p-4'>
        {/* صف الفلاتر وزر المسح */}
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
          <div className='flex min-w-[300px] flex-1 gap-2'>
            {/* <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className="flex-1 text-sm px-3"
            >
              الكل ({allCount})
            </Button> */}

            <Button
              variant={filterType === 'company' ? 'default' : 'outline'}
              onClick={() => setFilterType('company')}
              className='flex-1 px-3 text-sm'
            >
              الموردين ({companyCount})
            </Button>
            <Button
              variant={filterType === 'offer' ? 'default' : 'outline'}
              onClick={() => setFilterType('offer')}
              className='flex-1 px-3 text-sm'
            >
              العروض ({offerCount})
            </Button>
          </div>

          {isFilterApplied && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleRemoveFilter}
                  disabled={loadingSupplierId === 'remove'}
                  className='h-8 gap-1 px-2 text-sm'
                >
                  {loadingSupplierId === 'remove' ? (
                    <ImSpinner8 className='h-3 w-3 animate-spin' />
                  ) : (
                    <>
                      <FiX className='h-3 w-3' />
                      مسح الفلتر
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom' className='dark:bg-gray-800 dark:text-gray-100'>
                <p>إزالة التصفية الحالية</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className='py-4 text-center text-muted-foreground dark:text-gray-400'>
            غير متوفر حاليا
          </div>
        ) : (
          <div className='relative'>
            <ScrollArea ref={scrollRef} className='w-full rounded-lg shadow-sm'>
              <div className='flex space-x-4 p-4'>
                {filteredSuppliers.map((supplier) => (
                  <Tooltip key={supplier.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`relative flex h-36 w-36 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all hover:bg-accent/50 ${selectedSupplier?.id === supplier.id
                          ? 'border-2 border-primary shadow-lg dark:border-blue-600'
                          : 'border-muted hover:border-primary dark:border-gray-700 dark:hover:border-blue-600'
                          } ${supplier.type === 'offer' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-background dark:bg-gray-800'}`}
                        onClick={() => !loadingSupplierId && handleSelectSupplier(supplier)}
                        role='button'
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleSelectSupplier(supplier)}
                      >
                        {loadingSupplierId === supplier.id && (
                          <>
                            <div className='absolute inset-0 z-10 rounded-lg bg-black/30'></div>
                            <div className='absolute inset-0 z-20 flex items-center justify-center'>
                              <ImSpinner8 className='h-8 w-8 animate-spin text-primary dark:text-blue-600' />
                            </div>
                          </>
                        )}

                        <div className='absolute left-2 top-2'>
                          {supplier.type === 'offer' && <FaStar className='text-yellow-500' />}
                          {supplier.type === 'company' && <FaBuilding className='text-blue-500' />}
                        </div>

                        <Avatar className='z-0 mb-2 h-20 w-20'>
                          <AvatarImage src={supplier.logo || ''} alt={supplier.name} />
                          <AvatarFallback className='bg-primary/10 font-semibold text-primary dark:bg-blue-900/20 dark:text-blue-400'>
                            {supplier.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className='w-full truncate text-center text-sm font-medium text-foreground dark:text-gray-100'>
                          {supplier.name}
                        </div>

                        {
                          supplier._count?.products !== undefined &&
                          (supplier._count.products === 0 ? (
                            <Badge
                              variant='destructive'
                              className='absolute -right-2 -top-2 shadow-sm'
                            >
                              لا توجد منتجات
                            </Badge>
                          ) : (
                            <Badge
                              variant={'default'}
                              className='absolute -right-2 -top-2 shadow-sm'
                            >
                              <div>{supplier._count.products} منتجات</div>
                            </Badge>
                          ))

                          // <Badge
                          //   variant={
                          //     selectedSupplier?.id === supplier.id
                          //       ? "default"
                          //       : "secondary"
                          //   }
                          //   className="absolute -top-2 -right-2 shadow-sm dark:bg-gray-800 dark:text-gray-100"
                          // >

                          //   {supplier._count.products === 0 ? <p className="text-xs bg-red-200 ">لا يوجد منتجات</p> : <div>{supplier._count.products} منتجات</div>}

                          // </Badge>
                        }
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='bottom' className='dark:bg-gray-800 dark:text-gray-100'>
                      <p>{supplier.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <ScrollBar orientation='horizontal' className='dark:bg-gray-700' />
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCategory;
