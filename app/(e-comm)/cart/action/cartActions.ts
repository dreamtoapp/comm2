import { useCartStore } from '@/store/cartStore';

export const useCartActions = () => {
  const { removeItem, updateQuantity } = useCartStore();

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    updateQuantity(productId, delta);
  };

  return { handleRemoveItem, handleUpdateQuantity };
};
