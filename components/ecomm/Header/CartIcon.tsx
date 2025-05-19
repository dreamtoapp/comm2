'use client';
import {
  useEffect,
  useState,
} from 'react';

import { ShoppingCart } from 'lucide-react'; // Import directly


import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { iconVariants } from '@/lib/utils'; // Correct import path for CVA variants
import { useCartStore } from '@/store/cartStore';
import { useMediaQuery } from '@/hooks/use-media-query';

import CartPreview from './CartPreview';

export default function CartIcon() {
  const { getTotalUniqueItems } = useCartStore();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => setMounted(true), []);

  // Close popover/sheet when navigating away
  const handleClose = () => setIsOpen(false);

  if (!mounted) return null;

  // The CartIcon UI remains mostly the same
  const cartIcon = (
    <Button
      aria-label="عرض السلة"
      variant="ghost"
      className="relative flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 transition-all duration-300 hover:scale-105 hover:bg-primary/20"
    >
      <ShoppingCart
        className={iconVariants({ size: 'sm', variant: 'primary' })}
        aria-label="عرض السلة"
      />

      {mounted && getTotalUniqueItems() > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 animate-bounce items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white shadow-md">
          {getTotalUniqueItems()}
        </span>
      )}
    </Button>
  );

  // Mobile version - bottom sheet
  if (isMobile) {
    return (
      <div className="relative">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            {cartIcon}
          </SheetTrigger>

          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
  <SheetTitle>
    <span className="text-lg font-semibold text-primary">عربة التسوق</span>
  </SheetTitle>
  <CartPreview closePopover={handleClose} />
</SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop version - popover dropdown
  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {cartIcon}
        </PopoverTrigger>

        <PopoverContent
          className="w-80 p-2 shadow-lg rounded-xl"
          align="end"
          sideOffset={10}
        >
          <CartPreview closePopover={handleClose} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
