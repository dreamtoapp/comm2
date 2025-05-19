'use client';
import {
  useCallback,
  useEffect,
  useState,
} from 'react'; // Import useCallback

import { useInView } from 'react-intersection-observer';

import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/product';

import { fetchProductsPage } from '../../actions/fetchProductsPage';
import ProductSkeleton from '../../component/ProductSkeleton';
import ProductCard from './ProductCard';

/**
 * Client component that handles infinite scrolling for products
 *
 * Receives initial products from server component and loads more
 * when the user scrolls to the bottom of the page
 */
export default function ProductListWithScroll({
  firstPageProducts,
  categorySlug,
}: {
  firstPageProducts: Product[];
  categorySlug: string;
}) {
  // State for products and pagination
  const [products, setProducts] = useState<Product[]>(firstPageProducts);
  const [page, setPage] = useState(2); // Start with page 2 (we already have page 1)
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to track errors

  // Cart store for adding products
  const { addItem, cart } = useCartStore();

  // Product quantities
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Notification state
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});

  // Initialize quantities for all products
  useEffect(() => {
    const newQuantities: Record<string, number> = {};
    products.forEach((product) => {
      if (!newQuantities[product.id]) {
        newQuantities[product.id] = 1;
      }
    });
    setQuantities((prev) => ({ ...prev, ...newQuantities }));
  }, [products]);

  // Set up intersection observer with optimized settings
  const { ref, inView } = useInView({
    threshold: 0.1, // Increase threshold to avoid premature triggering
    rootMargin: '200px 0px', // Reduced margin to prevent too early loading
    triggerOnce: false, // Allow multiple triggers
    initialInView: false, // Start with inView false to avoid unnecessary initial renders
  });

  // Function to load more products using server action (defined before useEffect that uses it)
  const fetchMoreProducts = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      // Call server action to get next page
      const result = await fetchProductsPage(categorySlug, page);

      if (result.products && result.products.length > 0) {
        // Add new products, avoiding duplicates
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNewProducts = result.products.filter((p) => !existingIds.has(p.id));

          // Only update state if we have new products
          if (uniqueNewProducts.length === 0) {
            // If no new products were found, we might have reached the end
            setHasMore(false);
            return prev;
          }

          return [...prev, ...uniqueNewProducts];
        });

        // Move to next page
        setPage((prev) => prev + 1);
      } else {
        // No products returned, we've reached the end
        setHasMore(false);
      }

      // Update hasMore flag based on server response
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Failed to fetch products:', err); // Log the error
      setError('Failed to load products. Please try again later.'); // Set user-friendly error message
      setHasMore(false); // Stop infinite scroll on error
    } finally {
      // Always set loading to false to prevent UI from being stuck
      setLoading(false);
    }
  }, [loading, categorySlug, page]);

  // Load more products when the sentinel comes into view
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMoreProducts();
    }
  }, [inView, hasMore, loading, fetchMoreProducts]);

  // Handle quantity changes
  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[productId] || 1) + delta);
      return { ...prev, [productId]: newQuantity };
    });
  };

  // Handle add to cart
  const handleAddToCart = (productId: string, quantity: number, product: Product) => {
    addItem(product, quantity);

    // Show notification
    setNotifications((prev) => ({ ...prev, [productId]: true }));

    // Hide notification after 2 seconds
    setTimeout(() => {
      setNotifications((prev) => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  return (
    <div className='container mx-auto'>
      {/* Product grid - optimized with content-visibility */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product, index) => (
          <div
            key={`${product.id}_${index}`}
            className='product-card'
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '0 500px',
            }}
          >
            <ProductCard
              product={product}
              quantity={quantities[product.id] || 1}
              onQuantityChange={updateQuantity}
              onAddToCart={handleAddToCart}
              isInCart={!!cart[product.id]}
              showNotification={!!notifications[product.id]}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator and sentinel element - optimized for performance */}
      <div ref={ref} className='mt-6 flex w-full flex-col items-center py-4'>
        {/* Invisible sentinel element that triggers loading */}
        <div className='h-4 w-full' />

        {loading && (
          <div className='w-full'>
            <ProductSkeleton count={4} />
          </div>
        )}

        {/* Display error message if an error occurred */}
        {error && (
          <p className='my-4 rounded-full bg-red-50 px-6 py-3 text-center text-red-500 shadow-sm'>
            {error}
          </p>
        )}

        {!loading && hasMore && !error && (
          <p className='my-2 rounded-full bg-blue-50 px-6 py-3 text-center text-blue-500 shadow-sm transition-colors hover:bg-blue-100'>
            قم بالتمرير لتحميل المزيد من المنتجات...
          </p>
        )}

        {!hasMore && products.length > 0 && !error && (
          <p className='my-4 rounded-full bg-gray-50 px-6 py-3 text-center text-gray-500'>
            لا توجد منتجات أخرى
          </p>
        )}
      </div>
    </div>
  );
}
