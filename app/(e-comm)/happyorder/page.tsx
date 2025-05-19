'use client';
import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import Confetti from 'react-confetti'; // Import Confetti
import useWindowSize from 'react-use/lib/useWindowSize'; // For responsive confetti
import { CheckCircle, MessageSquareText } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/store/cartStore';

// Semantic Colors
const SEMANTIC_COLORS = {
  success: {
    border: 'border-green-500',
    bg: 'bg-background',
    text: 'text-green-700',
  },
  warning: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
  },
  error: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  info: {
    border: 'border-blue-500',
    bg: 'bg-background',
    text: 'text-blue-700',
  },
  default: {
    border: 'border-gray-300',
    bg: 'bg-blue-600',
    text: 'text-white',
  },
};

const WHATSAPP_NUMBER = '1234567890'; // Replace with your WhatsApp number
const WHATSAPP_MESSAGE = 'مرحبًا! أريد متابعة حالة طلبي برقم الطلب:';

export default function OrderConfirmation() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [showClearCartDialog, setShowClearCartDialog] = useState(true);
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const { width, height } = useWindowSize(); // Get window size for responsive confetti

  // Use useSearchParams to get query parameters
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderid');

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
    setIsClient(true); // Mark as client-side after component mounts
  }, [orderId, router]);

  const handleClearCart = () => {
    clearCart();
    setShowClearCartDialog(false);
    router.push('/');
  };

  const handleKeepCart = () => {
    setShowClearCartDialog(false);
    router.push('/');
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`${WHATSAPP_MESSAGE} ${orderId}`)}`;

  if (!orderId) return null;

  return (
    <div
      className='relative flex min-h-screen items-center justify-center p-4'
      dir='rtl' // Add RTL support
    >
      {/* Add Confetti */}
      {isClient && (
        <Confetti
          width={width}
          height={height}
          recycle={false} // Stop confetti after one cycle
        />
      )}

      <Card
        className={`w-full max-w-md ${SEMANTIC_COLORS.success.border} ${SEMANTIC_COLORS.success.bg}`}
      >
        <CardHeader className='text-center'>
          <CheckCircle className={iconVariants({ size: 'xl', className: 'mx-auto text-green-500' })} /> {/* Use direct import + CVA (adjust size if needed) */}
          <CardTitle className='text-2xl'>تم تأكيد الطلب!</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Alert
            className={`border-blue-200 bg-blue-50 ${SEMANTIC_COLORS.info.border} ${SEMANTIC_COLORS.info.bg}`}
          >
            <AlertTitle className='text-lg font-semibold'>رقم الطلب: #{orderId}</AlertTitle>
            <AlertDescription>لقد تلقينا طلبك بنجاح.</AlertDescription>
          </Alert>
          <div className='text-center'>
            <Button asChild variant='outline' className='w-full'>
              <a
                href={whatsappLink}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <MessageSquareText className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
                تتبع الطلب عبر واتساب
              </a>
            </Button>
          </div>
          {showClearCartDialog && (
            <div
              className={`mt-6 rounded-lg p-4 ${SEMANTIC_COLORS.default.border} ${SEMANTIC_COLORS.default.bg}`}
            >
              <h3 className='mb-2 text-lg font-medium'>إفراغ سلة التسوق؟</h3>
              <p className='mb-4 text-sm text-gray-100'>
                هل ترغب في إفراغ السلة لشراء منتجات جديدة؟
              </p>
              <div className='flex gap-2'>
                <Button onClick={handleClearCart} className='flex-1 bg-red-500 hover:bg-red-600'>
                  نعم، إفراغ السلة
                </Button>
                <Button onClick={handleKeepCart} variant='outline' className='flex-1'>
                  الاحتفاظ بالعناصر
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className='mt-4 flex justify-center'>
          <Button variant='link' onClick={() => router.push('/')} className='text-gray-600'>
            متابعة التسوق →
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
