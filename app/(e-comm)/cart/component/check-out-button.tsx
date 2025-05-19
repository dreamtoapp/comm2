'use client';
import { useState } from 'react';

import { motion } from 'framer-motion';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { checkIsLogin } from '@/lib/check-is-login';

interface CheckOutProps {
  amount: number;
  productCount: number;
}

function CheckOut({ amount = 0, productCount = 0 }: CheckOutProps) {
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatAmount = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0.00';
    return value.toFixed(2);
  };

  const handleCheckout = async () => {
    if (productCount === 0) {
      toast.warning('السلة فارغة، أضف منتجات أولاً');
      return;
    }

    setIsLoading(true);
    try {
      const isLoggedIn = await checkIsLogin();

      if (!isLoggedIn) {
        setShowLoginDialog(true);
        return;
      }

      router.push('/checkout');
      toast.success('جاري التوجيه إلى صفحة الدفع...');
    } catch {
      toast.error('حدث خطأ أثناء التحقق من حالة الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent('/checkout')}`);
    setShowLoginDialog(false);
  };

  return (
    <div className='mx-auto w-full max-w-md rounded-2xl p-4'>
      <Button
        onClick={handleCheckout}
        disabled={isLoading || productCount === 0}
        aria-label='إتمام عملية الشراء'
        className={`group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className='absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10' />
        {isLoading ? (
          <Loader2 className='mx-auto h-6 w-6 animate-spin text-white' />
        ) : (
          <div className='flex w-full items-center justify-between'>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: 'easeInOut',
              }}
              className='rounded-full bg-white/20 p-2'
            >
              <ShoppingCart className='h-5 w-5 text-white' />
            </motion.div>

            <div className='flex flex-col items-center gap-1'>
              <span className='text-base font-bold tracking-tight'>إتمام الشراء</span>
              <span className='text-xs font-medium opacity-90'>
                {productCount} منتج • {formatAmount(amount)} ر.س
              </span>
            </div>
          </div>
        )}
      </Button>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className='rounded-xl sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>تسجيل الدخول المطلوب</DialogTitle>
            <DialogDescription className='text-gray-600 dark:text-gray-300'>
              يرجى تسجيل الدخول لإتمام عملية الشراء
            </DialogDescription>
          </DialogHeader>

          <div className='mt-6 flex justify-end gap-4'>
            <Button
              variant='outline'
              onClick={() => setShowLoginDialog(false)}
              className='rounded-lg border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              لاحقاً
            </Button>
            <Button
              onClick={handleLoginRedirect}
              className='rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
            >
              تسجيل الدخول الآن
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CheckOut;
