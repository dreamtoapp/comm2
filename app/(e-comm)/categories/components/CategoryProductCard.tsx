'use client';




import { Product } from '@/types/product';

interface CategoryProductCardProps {
    product: Product;
    quantity: number;
    onAddToCart: (product: Product, quantity: number) => void;
    isInCart: boolean;
    onQuantityChange: (delta: number) => void;


const CategoryProductCard = ({
    product,
    quantity,
    onAddToCart,
    isInCart,
    onQuantityChange,
}: CategoryProductCardProps) => {
    // Adapter function to convert our onAddToCart to EnhancedProductCard's format
    const handleAddToCart = (p: Product, qty: number) => {
        onAddToCart(p.id, qty, p);
    };

    // Adapter function for quantity change
    const handleQuantityChange = (delta: number) => {
        onQuantityChange(product.id, delta);
    };

    return (
        <EnhancedProductCard
            product={product}
            variant="category"
            initialQuantity={quantity}
            onAddToCart={handleAddToCart}
            isItemInCart={isInCart}
            onQuantityChange={handleQuantityChange}
            className="h-full"
            showQuantityControls={true}
        />
    );
};

// Ensure a display name for React dev tools
CategoryProductCard.displayName = 'CategoryProductCard';

export default CategoryProductCard; 