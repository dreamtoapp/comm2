'use client';

import { useState, useEffect } from 'react';
import EnhancedProductCard from '@/components/product/EnhancedProductCard';
import { useCartContext } from '@/providers/cart-provider';

import { Product } from '@/types/product';
import { DiscountedProduct } from '../../promotions/actions/promotionService';

interface EnhancedProductCardAdapterProps {
    product: Product | DiscountedProduct;
    className?: string;
    variant?: 'default' | 'category' | 'offer';
    showQuantityControls?: boolean;
    size?: 'sm' | 'md' | 'lg';
    orientation?: 'vertical' | 'horizontal';
}

export default function EnhancedProductCardAdapter({
    product,
    className,
    variant = 'category',
    showQuantityControls = false,
    size = 'md',
    orientation = 'vertical'
}: EnhancedProductCardAdapterProps) {
    // Use the Zustand cart store instead of the context
    const { cart, addItem, updateQuantity } = useCartContext();
    const [quantity, setQuantity] = useState(1);

    // Check if product is in cart
    const isInCart = (productId: string) => {
        return !!cart[productId];
    };

    // Update local quantity if product is in cart
    useEffect(() => {
        const cartItem = cart[product.id];
        if (cartItem) {
            setQuantity(cartItem.quantity);
        }
    }, [cart, product.id]);

    // Custom add to cart handler that uses the Zustand store
    const handleAddToCart = (product: Product, quantity: number) => {
        if (isInCart(product.id)) {
            // Calculate delta for update - current quantity to desired quantity
            const delta = quantity - (cart[product.id]?.quantity || 0);
            updateQuantity(product.id, delta);
        } else {
            // Add new item
            addItem(product, quantity);
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

    // Custom label for offer variant
    const customLabels = variant === 'offer'
        ? {
            addToCartLabel: 'استفد من العرض',
            inCartLabel: 'تم الاستفادة من العرض'
        }
        : undefined;

    return (
        <EnhancedProductCard
            product={adaptedProduct}
            className={className}
            variant={variant}
            showQuantityControls={showQuantityControls}
            initialQuantity={quantity}
            onAddToCart={handleAddToCart}
            isItemInCart={isInCart(product.id)}
            size={size}
            orientation={orientation}
            customAddToCartLabel={customLabels?.addToCartLabel}
            customInCartLabel={customLabels?.inCartLabel}
        />
    );
} 