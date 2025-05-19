import ProductsControlClient from './components/ProductsControlClient';

export default async function ProductsControlPage() {
  // Data fetching is now handled completely in ProductsControlClient
  return <ProductsControlClient />;
}
