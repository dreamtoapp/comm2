'use client';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { Product } from '@/types/product';
import uniqeId from '@/utils/uniqeId';

import { fetchPaginatedProducts } from '../../actions/fetchPaginatedProducts';
import ProductSkeleton from '../ProductSkeleton';

// Dynamically import InfiniteScroll with SSR enabled for better initial render
const InfiniteScroll = dynamic(() => import('react-infinite-scroll-component'), {
  ssr: true,
  loading: () => <div className='animate-pulse'>Loading...</div>,
});

// Dynamically import ProductList with SSR enabled
const ProductList = dynamic(() => import('./ProductList'), {
  loading: () => <ProductSkeleton count={4} />,
  ssr: true,
});

interface InfiniteProductListProps {
  initialProducts: Product[];
  initialSlug?: string;
}

export default function InfiniteProductList({
  initialProducts,
  initialSlug = '',
}: InfiniteProductListProps) {
  // Add unique keys to initial products
  const initialProductsWithKeys = initialProducts.map((product) => ({
    ...product,
    _uniqueKey: `${product.id}_${uniqeId()}`,
  }));

  const [products, setProducts] =
    useState<(Product & { _uniqueKey: string })[]>(initialProductsWithKeys);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2); // Start from page 2 since we already have page 1
  const [slug, setSlug] = useState(initialSlug);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when slug changes
  useEffect(() => {
    // Add unique keys to new initial products
    const newInitialProductsWithKeys = initialProducts.map((product) => ({
      ...product,
      _uniqueKey: `${product.id}_${uniqeId()}`,
    }));

    setProducts(newInitialProductsWithKeys);
    setPage(2);
    setHasMore(true);
    setSlug(initialSlug);
    setError(null);
  }, [initialSlug, initialProducts]);

  const loadMoreProducts = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use server action to fetch more products
      const newProducts = await fetchPaginatedProducts(page, 20, slug);

      if (!newProducts || newProducts.length === 0) {
        setHasMore(false);
      } else {
        // Add a unique key to each product
        const productsWithUniqueIds = newProducts.map((product) => ({
          ...product,
          _uniqueKey: `${product.id}_${uniqeId()}`,
        }));

        // Deduplicate products by ID to prevent duplicates
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNewProducts = productsWithUniqueIds.filter((p) => !existingIds.has(p.id));
          return [...prev, ...uniqueNewProducts];
        });

        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more products:', error);
      setError('حدث خطأ أثناء تحميل المزيد من المنتجات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative'>
      <InfiniteScroll
        dataLength={products.length}
        next={loadMoreProducts}
        hasMore={hasMore}
        loader={<ProductSkeleton count={4} />}
        endMessage={
          <p className='p-4 text-center text-muted-foreground'>لقد شاهدت جميع المنتجات المتاحة</p>
        }
        scrollThreshold={0.8} // Load more when user scrolls 80% of the way down
        className='min-h-[200px]' // Ensure minimum height for proper scrolling
        style={{ overflow: 'hidden' }} // Prevent double scrollbars
      >
        <ProductList products={products} />

        {/* Error message with retry button */}
        {error && (
          <div className='mt-4 rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20'>
            <p className='mb-2 text-red-600 dark:text-red-400'>{error}</p>
            <button
              onClick={loadMoreProducts}
              className='rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90'
              disabled={isLoading}
            >
              {isLoading ? 'جاري المحاولة...' : 'إعادة المحاولة'}
            </button>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
