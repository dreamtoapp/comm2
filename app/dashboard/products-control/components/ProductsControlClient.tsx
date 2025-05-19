'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link'; // Added
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { getCategories } from '@/app/dashboard/categories/actions'; // Added
import { Button } from '@/components/ui/button'; // Added
import { Product } from '@/types/product'; // Revert import
import { debounce } from '@/utils/debounce';

// import AddProductDialog from '../../products/components/AddProductDialog'; // No longer needed here
import { fetchFilteredProducts } from '../actions/fetchFilteredProducts';
import PaginationControls from './PaginationControls';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';

export default function ProductsControlClient() {


  // Filter state as an object
  type Filters = {
    name: string;
    supplierId: string | null;
    status: string;
    type: string;
    stock: string;
  };
  const initialFilters = useMemo((): Filters => ({ // Wrap in useMemo
    name: '',
    supplierId: null,
    status: 'all',
    type: 'all',
    stock: 'all',
  }), []); // Empty dependency array for stable reference
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null); // Revert type
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [categories, setCategories] = useState<Array<{ id: string, name: string }>>([]); // Added

  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync page state with URL on mount and when URL changes
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    if (!isNaN(urlPage) && urlPage !== page) {
      setPage(urlPage);
    }
  }, [searchParams, page]); // Added page dependency

  // Fetch products using server action on filter or page change
  const fetchAndSetProducts = useCallback(
    async (
      overrideFilters?: Partial<Filters>,
      overridePage?: number,
      overridePageSize?: number,
    ) => {
      setLoading(true);
      const mergedFilters = {
        ...filters,
        ...(overrideFilters || {}),
        page: overridePage ?? page,
        pageSize: overridePageSize ?? pageSize,
      };
      const { products, total } = await fetchFilteredProducts(mergedFilters);
      setFilteredProducts(products);
      setTotal(total);
      setLoading(false);
    },
    [filters, page, pageSize],
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    async (changed: Partial<Filters>) => {
      setFilters((prev) => ({ ...prev, ...changed }));
      setPage(1);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      router.replace(`?${params.toString()}`, { scroll: false });
      await fetchAndSetProducts(changed, 1);
    },
    [fetchAndSetProducts, router, searchParams],
  );

  // Debounced filter change for name/search
  const debouncedNameFilterChange = useMemo(
    () => debounce((value: string) => handleFilterChange({ name: value }), 300),
    [handleFilterChange],
  );

  // Reset filters to initial state
  const handleResetFilters = useCallback(async () => {
    setFilters(initialFilters);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    router.replace(`?${params.toString()}`, { scroll: false });
    await fetchAndSetProducts(initialFilters, 1);
  }, [fetchAndSetProducts, router, searchParams, initialFilters]); // Added initialFilters dependency

  // Handle page change
  const handlePageChange = useCallback(
    async (newPage: number) => {
      setPage(newPage);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
      await fetchAndSetProducts(undefined, newPage);
    },
    [fetchAndSetProducts, router, searchParams],
  );

  // Handle page size change (optional)

  // Fetch products on mount and when filters/page/pageSize change
  useEffect(() => {
    fetchAndSetProducts();
  }, [filters, page, pageSize, fetchAndSetProducts]);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories();
      if (result.success && result.categories) {
        setCategories(result.categories.map(c => ({ id: c.id, name: c.name })));
      } else {
        console.error("Failed to load categories for ProductsControlClient:", result.error);
        setCategories([]); // Ensure it's an empty array on error
      }
    }
    loadCategories();
  }, []);

  return (
    <div className='container mx-auto py-8' dir='rtl'>
      {/* Header and Add Product Button at the top */}
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='mb-1 text-2xl font-bold text-primary'>إدارة المنتجات</h1>
          <p className='text-sm text-muted-foreground'>
            عرض جميع المنتجات، التصفية، والبحث، مع إمكانية إضافة منتج جديد.
          </p>
        </div>
        <Button asChild className='bg-primary text-primary-foreground hover:bg-primary/90'>
          <Link href={filters.supplierId ? `/dashboard/products/new?supplierId=${filters.supplierId}` : "/dashboard/products/new"}>
            إضافة منتج جديد
          </Link>
        </Button>
      </div>
      {/* Filter Section - modern card UI */}
      <div className='mb-8 flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-end'> {/* Changed bg-white to bg-card */}
        <ProductFilters
          value={filters.name}
          onChange={debouncedNameFilterChange}
          status={filters.status}
          onStatusChange={(status: string) => handleFilterChange({ status })}
          type={filters.type}
          onTypeChange={(type: string) => handleFilterChange({ type })}
          stock={filters.stock}
          onStockChange={(stock: string) => handleFilterChange({ stock })}
          onReset={handleResetFilters}
        />
      </div>
      {/* Product Table and Pagination */}
      <ProductTable
        page={page}
        pageSize={pageSize}
        products={filteredProducts !== null ? filteredProducts : []}
        total={total}
        loading={loading}
        onDeleted={() => fetchAndSetProducts()}
      />
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
