// app/(auth)/register/page.tsx
'use client';
import { useActionState } from 'react';

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { registerUser } from '../action/actions';

// Reusable Loading Spinner Component
const LoadingSpinner = () => (
  <div className='flex items-center justify-center'>
    <svg
      className='mr-2 h-5 w-5 animate-spin text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      role='status'
    >
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
    </svg>
    جاري التسجيل...
  </div>
);

// Status Message Component
const StatusMessage = ({ success, message }: { success: boolean; message: string }) => (
  <div
    className={`mt-4 rounded-lg p-3 text-center ${success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
    role='alert'
  >
    {message}
  </div>
);

// Form Input Field Component
const FormInput = ({
  label,
  name,
  type,
  placeholder,
  pattern,
  maxLength,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  pattern?: string;
  maxLength?: number;
}) => (
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-gray-700'>{label}</label>
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      pattern={pattern}
      maxLength={maxLength}
      className='focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
      required
    />
  </div>
);

// Form Divider Component
const FormDivider = () => (
  <div className='relative my-6'>
    <div className='absolute inset-0 flex items-center'>
      <span className='w-full border-t border-gray-300' />
    </div>
    <div className='relative flex justify-center text-sm'>
      <span className='bg-white px-2 text-gray-500'>أو</span>
    </div>
  </div>
);

// Auth Link Component
const AuthLink = ({ href, text }: { href: string; text: string }) => (
  <p className='mt-4 text-center text-sm text-gray-600'>
    {text}{' '}
    <Link href={href} className='font-medium text-blue-600 transition-colors hover:text-blue-500'>
      تسجيل الدخول
    </Link>
  </p>
);

export default function RegisterForm() {
  const [state, addAction, isPending] = useActionState(registerUser, {
    success: false,
    message: '',
  });

  return (
    <div className='flex items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-4 shadow-lg'>
        <header className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>تسجيل حساب جديد</h1>
          <p className='mt-2 text-sm text-gray-600'>قم بإنشاء حسابك للوصول إلى جميع الميزات</p>
        </header>

        <form className='space-y-6' action={addAction}>
          <div className='space-y-4'>
            <FormInput
              label='رقم الهاتف'
              name='phone'
              type='tel'
              placeholder='05XXXXXXXX'
              pattern='05[0-9]{8}'
              maxLength={10}
            />

            <FormInput label='الاسم الكامل' name='name' type='text' placeholder='خالد نديش' />

            <FormInput label='كلمة المرور' name='password' type='password' placeholder='********' />

            <FormInput
              label='تأكيد كلمة المرور'
              name='confirmPassword'
              type='password'
              placeholder='********'
            />
          </div>

          {state.message && <StatusMessage success={state.success} message={state.message} />}

          <Button
            type='submit'
            disabled={isPending}
            className='h-11 w-full text-base font-medium transition-colors'
          >
            {isPending ? <LoadingSpinner /> : 'تسجيل الحساب'}
          </Button>

          <FormDivider />

          {/* Uncomment for social auth */}
          {/* <SocialAuthButton provider="google" /> */}

          <AuthLink href='/auth/login' text='هل لديك حساب بالفعل؟' />
        </form>
      </div>
    </div>
  );
}
