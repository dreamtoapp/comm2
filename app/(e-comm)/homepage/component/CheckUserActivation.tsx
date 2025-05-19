import { AlertCircle, KeyRound, ShieldX } from 'lucide-react';

import Link from '@/components/link';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';

const CheckUserActivation = ({ user }: { user?: User }) => {
  const isOtp = user?.isOtp;
  if (!user || isOtp) return null;

  return (
    <div className='mb-4'>
      <div
        className={cn(
          'flex w-full flex-col items-center justify-between rounded-lg border p-4 sm:flex-row',
          'border-destructive/30 bg-destructive/10 text-destructive',
          'transition-colors duration-200 hover:bg-destructive/20',
        )}
        role='alert' // Added for better accessibility
        aria-live='polite' // Ensures screen readers announce the alert
      >
        <div className='mb-3 flex items-center gap-3 sm:mb-0'>
          <div className='relative'>
            <ShieldX className='h-6 w-6' aria-hidden='true' /> {/* Marked as decorative */}
            <AlertCircle
              className='absolute -right-1 -top-1 h-3 w-3 animate-pulse'
              fill='currentColor'
              aria-hidden='true' // Marked as decorative
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-medium sm:text-base'>حساب غير مفعل</span>
            <span className='text-xs opacity-80'>التفعيل مطلوب للوصول الكامل</span>
          </div>
        </div>

        <Link
          href={`/auth/verify?id=${user.id}`}
          className={cn(
            'flex items-center gap-2 rounded-md px-4 py-2',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'w-full transition-colors duration-150 sm:w-auto',
          )}
          aria-label='تفعيل الحساب' // Improved accessibility
        >
          <KeyRound className='h-4 w-4' aria-hidden='true' /> {/* Marked as decorative */}
          <span className='font-medium'>اكمال التفعيل</span>
        </Link>
      </div>
    </div>
  );
};
export default CheckUserActivation;
