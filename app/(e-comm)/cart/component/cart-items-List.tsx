import CartItem from './CartItem';
import { Product } from '@/types/product'; // Import Product type

// Define types for cart structure
interface CartItemData {
  product: Product;
  quantity: number;
}
type CartState = Record<string, CartItemData>;

const CartItemsList = ({ cart, isLoading }: { cart: CartState; isLoading: boolean }) => { // Use CartState type
  return (
    <div className='space-y-6'>
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className='flex h-32 animate-pulse space-x-4 rounded-lg bg-gray-200 p-4 dark:bg-gray-700'
          >
            <div className='h-24 w-24 rounded-lg bg-gray-300 dark:bg-gray-600'></div>
            <div className='flex-1 space-y-3'>
              <div className='h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600'></div>
              <div className='h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600'></div>
              <div className='h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-600'></div>
            </div>
          </div>
        ))
        : Object.values(cart).map(({ product, quantity }) => {
            // Map product to expected CartItemProps type
            const safeProduct = {
              id: product.id,
              name: product.name,
              price: product.price,
              type: product.type,
              imageUrl: product.imageUrl ?? null,
              details: product.details ?? null,
            };
            return (
              <CartItem
                key={product.id}
                product={safeProduct}
                quantity={quantity}
              />
            );
          })
        }
      </div>
  );
};
export default CartItemsList;
