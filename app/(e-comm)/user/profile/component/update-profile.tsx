'use client';
import { useActionState, useEffect, useState } from 'react';
import { EyeOff, Eye, MapPin, Globe, Loader2, ExternalLink, AlertCircle } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@prisma/client';

import useAccurateGeolocation from '../../../../../hooks/use-geo';
import { updateUserProfile } from '../action/update-user-profile';

const UserProfileForm = ({ userData }: { userData: User }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [state, fromAction, ispending] = useActionState(updateUserProfile, {
    success: false,
    message: '',
  });

  const {
    geoLatitude,
    geoLongitude,
    geoError,
    geoIsLoading,
    getGeolocation,
    getGoogleMapsLink,
  } = useAccurateGeolocation({
    accuracyThreshold: 10,
    maxRetries: 1,
  });

  useEffect(() => {
    getGeolocation();
  }, [getGeolocation]); // Add dependency

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  return (
    <form
      action={fromAction}
      className='mx-auto max-w-2xl space-y-6 rounded-xl border border-gray-100 bg-white p-8 shadow-xl'
      dir='rtl'
    >
      <div className='space-y-3 text-center'>
        <h2 className='text-3xl font-bold text-gray-900'>الملف الشخصي</h2>
        <p className='text-gray-600'>إدارة إعدادات الحساب وتحديث المعلومات</p>
        <p className='text-gray-600'>المعرف:{userData.phone}</p>
      </div>

      {/* Form Fields */}
      <div className='space-y-5'>
        {/* User ID */}

        {/* Name */}
        <div className='space-y-2'>
          <Label htmlFor='name' className='font-medium text-gray-700'>
            الاسم الكامل
          </Label>
          <Input
            id='name'
            name='name'
            defaultValue={userData?.name || ''}
            placeholder='أدخل اسمك'
            required
            className='w-full focus:border-transparent focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Grid for Phone and Email */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='font-medium text-gray-700'>
              البريد الإلكتروني
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              defaultValue={userData.email || ''}
              placeholder='أدخل البريد الإلكتروني'
              required
              className='w-full'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password' className='font-medium text-gray-700'>
              كلمة المرور
            </Label>
            <div className='relative'>
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                defaultValue={userData.password || ''}
                className='w-full pr-10'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
                disabled={ispending}
              >
                {showPassword ? (
                  <EyeOff className={iconVariants({ size: 'sm', className: 'text-gray-500' })} aria-hidden='true' /> // Use direct import + CVA
                ) : (
                  <Eye className={iconVariants({ size: 'sm', className: 'text-gray-500' })} aria-hidden='true' /> // Use direct import + CVA
                )}
                <span className='sr-only'>
                  {showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                </span>
              </Button>
            </div>
            <p className='text-sm text-gray-500'>اتركه فارغًا إذا لم ترد التغيير</p>
          </div>
        </div>
        {/* Address */}
        <div className='space-y-2'>
          <Label htmlFor='address' className='font-medium text-gray-700'>
            العنوان
          </Label>
          <Textarea
            id='address'
            name='address'
            defaultValue={userData.address || ''}
            placeholder='أدخل عنوانك'
            rows={3}
            className='w-full resize-none'
          />
        </div>
        {/* Google Maps Link */}
        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
          {/* Section Header */}
          <div className='mb-4 flex items-center gap-2'>
            <MapPin className={iconVariants({ size: 'sm', className: 'text-blue-600' })} /> {/* Use direct import + CVA */}
            <h3 className='text-lg font-medium text-gray-800'>الموقع الحالي</h3>
          </div>

          {/* Coordinates Display */}
          <div className='space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              {/* Coordinates Display */}
              <div className='flex items-center gap-3'>
                <div className='rounded-full border border-gray-200 bg-white p-2 shadow-sm'>
                  <Globe className={iconVariants({ size: 'sm', className: 'text-blue-600' })} /> {/* Use direct import + CVA */}
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs font-medium text-gray-500'>الإحداثيات الحالية</span>
                  <div className='font-mono text-sm text-gray-800'>
                    {geoLatitude?.toFixed(7) ?? '--.--'} :خط العرض
                    <span className='mx-2 text-gray-400'>|</span>
                    {geoLongitude?.toFixed(7) ?? '--.--'} :خط الطول
                  </div>
                </div>
              </div>

              {/* Location Button */}
            </div>
            <div className='flex w-full items-center justify-end gap-4 border-t pt-4'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='group flex items-center gap-2 border-blue-600 text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700'
                onClick={() => {
                  (document.getElementById('latitude') as HTMLInputElement).value =
                    geoLatitude?.toString() || '';
                  (document.getElementById('longitude') as HTMLInputElement).value =
                    geoLongitude?.toString() || '';
                }}
                disabled={geoIsLoading || !geoLatitude || !geoLongitude}
              >
                {geoIsLoading ? (
                  <>
                    <Loader2 className={iconVariants({ size: 'xs', animation: 'spin' })} /> {/* Use direct import + CVA */}
                    جاري التحديد...
                  </>
                ) : (
                  <>
                    <MapPin // Use direct import + CVA
                      className={iconVariants({ size: 'xs', className: 'transition-transform group-hover:scale-110' })}
                    />
                    استخدام الموقع الحالي
                  </>
                )}
              </Button>

              {/* Google Maps Link */}
              {geoLatitude && geoLongitude && (
                <div className='border-gray-200'>
                  <a
                    href={getGoogleMapsLink() ?? '#'}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all hover:border-blue-600 hover:shadow-sm'
                  >
                    <span className='text-sm font-medium text-blue-600 hover:text-blue-700'>
                      عرض الموقع على خرائط جوجل
                    </span>
                    <ExternalLink className={iconVariants({ size: 'xs', className: 'text-blue-600' })} /> {/* Use direct import + CVA */}
                  </a>
                </div>
              )}
            </div>
            {/* Error State */}
            {geoError && (
              <div className='mt-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3'>
                <AlertCircle className={iconVariants({ size: 'sm', className: 'flex-shrink-0 text-red-600' })} /> {/* Use direct import + CVA */}
                <div className='flex-1'>
                  <p className='text-sm font-medium text-red-700'>خطأ في تحديد الموقع</p>
                  <p className='text-xs text-red-600'>{geoError}</p>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-red-700 hover:bg-red-100'
                  onClick={getGeolocation}
                >
                  إعادة المحاولة
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Coordinates */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='latitude' className='font-medium text-gray-700'>
              خط العرض
            </Label>
            <Input
              id='latitude'
              name='latitude'
              type='text'
              inputMode='numeric'
              defaultValue={userData.latitude}
              placeholder='أدخل خط العرض'
              className='w-full'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='longitude' className='font-medium text-gray-700'>
              خط الطول
            </Label>
            <Input
              id='longitude'
              name='longitude'
              type='text'
              inputMode='numeric'
              defaultValue={userData.longitude}
              placeholder='أدخل خط الطول'
              className='w-full'
            />
          </div>
        </div>
        {state.message && (
          <div
            className={`mt-4 rounded p-3 ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {state.message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-full rounded-xl bg-blue-600 py-3 text-lg font-semibold transition-transform hover:scale-[1.01] hover:bg-blue-700'
          disabled={ispending}
        >
          حفظ التغييرات
        </Button>
      </div>
    </form>
  );
};

export default UserProfileForm;
