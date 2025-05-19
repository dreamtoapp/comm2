'use client';

import Image from 'next/image';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';

import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/formatCurrency';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

// Mini cart item component for the preview
const CartPreviewItem = ({
    product,
    quantity,
    updateQuantity,
    removeItem
}: {
    product: Product,
    quantity: number,
    updateQuantity: (productId: string, delta: number) => void,
    removeItem: (productId: string) => void
}) => {
    return (
        <div className="flex flex-col gap-2 py-3 px-2 border-b border-border last:border-0 hover:bg-muted/30 rounded-md">
            {/* Product info row */}
            <div className="flex items-center gap-3">
                {/* Product image */}
                <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted shrink-0">
                    <Image
                        src={product.imageUrl || '/fallback/product-fallback.avif'}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                    />
                </div>

                {/* Product details */}
                <div className="flex-1 overflow-hidden">
                    <h4 className="truncate text-sm font-medium">{product.name}</h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatCurrency(product.price)}</span>
                        <span>x{quantity}</span>
                    </div>
                </div>
            </div>
            
            {/* Controls row - separate row for controls to ensure they're always visible */}
            <div className="flex items-center justify-end gap-2 rtl:flex-row-reverse">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-md p-0 flex items-center justify-center"
                    onClick={() => updateQuantity(product.id, -1)}
                    disabled={quantity <= 1}
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-md p-0 flex items-center justify-center"
                    onClick={() => updateQuantity(product.id, 1)}
                >
                    <Plus className="h-4 w-4" />
                </Button>

                <Button
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9 rounded-md p-0 flex items-center justify-center"
                    onClick={() => removeItem(product.id)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

interface CartPreviewProps {
    closePopover?: () => void;
    className?: string;
}

export default function CartPreview({ closePopover, className }: CartPreviewProps) {
    const { cart, getTotalPrice, updateQuantity, removeItem } = useCartStore();
    const cartItems = Object.values(cart);
    const isEmpty = cartItems.length === 0;

    return (
        <div dir="rtl" className={cn("flex flex-col p-4 md:p-5 w-full md:min-w-[360px] md:max-w-[460px] bg-background border border-border rounded-lg", className)}>
            {/* Cart header */}
            <div className="flex items-center justify-between pb-2">
                <h3 className="text-lg font-semibold">سلة التسوق</h3>
                <span className="text-sm text-muted-foreground">
                    {cartItems.length} {cartItems.length === 1 ? 'منتج' : 'منتجات'}
                </span>
            </div>

            <Separator className="my-2" />

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <ShoppingBag className="mb-2 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-center text-muted-foreground">سلة التسوق فارغة</p>
                </div>
            ) : (
                <>
                    {/* Cart items */}
                    <ScrollArea className="max-h-72 md:max-h-[320px] w-full overflow-y-auto pr-4" type="always">
                        <div className="space-y-3 py-2">
                            {cartItems.map((item) => (
                                <CartPreviewItem
                                    key={item.product.id}
                                    product={item.product}
                                    quantity={item.quantity}
                                    updateQuantity={updateQuantity}
                                    removeItem={removeItem}
                                />
                            ))}
                        </div>
                    </ScrollArea>

                    <Separator className="my-3" />

                    {/* Cart footer */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between font-semibold text-base">
                            <span>المجموع:</span>
                            <span>{formatCurrency(getTotalPrice())}</span>
                        </div>

                        <div className="flex flex-col gap-2 md:flex-row md:gap-3 md:justify-between">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full md:flex-1"
                                onClick={closePopover}
                            >
                                <Link href="/cart">عرض السلة</Link>
                            </Button>

                            <Button
                                asChild
                                className="w-full md:flex-1"
                                onClick={closePopover}
                            >
                                <Link href="/checkout">إتمام الطلب</Link>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}