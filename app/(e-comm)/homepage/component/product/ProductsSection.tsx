import { fetchProductsPage } from '../../actions/fetchProductsPage';
import ProductListWithScroll from './ProductListWithScroll';

/**
 * Server Component that fetches the first page of products
 * and passes them to a client component for infinite scrolling.
 *
 * Note: We don't need Suspense here because Next.js App Router
 * automatically handles loading states with loading.tsx
 */
export default async function ProductsSection({ slug }: { slug: string }) {
  // Get first page of products (page 1)
  const { products: firstPageProducts } = await fetchProductsPage(slug, 1);

  return (
    <section className='py-8'>
      <h2 className='mb-6 text-center text-2xl font-bold'>منتجاتنا</h2>
      <ProductListWithScroll firstPageProducts={firstPageProducts} categorySlug={slug || ''} />
    </section>
  );
}
