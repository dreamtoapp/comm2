'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import { DiscountedProduct } from '@/app/(e-comm)/promotions/actions/promotionService';

// Define CartItem type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Function to get the effective price of a product (original or discounted)
const getEffectivePrice = (product: Product): number => {
  // Check if product has discounted price property (from a promotion)
  if ('discountedPrice' in product) {
    return (product as DiscountedProduct).discountedPrice;
  }
  // Otherwise return regular price
  return product.price;
};

// Create a hook for cart management
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);
  
  // Add item to cart
  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item if product doesn't exist in cart
        return [...prevCart, { product, quantity }];
      }
    });
  }, []);
  
  // Remove item from cart
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);
  
  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.product.id === productId);
      if (itemIndex < 0) return prevCart;
      
      const updatedCart = [...prevCart];
      updatedCart[itemIndex].quantity = quantity;
      
      // Remove item if quantity is 0 or less
      if (quantity <= 0) {
        updatedCart.splice(itemIndex, 1);
      }
      
      return updatedCart;
    });
  }, []);
  
  // Check if product is in cart
  const isInCart = useCallback((productId: string) => {
    return cart.some(item => item.product.id === productId);
  }, [cart]);
  
  // Clear the entire cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  // Calculate total price of items in cart
  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => {
      // Use effective price (original or discounted)
      const price = getEffectivePrice(item.product);
      return total + (price * item.quantity);
    }, 0);
  }, [cart]);
  
  // Calculate total number of items in cart
  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);
  
  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    clearCart,
    getTotalPrice,
    getItemCount
  };
} 