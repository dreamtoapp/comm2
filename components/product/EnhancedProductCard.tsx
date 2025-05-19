'use client';

import { useState, useEffect } from 'react';
import { Check, Bell, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RatingPreview from '@/components/rating/RatingPreview';
import WishlistButton from '@/components/wishlist/WishlistButton';
import { Alert } from '@/lib/alert-utils';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { useCartContext } from '@/providers/cart-provider';

interface EnhancedProductCardProps {
    product: Product;
    variant?: 'default' | 'category' | 'offer'; // Different display variants
    size?: 'sm' | 'md' | 'lg'; // Size variants
    orientation?: 'vertical' | 'horizontal'; // Layout orientation
    className?: string;
    showQuantityControls?: boolean; // Whether to show quantity controls
    initialQuantity?: number; // Initial quantity if controls are shown
    onAddToCart?: (product: Product, quantity: number) => void; // Custom add to cart handler
    isItemInCart?: boolean; // Whether the item is already in cart
    customAddToCartLabel?: string; // Custom label for add to cart button
    customInCartLabel?: string; // Custom label for in cart button
    onQuantityChange?: (productId: string, delta: number) => void; // Optional handler for external quantity change
}

export default function EnhancedProductCard({
    product,
    variant = 'default',
    size = 'md',
    orientation = 'vertical',
    className,
    showQuantityControls = true,
    initialQuantity = 1,
    onAddToCart,
    isItemInCart = false, // Default to false 
    customAddToCartLabel,
    customInCartLabel,
    onQuantityChange,
}: EnhancedProductCardProps) {
    const [imgSrc, setImgSrc] = useState(product.imageUrl || '/fallback/product-fallback.avif');
    const [quantity, setQuantity] = useState(initialQuantity);
    const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
    const { addToCart: contextAddToCart } = useCartContext();
    // Use the passed isItemInCart prop instead of checking the context
    const [itemAddedToCart, setItemAddedToCart] = useState(isItemInCart);

    // Update itemAddedToCart state when the prop changes
    useEffect(() => {
        setItemAddedToCart(isItemInCart);
    }, [isItemInCart]);

    // Variant-specific styles
    const variantStyles = {
        default: '',
        category: 'border border-muted rounded-xl p-4',
        offer: 'bg-secondary/20 rounded-xl p-4',
    };

    // Size-specific styles
    const sizeStyles = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    // Size-specific image heights
    const imageHeights = {
        sm: 'h-32',
        md: 'h-48',
        lg: 'h-64',
    };

    // Orientation-specific layout
    const orientationStyles = {
        vertical: 'flex-col',
        horizontal: 'flex-row gap-4 items-start',
    };

    // Format price
    const formattedPrice = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
    }).format(product.price);

    // Format compareAtPrice (original price) if it exists
    const formattedCompareAtPrice = product.compareAtPrice
        ? new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
        }).format(product.compareAtPrice)
        : null;

    // Calculate discount percentage if compareAtPrice exists and is greater than price
    const discountPercentage =
        product.compareAtPrice && product.compareAtPrice > product.price
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : null;

    // Calculate total if quantity > 1
    const totalPrice = quantity > 1 ? product.price * quantity : null;
    const formattedTotalPrice = totalPrice
        ? new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
        }).format(totalPrice)
        : null;

    // Handle add to cart click
    const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent navigating to product page
        if (quantity <= 0) {
            Alert.toast.error('الكمية يجب أن تكون أكبر من صفر');
            return;
        }

        // Use custom handler if provided, otherwise use context
        if (onAddToCart) {
            onAddToCart(product, quantity);
        } else {
            contextAddToCart(product, quantity);
        }

        // Show success indicator
        setShowSuccessIndicator(true);
        setItemAddedToCart(true);

        // Hide success indicator after 3 seconds
        setTimeout(() => {
            setShowSuccessIndicator(false);
        }, 3000);

        // Force a cart context update by triggering a small delay
        setTimeout(() => {
            // This helps ensure UI elements like the cart counter are updated
        }, 50);

        Alert.toast.success(`تمت إضافة ${product.name} (${quantity}) إلى السلة`);
    };

    // Handle quantity change
    const handleQuantityChange = (delta: number) => {
        const newQuantity = Math.max(1, quantity + delta);
        setQuantity(newQuantity);
        if (typeof onQuantityChange === 'function') {
            onQuantityChange(product.id, delta);
        }
    };

    // Handle direct quantity input
    const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            const delta = value - quantity;
            setQuantity(value);
            if (typeof onQuantityChange === 'function') {
                onQuantityChange(product.id, delta);
            }
        }
    };

    // Handle notify when in stock click
    const handleNotifyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        Alert.toast.success(`سيتم إشعارك عند توفر ${product.name}`);
    };

    // Handle contact for bulk orders click
    const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        Alert.toast.success(`تم إرسال طلب للتواصل بخصوص ${product.name}`);
    };

    return (
        <div
            className={cn(
                'group relative flex transition-all duration-300',
                orientationStyles[orientation],
                variantStyles[variant],
                sizeStyles[size],
                showSuccessIndicator && 'ring-2 ring-green-500',
                itemAddedToCart && !showSuccessIndicator && 'ring-1 ring-green-300',
                className
            )}
        >
            {/* Success indicator */}
            {showSuccessIndicator && (
                <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-1 rounded-t-lg bg-green-500 py-1 text-white">
                    <Check size={16} className="stroke-[3]" />
                    <span>تمت الإضافة إلى السلة</span>
                </div>
            )}

            {/* Wishlist button */}
            <div className='absolute left-3 top-3 z-10'>
                <WishlistButton
                    productId={product.id}
                    size={size === 'lg' ? 'md' : 'sm'}
                    showBackground={true}
                />
            </div>

            {/* Product link with image */}
            <Link
                href={`/product/${product.slug || product.id}`}
                className={cn(
                    'block',
                    orientation === 'horizontal' ? 'w-1/3' : 'w-full'
                )}
            >
                <div className={cn(
                    'relative overflow-hidden rounded-lg bg-muted',
                    orientation === 'vertical' ? 'aspect-square' : imageHeights[size]
                )}>
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImgSrc('/fallback/product-fallback.avif')}
                        sizes={orientation === 'vertical'
                            ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            : "(max-width: 640px) 33vw, 25vw"
                        }
                    />

                    {/* Sale badge */}
                    {discountPercentage !== null && (
                        <Badge className='absolute right-3 top-3 z-10 bg-red-500 text-white'>
                            خصم {discountPercentage}%
                        </Badge>
                    )}

                    {/* Out of stock overlay */}
                    {product.outOfStock && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                            <Badge variant='outline' className='bg-red-500 px-3 py-1 font-bold text-white'>
                                غير متوفر
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>

            {/* Product info and actions */}
            <div className={cn(
                'flex flex-col',
                orientation === 'horizontal' ? 'flex-1 p-3' : 'mt-3 w-full space-y-1'
            )}>
                {/* Product name */}
                <Link href={`/product/${product.slug || product.id}`}>
                    <h3 className={cn(
                        'line-clamp-2 font-medium transition-colors hover:text-primary',
                        size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
                    )}>
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating && product.rating > 0 && (
                    <RatingPreview
                        productId={product.id}
                        productSlug={product.slug}
                        rating={product.rating}
                        reviewCount={product.reviewCount || 0}
                        size={size === 'lg' ? 'md' : 'sm'}
                        disableLink={true}
                    />
                )}

                {/* Price section */}
                <div className='flex items-center gap-2 py-1'>
                    {/* Show current price */}
                    <span className={cn(
                        'font-bold',
                        size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
                    )}>
                        {formattedPrice}
                    </span>

                    {/* Show original price if on sale */}
                    {formattedCompareAtPrice && discountPercentage !== null && (
                        <span className='text-xs text-muted-foreground line-through'>
                            {formattedCompareAtPrice}
                        </span>
                    )}
                </div>

                {/* Show total price if quantity > 1 */}
                {formattedTotalPrice && (
                    <div className="text-sm text-muted-foreground">
                        الإجمالي: <span className="font-medium text-foreground">{formattedTotalPrice}</span>
                    </div>
                )}

                {/* Quantity controls */}
                {showQuantityControls && !product.outOfStock && (
                    <div className='mt-2 flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={(e) => {
                                e.preventDefault();
                                handleQuantityChange(-1);
                            }}
                            disabled={quantity <= 1}
                            className="h-8 w-8 p-0"
                        >
                            -
                        </Button>

                        <Input
                            type='number'
                            value={quantity}
                            onChange={handleQuantityInput}
                            className='h-8 w-16 text-center'
                            min='1'
                        />

                        <Button
                            variant='outline'
                            size='sm'
                            onClick={(e) => {
                                e.preventDefault();
                                handleQuantityChange(1);
                            }}
                            className="h-8 w-8 p-0"
                        >
                            +
                        </Button>
                    </div>
                )}

                {/* Action buttons */}
                <div className='mt-3 flex flex-col gap-2'>
                    {/* Add to Cart button */}
                    {!product.outOfStock ? (
                        <Button
                            className={cn(
                                'w-full transition-all duration-300',
                                itemAddedToCart ? 'bg-green-600 hover:bg-green-700' : ''
                            )}
                            onClick={handleAddToCartClick}
                            disabled={quantity <= 0}
                        >
                            {itemAddedToCart ? (
                                <span className="flex items-center gap-1">
                                    <Check size={16} />
                                    {customInCartLabel || 'في السلة'}
                                </span>
                            ) : (
                                customAddToCartLabel || 'أضف للسلة'
                            )}
                        </Button>
                    ) : (
                        <>
                            {/* Out of stock actions */}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleNotifyClick}
                            >
                                <Bell size={16} className="mr-1" />
                                أشعرني عند التوفر
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleContactClick}
                            >
                                <PhoneCall size={16} className="mr-1" />
                                تواصل للطلب بكميات
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 