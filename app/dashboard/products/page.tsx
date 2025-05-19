import Image from 'next/image';
import Link from 'next/link'; // Added

import {
  getCategories,
} from '@/app/dashboard/categories/actions'; // Import getCategories for ProductsPage
// import AddProductDialog from './components/AddProductDialog'; // No longer needed
import { Button } from '@/components/ui/button'; // Added
import { Product } from '@/types/product';
import { Supplier } from '@prisma/client'; // Category import no longer needed directly here

import { getProductsBySupplier } from './actions';
import ProductCard from './components/ProductCard';

// Removed ProductsPageProps interface for Next.js 15 compatibility

// SimpleCategory type definition might still be used by ProductsPage if it processes categories before deciding not to pass them.
// For now, let's assume ProductsPage still prepares it, even if not passed down.
interface SimpleCategory {
  id: string;
  name: string;
}

function SupplierCard({ supplier }: { supplier: Supplier & { products: Product[] } }) { // categories prop removed
  return (
    <div className='flex flex-col items-center gap-6 rounded-xl border border-border bg-gradient-to-br from-card to-muted p-6 shadow-lg md:flex-row'>
      {/* Logo */}
      <div className='relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary shadow'>
        {supplier.logo ? (
          <Image
            src={supplier.logo}
            alt={`${supplier.name} logo`}
            fill
            className='object-cover object-center'
            priority
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-muted'>
            <span className='text-muted-foreground'>No Logo</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className='min-w-0 flex-1'>
        <h2 className='truncate text-xl font-semibold'>{supplier.name}</h2>
        <div className='mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground'>
          <span title={supplier.email}>
            <i className='fa fa-envelope mr-1' />
            {supplier.email}
          </span>
          <span title={supplier.phone}>
            <i className='fa fa-phone mr-1' />
            {supplier.phone}
          </span>
          <span title={supplier.address}>
            <i className='fa fa-map-marker-alt mr-1' />
            {supplier.address}
          </span>
        </div>
      </div>
      {/* Add Product + Count */}
      <div className='flex flex-col items-end gap-2'>
        <Button asChild className='bg-primary text-primary-foreground hover:bg-primary/90'>
          <Link href={`/dashboard/products/new?supplierId=${supplier.id}`}>
            إضافة منتج جديد
          </Link>
        </Button>
        <span className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary'>
          {supplier.products.length} منتج
        </span>
      </div>
    </div>
  );
}

function ProductsTableHeader() {
  return (
    <div className='hidden w-full grid-cols-[7rem_1fr_1fr_1fr_2fr_7rem] rounded-t-xl border-b border-border bg-muted px-2 py-2 text-sm font-bold text-muted-foreground sm:grid'>
      <span className='text-center'>الصورة</span>
      <span className='text-center'>الاسم</span>
      <span className='text-center'>الحجم</span>
      <span className='text-center'>السعر</span>
      <span className='text-center'>التفاصيل</span>
      <span className='text-center'>إجراء</span>
    </div>
  );
}

function ProductsGrid({ products, supplierId }: { products: Product[]; supplierId: string }) { // categories prop removed
  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <Image
          src='/empty-box.svg'
          alt='No products'
          width={128}
          height={128}
          className='mb-4 h-32 w-32 opacity-80'
        />
        <p className='mb-2 text-lg text-muted-foreground'>لا توجد منتجات حتى الآن</p>
        <Button asChild className='bg-primary text-primary-foreground hover:bg-primary/90 mt-4'>
          <Link href={`/dashboard/products/new?supplierId=${supplierId}`}>
            إضافة المنتج الأول
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <div className='w-full'>
      <ProductsTableHeader />
      <div className='flex w-full flex-col'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default async function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const resolvedSearchParams = await searchParams;
  const supplierIdParam = resolvedSearchParams?.supplierId;
  const supplierId = Array.isArray(supplierIdParam) ? supplierIdParam[0] : supplierIdParam;

  // Fetch categories - still fetched by the page, but not passed down to SupplierCard/ProductsGrid
  // as the new page /dashboard/products/new fetches its own categories.
  // This could be removed if no other part of ProductsPage needs allCategories.
  // For now, keeping it to minimize changes if it's used elsewhere unseen or for future use.
  const categoriesResult = await getCategories();
  const allCategories = categoriesResult.success ? categoriesResult.categories?.map(c => ({ id: c.id, name: c.name })) || [] : [];


  // Handle case where supplierId is missing or invalid
  if (!supplierId || typeof supplierId !== 'string') {
    // Return an error message or redirect, depending on desired behavior
    return (
      <div className='space-y-6 bg-background p-6 text-foreground'>
        <h1 className='text-3xl font-bold'>خطأ</h1>
        <div className='rounded-lg bg-card p-6 text-center shadow-md'>
          <p className='text-destructive'>معرف المورد غير صحيح أو مفقود.</p>
        </div>
      </div>
    );
  }

  // Fetch supplier and products based on supplierId (now guaranteed to be a string)
  const supplierResponse = await getProductsBySupplier(supplierId);
  if (!supplierResponse) {
    return (
      <div className='space-y-6 bg-background p-6 text-foreground'>
        <h1 className='text-3xl font-bold'>ادارة المنتجات</h1>

        <div className='rounded-lg bg-card p-6 text-center shadow-md'>
          <p className='text-destructive'>لا توجد بيانات</p>
        </div>
      </div>
    );
  }

  // Handle cases where the supplier is not found or an error occurs
  if (!supplierResponse.success) {
    return (
      <div className='space-y-6 bg-background p-6 text-foreground'>
        <h1 className='text-3xl font-bold'>ادارة المنتجات</h1>
        <div className='rounded-lg bg-card p-6 text-center shadow-md'>
          <p className='text-destructive'>{supplierResponse.message}</p>
        </div>
      </div>
    );
  }

  // Ensure supplier data is defined
  const supplier = supplierResponse.data;
  if (!supplier) {
    return (
      <div className='space-y-6 bg-background p-6 text-foreground'>
        <h1 className='text-3xl font-bold'>ادارة المنتجات</h1>
        <div className='rounded-lg bg-card p-6 text-center shadow-md'>
          <p className='text-destructive'>Supplier data is missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 bg-background p-6 text-foreground'>
      {/* Page Title */}
      <h1 className='mb-2 text-3xl font-bold'>ادارة المنتجات</h1>
      <SupplierCard supplier={supplier} /> {/* categories prop removed */}
      <ProductsGrid products={supplier.products} supplierId={supplier.id} /> {/* categories prop removed */}
    </div>
  );
}
