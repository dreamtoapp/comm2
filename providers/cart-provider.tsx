'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCart, CartItem } from '@/hooks/useCart';
import { Product } from '@/types/product';
import { DiscountedProduct } from '@/app/(e-comm)/promotions/actions/promotionService';

// Define the context type
interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    isInCart: (productId: string) => boolean;
    clearCart: () => void;
    getTotalPrice: () => number;
    getItemCount: () => number;
    getDiscountedPrice: (product: Product) => number;
}

// Create context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
    const cartUtils = useCart();

    // Add a function to get discounted price
    const getDiscountedPrice = (product: Product) => {
        // Check if product has discounted price property (from a promotion)
        if ('discountedPrice' in product) {
            return (product as DiscountedProduct).discountedPrice;
        }
        // Otherwise return regular price
        return product.price;
    };

    return (
        <CartContext.Provider value={{ ...cartUtils, getDiscountedPrice }}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use the cart context
export function useCartContext() {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }

    return context;
} 