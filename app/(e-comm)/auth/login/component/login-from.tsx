'use client';
import { useActionState } from 'react';

import { Lock, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { userLogin } from '../action/userLogin';

// Define props interface
interface LoginPageProps {
  redirect?: string; // Add optional redirect prop
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LoginPage({}: LoginPageProps) {

  const [state, addAction, isPending] = useActionState(userLogin, { success: false, message: '' });

  return (
    <div dir='rtl' className='flex items-center justify-center'>
      <div className='w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg'>
        {/* Header */}
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold text-primary'>مرحباً بعودتك!</h1>
          <p className='text-gray-500'>أدخل بياناتك لتسجيل الدخول</p>
        </div>

        {/* Form */}
        <form action={addAction} className='space-y-4'>
          {/* Phone Input */}
          <div className='relative'>
            <Phone className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
            <Input
              type='tel'
              placeholder='رقم الهاتف'
              maxLength={10}
              className='pl-10'
              required
              autoComplete='tel'
              name='phone'
              pattern='05[0-9]{8}'
            />
          </div>

          {/* Password Input */}
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
            <Input type='password' placeholder='كلمة المرور' name='password' className='pl-10' />
          </div>
          {state.message && (
            <div
              className={`mt-4 rounded p-3 ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {state.message}
            </div>
          )}

          {/* Login Button */}
          <Button
            type='submit'
            disabled={isPending}
            className='w-full bg-primary hover:bg-primary/90'
          >
            {isPending ? 'جارٍ التسجيل...' : 'تسجيل الدخول'}
          </Button>

          {/* Divider */}
          <div className='my-4 flex items-center gap-4'>
            <hr className='w-full border-gray-300' />
            <span className='text-gray-500'>أو</span>
            <hr className='w-full border-gray-300' />
          </div>

          {/* Google Login */}
          {/* <Button
            variant="outline"
            onClick={() => signIn("google")}
            className="w-full gap-2"
          >
            <FaGoogle />
            تسجيل الدخول بحساب جوجل
          </Button> */}
        </form>

        {/* Footer Links */}
        <div className='text-center text-sm text-gray-500'>
          <a href='/auth/register' className='text-primary hover:underline'>
            إنشاء حساب جديد
          </a>
          <span className='mx-2'>·</span>
          <a href='/auth/forgot-password' className='hover:underline'>
            نسيت كلمة المرور؟
          </a>
        </div>
      </div>
    </div>
  );
}
