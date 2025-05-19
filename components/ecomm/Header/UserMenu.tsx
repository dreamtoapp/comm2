'use client';
import {
  useEffect,
  useState,
} from 'react';

import {
  BadgeAlert,
  ChevronRight,
  Heart,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  User,
  Wallet,
} from 'lucide-react'; // Import icons directly
import { Session } from 'next-auth';

import Link from '@/components/link';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Removed Icon import: import { Icon } from '@/components/icons';
import {
  cn,
  iconVariants,
} from '@/lib/utils'; // Correct import path for CVA variants
import { useCartStore } from '@/store/cartStore';

import { userLogOut } from '../../../app/(e-comm)/auth/action';
import { Button } from '../../ui/button';

interface UserMenuProps {
  session: Session | null; // Allow null
}

export default function UserMenu({ session }: UserMenuProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);
  const { clearCart, getTotalItems } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleClearCart = async () => {
    try {
      setIsClearingCart(true);
      clearCart();
      // Small delay to show the loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsClearingCart(false);
    }
  };

  if (!session) {
    return (
      <Button
        variant='outline'
        asChild
        className='group border-primary/20 transition-all duration-200 ease-in-out hover:border-primary/40 hover:bg-primary/10'
      >
        <Link href='/auth/login' className='flex items-center gap-2 px-4 py-2'>
          <LogIn // Use direct import
            className={iconVariants({ size: 'xs', className: 'text-primary transition-transform group-hover:scale-110' })}
          />
          <span className='font-medium text-primary'>دخول</span>
        </Link>
      </Button>
    );
  }

  const logOut = async () => {
    try {
      setIsLoggingOut(true);
      await userLogOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost' // Reverted to 'ghost'
          aria-label={`قائمة المستخدم - ${session.user.name}`}
          className={cn(
            'group flex items-center gap-3 rounded-lg p-3 transition-all duration-200', // Removed hover:bg-accent/20
            'relative ring-offset-background focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2', // Made ring semi-transparent
            'transform hover:scale-[1.02]' // Kept scale effect
          )}
        >
          <div className='relative'>
            {/* The Avatar's group-hover for border and shadow will provide feedback */}
            <Avatar className='h-10 w-10 border-2 border-primary/10 transition-all group-hover:border-primary/50 group-hover:shadow-md'>
              {/* Reverted Avatar size and border styles */}
              <AvatarFallback className='bg-gradient-to-br from-primary/10 to-muted/10 font-medium text-primary'>
                {session.user.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {session.user.role === 'admin' && (
              <BadgeAlert // Use direct import
                className={iconVariants({ size: 'xs', className: 'absolute -bottom-1 -right-1 fill-destructive/20 text-destructive' })} // Reverted badge position
              />
            )}
          </div>
          <span
            className='hidden truncate text-sm font-semibold text-foreground/90 sm:inline' // Reverted: removed group-hover:text-primary
          >
            {session.user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-60 rounded-xl border-border bg-background p-1 shadow-xl'
        sideOffset={10}
      >
        <DropdownMenuLabel className='flex items-center justify-between rounded-t-lg bg-muted/20 px-4 py-2'>
          <span className='text-sm font-semibold text-foreground'>الحساب</span>
          {session.user.role === 'admin' && (
            <span className='flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs text-destructive'>
              <BadgeAlert className={iconVariants({ size: 'xs' })} /> {/* Use direct import */}
              مدير النظام
            </span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className='my-1 bg-border/50' />

        {/* Profile Link */}
        <DropdownMenuItem asChild>
          <Link
            href={`/user/profile?id=${session.user.id}`}
            className='flex items-center justify-between rounded-md px-4 py-2 transition-all duration-150 hover:bg-accent/20'
          >
            <div className='flex items-center gap-3'>
              <div className='rounded-md bg-primary/10 p-2'>
                <User className={iconVariants({ size: 'xs', className: 'text-primary' })} /> {/* Use direct import */}
              </div>
              <span className='text-sm font-medium'>الملف الشخصي</span>
            </div>
            <ChevronRight className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import */}
          </Link>
        </DropdownMenuItem>

        {/* Financial Transactions */}
        <DropdownMenuItem asChild>
          <Link
            href={`/user/statement?id=${session.user.id}`}
            className='flex items-center justify-between rounded-md px-4 py-2 transition-all duration-150 hover:bg-accent/20'
          >
            <div className='flex items-center gap-3'>
              <div className='rounded-md bg-emerald-500/10 p-2'>
                <Wallet className={iconVariants({ size: 'xs', className: 'text-emerald-500' })} /> {/* Use direct import */}
              </div>
              <span className='text-sm font-medium'>الحركات المالية</span>
            </div>
            <ChevronRight className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import */}
          </Link>
        </DropdownMenuItem>

        {/* Purchase History */}
        <DropdownMenuItem asChild>
          <Link
            href={`/user/purchase-history`}
            className='flex items-center justify-between rounded-md px-4 py-2 transition-all duration-150 hover:bg-accent/20'
          >
            <div className='flex items-center gap-3'>
              <div className='rounded-md bg-blue-500/10 p-2'>
                <ShoppingBag className={iconVariants({ size: 'xs', className: 'text-blue-500' })} /> {/* Use direct import */}
              </div>
              <span className='text-sm font-medium'>سجل المشتريات</span>
            </div>
            <ChevronRight className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import */}
          </Link>
        </DropdownMenuItem>

        {/* Rating History */}
        <DropdownMenuItem asChild>
          <Link
            href={`/user/ratings`}
            className='flex items-center justify-between rounded-md px-4 py-2 transition-all duration-150 hover:bg-accent/20'
          >
            <div className='flex items-center gap-3'>
              <div className='rounded-md bg-amber-500/10 p-2'>
                <Star className={iconVariants({ size: 'xs', className: 'text-amber-500' })} /> {/* Use direct import */}
              </div>
              <span className='text-sm font-medium'>تقييماتي</span>
            </div>
            <ChevronRight className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import */}
          </Link>
        </DropdownMenuItem>

        {/* Wishlist */}
        <DropdownMenuItem asChild>
          <Link
            href={`/user/wishlist`}
            className='flex items-center justify-between rounded-md px-4 py-2 transition-all duration-150 hover:bg-accent/20'
          >
            <div className='flex items-center gap-3'>
              <div className='rounded-md bg-red-500/10 p-2'>
                <Heart className={iconVariants({ size: 'xs', className: 'text-red-500' })} /> {/* Use direct import */}
              </div>
              <span className='text-sm font-medium'>المفضلة</span>
            </div>
            <ChevronRight className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import */}
          </Link>
        </DropdownMenuItem>

        {/* Setting */}
        <DropdownMenuItem asChild>
          <Link
            href={`/user/setting`}
            className='flex items-center justify-between rounded-md px-4 py-2 transition-all duration-150 hover:bg-accent/20'
          >
            <div className='flex items-center gap-3'>
              <div className='rounded-md bg-emerald-500/10 p-2'>
                <Settings className={iconVariants({ size: 'xs', className: 'text-secondary' })} /> {/* Use direct import */}
              </div>
              <span className='text-sm font-medium'>الاعدادات</span>
            </div>
            <ChevronRight className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import */}
          </Link>
        </DropdownMenuItem>

        {/* Admin Dashboard */}
        {session.user.role === 'admin' && (
          <>
            <DropdownMenuSeparator className='my-1 bg-border/50' />
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard'
                className='flex items-center justify-between rounded-md px-4 py-2 transition-all duration-150 hover:bg-accent/20'
              >
                <div className='flex items-center gap-3'>
                  <div className='rounded-md bg-purple-500/10 p-2'>
                    <Lock className={iconVariants({ size: 'xs', className: 'text-purple-500' })} /> {/* Use direct import */}
                  </div>
                  <span className='text-sm font-medium'>لوحة التحكم</span>
                </div>
                <ChevronRight className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import */}
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className='my-1 bg-border/50' />

        {/* Cart Actions */}
        {getTotalItems() > 0 && (
          <>
            <DropdownMenuItem
              onClick={handleClearCart}
              disabled={isClearingCart}
              className='flex cursor-pointer items-center justify-between rounded-md px-4 py-2 text-destructive transition-all duration-150 hover:bg-destructive/10'
            >
              <div className='flex items-center gap-3'>
                <div className='rounded-md bg-destructive/10 p-2'>
                  {isClearingCart ? (
                    <Loader2 className={iconVariants({ size: 'xs', animation: 'spin', className: 'text-destructive' })} /> // Use direct import
                  ) : (
                    <ShoppingCart className={iconVariants({ size: 'xs', className: 'text-destructive' })} /> // Use direct import
                  )}
                </div>
                <span className='text-sm font-medium'>
                  {isClearingCart ? 'جاري إفراغ السلة...' : 'إفراغ سلة التسوق'}
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className='my-1 bg-border/50' />
          </>
        )}

        {/* Logout Button */}
        <DropdownMenuItem
          onClick={logOut}
          disabled={isLoggingOut}
          className='flex cursor-pointer items-center justify-between rounded-md px-4 py-2 text-destructive transition-all duration-150 hover:bg-destructive/10'
        >
          <div className='flex items-center gap-3'>
            <div className='rounded-md bg-destructive/10 p-2'>
              {isLoggingOut ? (
                <Loader2 className={iconVariants({ size: 'xs', animation: 'spin', className: 'text-destructive' })} /> // Use direct import
              ) : (
                <LogOut className={iconVariants({ size: 'xs', className: 'text-destructive' })} /> // Use direct import
              )}
            </div>
            <span className='text-sm font-medium'>
              {isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
