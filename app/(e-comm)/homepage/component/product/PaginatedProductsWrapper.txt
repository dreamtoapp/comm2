import { fetchPaginatedProducts } from '../../actions/fetchPaginatedProducts';
import InfiniteProductList from './InfiniteProductList';

interface PaginatedProductsWrapperProps {
  slug?: string;
}

export default async function PaginatedProductsWrapper({
  slug = '',
}: PaginatedProductsWrapperProps) {
  // Fetch initial page of products on the server
  const initialProducts = await fetchPaginatedProducts(1, 20, slug);

  // Pass the initial products to the client component
  return <InfiniteProductList initialProducts={initialProducts} initialSlug={slug} />;
}
