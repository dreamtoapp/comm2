'use client';
import {
  useEffect,
  useState,
} from 'react';

import { Loader2, AlertTriangle } from 'lucide-react'; // Import AlertTriangle

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import {
  otpViaEmail,
  verifyTheUser,
} from '../action/otp-via-email';

export default function OtpForm({ phone, email }: { phone: string; email: string }) {
  // const { data: session, status } = useSession() as { data: UserData; status: string };
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'whatsapp' | 'email' | null>(null);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otpFromBackEnd, setOtpFromBackEnd] = useState('');

  const userEmail = email || '';
  const userPhone = phone || '';

  // Validation functions
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const hasValidContact =
    (userEmail && isValidEmail(userEmail)) || (userPhone && isValidPhone(userPhone));

  useEffect(() => {
    if (status === 'authenticated' && !hasValidContact) {
      setError(
        <div className='mb-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700'>
          <p className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5' /> {/* Replace inline SVG */}
            <span>
              بيانات الاتصال غير مكتملة أو غير صالحة.
              <Link href='/profile' className='ml-2 text-primary underline'>
                تحديث البيانات الشخصية
              </Link>
            </span>
          </p>
        </div>,
      );
    }
  }, [hasValidContact]);

  const handleSendOTP = async () => {
    setError('');
    setSuccess('');

    if (!selectedMethod) {
      return setError('الرجاء اختيار طريقة الإرسال');
    }

    if (selectedMethod === 'email') {
      if (!userEmail) {
        return setError(
          <>
            البريد الإلكتروني غير مسجل.
            <Link href='/profile' className='ml-2 text-primary underline'>
              تحديث البريد
            </Link>
          </>,
        );
      }
      if (!isValidEmail(userEmail)) {
        return setError(
          <>
            البريد الإلكتروني غير صالح.
            <Link href='/profile' className='ml-2 text-primary underline'>
              تصحيح البريد
            </Link>
          </>,
        );
      }
      const { token } = await otpViaEmail(userEmail);
      setOtpFromBackEnd(token || '');
    }

    if (selectedMethod === 'sms' || selectedMethod === 'whatsapp') {
      if (!userPhone) {
        return setError(
          <>
            رقم الهاتف غير مسجل.
            <Link href='/profile' className='ml-2 text-primary underline'>
              تحديث الرقم
            </Link>
          </>,
        );
      }
      if (!isValidPhone(userPhone)) {
        return setError(
          <>
            رقم الهاتف غير صالح.
            <Link href='/profile' className='ml-2 text-primary underline'>
              تصحيح الرقم
            </Link>
          </>,
        );
      }
    }

    setIsLoading(true);

    try {
      // Simulate API call - Replace with actual OTP sending logic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsOTPSent(true);
      setSuccess(`تم إرسال الرمز إلى ${selectedMethod === 'email' ? userEmail : userPhone}`);
      setTimer(60);
    } catch {
      setError('حدث خطأ أثناء الإرسال. حاول مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(60);
    handleSendOTP();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 4) {
      return setError('الرجاء إدخال رمز التحقق المكون من 4 أرقام');
    }

    setIsLoading(true);

    try {
      // Simulate verification - Replace with actual API call
      if (otp !== otpFromBackEnd) {
        setError('رمز التحقق غير صحيح. حاول مرة أخرى');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (otp === otpFromBackEnd) {
        await verifyTheUser(userEmail);
        setSuccess('تم التحقق بنجاح! جاري التوجيه...');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setError('');
        setSuccess('');
        setOtp('');
        setIsOTPSent(false);
        setTimer(0);
        setSelectedMethod(null);
        setOtpFromBackEnd('');
        setIsLoading(false);
        window.location.href = '/';
      }

      // Add redirect logic here
    } catch {
      setError('رمز التحقق غير صحيح. حاول مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0 && isOTPSent) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isOTPSent]);

  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center' dir='rtl'>
      <Card className='w-full max-w-md'>
        {error && <div className='mb-4'>{error}</div>}

        <CardHeader>
          <CardTitle className='text-2xl'>تأكيد الرقم السري</CardTitle>
          <CardDescription>
            {isOTPSent
              ? `أدخل الرمز المرسل إلى ${selectedMethod === 'email' ? 'بريدك الإلكتروني' : 'رقمك'}`
              : 'اختر طريقة الإرسال'}
          </CardDescription>
        </CardHeader>

        {!isOTPSent ? (
          <CardContent className='space-y-4'>
            <div className='flex gap-2'>
              <Button
                variant={selectedMethod === 'sms' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('sms')}
                className='flex-1'
                disabled={!userPhone || !isValidPhone(userPhone)}
              >
                SMS
                {!userPhone && <span className='mr-1 text-xs'>(غير متوفر)</span>}
                {userPhone && !isValidPhone(userPhone) && (
                  <span className='mr-1 text-xs'>(غير صالح)</span>
                )}
              </Button>
              <Button
                variant={selectedMethod === 'whatsapp' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('whatsapp')}
                className='flex-1'
                disabled={!userPhone || !isValidPhone(userPhone)}
              >
                WhatsApp
                {!userPhone && <span className='mr-1 text-xs'>(غير متوفر)</span>}
                {userPhone && !isValidPhone(userPhone) && (
                  <span className='mr-1 text-xs'>(غير صالح)</span>
                )}
              </Button>
              <Button
                variant={selectedMethod === 'email' ? 'default' : 'outline'}
                onClick={() => setSelectedMethod('email')}
                className='flex-1'
                disabled={!userEmail || !isValidEmail(userEmail)}
              >
                Email
                {!userEmail && <span className='mr-1 text-xs'>(غير متوفر)</span>}
                {userEmail && !isValidEmail(userEmail) && (
                  <span className='mr-1 text-xs'>(غير صالح)</span>
                )}
              </Button>
            </div>

            {selectedMethod && (
              <div className='rounded-lg bg-gray-100 p-4 text-center'>
                <p className='font-medium'>سيتم الإرسال إلى:</p>
                <p className='text-primary'>{selectedMethod === 'email' ? userEmail : userPhone}</p>
              </div>
            )}

            <Button
              className='w-full'
              onClick={handleSendOTP}
              disabled={!selectedMethod || isLoading || !hasValidContact}
            >
              {isLoading ? (
                <>
                  <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                  جاري الإرسال...
                </>
              ) : (
                'إرسال الرمز'
              )}
            </Button>

            {error && typeof error === 'string' && (
              <p className='text-center text-sm text-red-500'>{error}</p>
            )}
            {success && <p className='text-center text-sm text-green-500'>{success}</p>}
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-center' dir='ltr'>
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className='text-center text-sm'>
                لم تستلم الرمز؟{' '}
                <Button
                  type='button'
                  variant='link'
                  className='p-0 text-primary'
                  onClick={handleResend}
                  disabled={timer > 0 || isLoading}
                >
                  إعادة الإرسال {timer > 0 && `(${timer})`}
                </Button>
              </div>

              {error && typeof error === 'string' && (
                <p className='text-center text-sm text-red-500'>{error}</p>
              )}
              {success && <p className='text-center text-sm text-green-500'>{success}</p>}
            </CardContent>

            <CardContent>
              <Button type='submit' className='w-full' disabled={isLoading || otp.length !== 4}>
                {isLoading ? (
                  <>
                    <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                    جاري التحقق...
                  </>
                ) : (
                  'تأكيد الرمز'
                )}
              </Button>
            </CardContent>
          </form>
        )}
      </Card>
    </div>
  );
}
