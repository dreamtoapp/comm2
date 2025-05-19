'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { useCartContext } from '@/providers/cart-provider';
import { Product } from '@/types/product';
import { DiscountedProduct } from '../../promotions/actions/promotionService';

interface ProductCardAdapterProps {
    product: Product;
    className?: string;
    index: number;
}

export default function ProductCardAdapter({ product, className, index }: ProductCardAdapterProps) {
    const { addToCart, updateQuantity: updateCartQuantity, isInCart, cart } = useCartContext();
    const [quantity, setQuantity] = useState(1);

    // Update local quantity if product is in cart
    useEffect(() => {
        const cartItem = cart.find(item => item.product.id === product.id);
        if (cartItem) {
            setQuantity(cartItem.quantity);
        }
    }, [cart, product.id]);

    const handleQuantityChange = (productId: string, delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = (productId: string, qty: number, product: Product) => {
        if (isInCart(productId)) {
            updateCartQuantity(productId, qty);
        } else {
            addToCart(product, qty);
        }
    };

    // Check if product has discounted price (from a promotion)
    const isDiscountedProduct = 'discountedPrice' in product &&
        product.discountedPrice !== product.price;

    // Create a version of the product with the compareAtPrice set to original price if discounted
    const adaptedProduct = isDiscountedProduct
        ? {
            ...product,
            price: (product as DiscountedProduct).discountedPrice,
            compareAtPrice: (product as DiscountedProduct).originalPrice
        }
        : product;

    return (
        <ProductCard
            product={adaptedProduct}
            className={className}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            isInCart={isInCart(product.id)}
            showNotification={true}
            index={index}
        />
    );
} 