import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

// تعريف هيكل عنصر السلة، والذي يتكون من المنتج وكميته.
interface CartItem {
  product: Product; // المنتج (يتضمن تفاصيل مثل المعرف، الاسم، السعر، إلخ)
  quantity: number; // كمية المنتج في السلة
}

// تعريف الحالة والإجراءات المتعلقة بسلة التسوق.
interface CartState {
  cart: Record<string, CartItem>; // سجل يحتوي على عناصر السلة (المفتاح هو معرف المنتج والقيمة هي العنصر)
  addItem: (product: Product, quantity: number) => void; // دالة لإضافة أو تحديث منتج في السلة
  updateQuantity: (productId: string, delta: number) => void; // دالة لتحديث كمية منتج معين
  removeItem: (productId: string) => void; // دالة لإزالة منتج من السلة
  clearCart: () => void; // دالة لتفريغ السلة بالكامل
  getTotalItems: () => number; // دالة لحساب العدد الإجمالي للعناصر في السلة
  getTotalUniqueItems: () => number; // دالة لحساب العدد الإجمالي للمنتجات الفريدة في السلة
  getTotalPrice: () => number; // دالة لحساب السعر الإجمالي لجميع العناصر في السلة
}

// إنشاء متجر Zustand مع وسيط الاستمرارية لحفظ حالة السلة.
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // تهيئة السلة ككائن فارغ.
      cart: {},

      // دالة لإضافة منتج إلى السلة أو تحديث كميته إذا كان موجودًا بالفعل.
      addItem: (product, quantity) =>
        set((state) => {
          const existingItem = state.cart[product.id]; // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
          return {
            cart: {
              ...state.cart,
              [product.id]: {
                product,
                quantity: existingItem
                  ? existingItem.quantity + quantity // زيادة الكمية إذا كان المنتج موجودًا
                  : quantity, // تعيين الكمية الأولية إذا كان المنتج جديدًا
              },
            },
          };
        }),

      // دالة لتحديث كمية منتج معين في السلة.
      updateQuantity: (productId, delta) =>
        set((state) => {
          const existingItem = state.cart[productId]; // الحصول على المنتج من السلة
          if (!existingItem) return state; // إذا لم يكن المنتج موجودًا، لا تفعل شيئًا
          const newQuantity = Math.max(0, existingItem.quantity + delta); // التأكد من أن الكمية لا تقل عن الصفر
          if (newQuantity === 0) {
            const newCart = { ...state.cart }; // إنشاء نسخة من السلة
            delete newCart[productId]; // إزالة المنتج إذا كانت الكمية صفر
            return { cart: newCart };
          }
          return {
            cart: {
              ...state.cart,
              [productId]: { ...existingItem, quantity: newQuantity }, // تحديث كمية المنتج
            },
          };
        }),

      // دالة لإزالة منتج من السلة باستخدام معرفه.
      removeItem: (productId) =>
        set((state) => {
          const newCart = { ...state.cart }; // إنشاء نسخة من السلة
          delete newCart[productId]; // إزالة المنتج
          return { cart: newCart };
        }),

      // دالة لتفريغ السلة بالكامل.
      clearCart: () => set(() => ({ cart: {} })), // إعادة تعيين السلة إلى كائن فارغ

      // دالة لحساب العدد الإجمالي للعناصر في السلة (مجموع الكميات).
      getTotalItems: () => Object.values(get().cart).reduce((acc, item) => acc + item.quantity, 0),

      // دالة لحساب العدد الإجمالي للمنتجات الفريدة في السلة.
      getTotalUniqueItems: () => Object.keys(get().cart).length,

      // دالة لحساب السعر الإجمالي لجميع العناصر في السلة (مجموع الكمية * السعر لكل منتج).
      getTotalPrice: () =>
        Object.values(get().cart).reduce(
          (acc, item) => acc + item.quantity * item.product.price, // ضرب الكمية بالسعر وجمعها
          0,
        ),
    }),
    { name: 'cart-storage' }, // حفظ حالة السلة في التخزين المحلي تحت المفتاح "cart-storage"
  ),
);
