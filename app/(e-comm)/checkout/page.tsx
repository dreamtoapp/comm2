'use client';
import { useEffect, useState } from 'react';

import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useCheckIsLogin } from '@/hooks/use-check-islogin';
import { useCartStore } from '@/store/cartStore';

import { CreateOrderInDb } from './actions/creatOrder';
import MiniCartSummary from './components/MiniCartSummary';
import { ShiftSelector } from './components/ShiftSelector';
import TermsDialog from './components/TermsDialog';

const CheckOutPage = () => {
  const router = useRouter();
  const { session, isLoading, isAuthenticated } = useCheckIsLogin();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cart, getTotalPrice, getTotalItems } = useCartStore();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [isLoading, isAuthenticated, router]);

  const validateForm = () => {
    const errors = [];
    if (!selectedShiftId) errors.push('الرجاء اختيار موعد التسليم');
    if (!agreedToTerms) errors.push('يجب الموافقة على الشروط والأحكام');
    setFormErrors(errors);
    return errors.length === 0;
  };

  const createOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formattedCart = Object.values(cart).map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const orderData = {
        userId: session!.user.id,
        phone: session!.user.phone,
        name: session!.user.name,
        address: session!.user.address,
        lat: session!.user.latitude,
        lng: session!.user.longitude,
        cart: formattedCart,
        totalAmount: getTotalPrice(),
        totalItems: getTotalItems(),
        shiftId: selectedShiftId,
      };

      const orderResult = await CreateOrderInDb(orderData);
      if (orderResult) {
        toast('تم إنشاء الطلب بنجاح');
        router.push(`/happyorder?orderid=${orderResult}`);
      }
    } catch {
      toast('فشل في إتمام العملية، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 md:flex-row md:items-start'>
        <div className='w-full max-w-md space-y-4'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-32 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
        <Skeleton className='h-64 w-full md:w-1/3' />
      </div>
    );
  }
  const clienAddress = session?.user?.address;

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 p-4 md:flex-row md:items-start'>
      <div className='w-full max-w-2xl rounded-xl border border-muted p-6 shadow-lg'>
        <Card className='mx-auto w-full rounded-lg bg-secondary p-4 text-foreground shadow-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
              تأكيد الطلب
              <FaInfoCircle className='text-lg text-muted-foreground' />
            </CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              {/* User Info Section */}
              <div className='grid grid-cols-1 gap-4 rounded-lg bg-muted/10 p-4 md:grid-cols-2'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>رقم الهاتف</p>
                  <p className='font-medium'>{session?.user?.phone}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>الاسم</p>
                  <p className='font-medium'>{session?.user?.name}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>العنوان</p>
                  {clienAddress ? (
                    <p className='font-medium'>{session?.user?.address}</p>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <p className='font-medium text-destructive'>اضف عنوانك من فضلك</p>
                      <Button
                        variant='outline'
                        onClick={() => router.push(`/user/profile?id=${session?.user.id}`)}
                      >
                        <Pencil />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Time */}
              <div className='space-y-2'>
                <p className='text-sm font-medium'>موعد التسليم</p>
                <ShiftSelector
                  selectedShiftId={selectedShiftId}
                  onShiftSelect={setSelectedShiftId}
                />
                {formErrors.includes('الرجاء اختيار موعد التسليم') && (
                  <p className='flex items-center gap-2 text-sm text-destructive'>
                    <FaInfoCircle />
                    الرجاء اختيار موعد التسليم
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-4'>
            {/* Terms Agreement */}
            <div className='flex w-full items-center gap-2'>
              <Checkbox
                id='terms'
                checked={agreedToTerms}
                onCheckedChange={(checked) => {
                  setAgreedToTerms(checked === true);
                  setFormErrors((errors) =>
                    errors.filter((e) => e !== 'يجب الموافقة على الشروط والأحكام'),
                  );
                }}
                className={`border-primary data-[state=checked]:bg-primary ${formErrors.includes('يجب الموافقة على الشروط والأحكام') ? 'ring-2 ring-destructive' : ''}`}
              />
              <div className='flex items-center gap-1'>
                <label htmlFor='terms' className='text-sm text-muted-foreground'>
                  أوافق على
                </label>
                <TermsDialog />
                {formErrors.includes('يجب الموافقة على الشروط والأحكام') && (
                  <span className='flex items-center gap-1 text-sm text-destructive'>
                    <FaInfoCircle />
                    مطلوب
                  </span>
                )}
              </div>
            </div>

            {/* Form Errors */}
            {formErrors.length > 0 && (
              <div className='w-full rounded-lg border border-destructive bg-destructive/10 p-3'>
                <p className='flex items-center gap-2 text-destructive'>
                  <FaInfoCircle />
                  يرجى إكمال جميع الحقول المطلوبة
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={createOrder}
              className='h-12 w-full bg-primary text-primary-foreground transition-all hover:bg-primary/90'
              disabled={
                isSubmitting ||
                !session ||
                formErrors.length > 0 ||
                !selectedShiftId ||
                !agreedToTerms
              }
            >
              {isSubmitting ? (
                <div className='flex items-center gap-2'>
                  <FaSpinner className='animate-spin' />
                  جاري تأكيد الطلب
                </div>
              ) : (
                <span className='text-lg'>تأكيد الطلب</span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Cart Summary */}
      <div className='sticky top-4 w-full md:w-1/3 lg:w-1/4'>
        <MiniCartSummary />
        <div className='mt-4 rounded-lg border border-muted bg-muted/10 p-4'>
          <h3 className='mb-2 font-medium'>معلومات مهمة</h3>
          <p className='text-sm text-muted-foreground'>
            سيتم تأكيد طلبك خلال 24 ساعة عبر الرسائل النصية
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
