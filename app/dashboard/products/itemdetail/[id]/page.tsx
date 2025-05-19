import { getProductById } from './actions';
import ProductDetails from './component/ProductDetails';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const producid = (await params).id;
  const product = await getProductById(producid);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className='p-4'>
      <ProductDetails product={product} />
    </div>
  );
}
