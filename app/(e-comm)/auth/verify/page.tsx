import React from 'react';

import { auth } from '@/auth';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import OtpForm from './component/OtpForm';

async function page() {
  const seisson = await auth();

  if (!seisson) {
    return (
      <div className='flex items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle className='text-2xl'>يرجى تسجيل الدخول </CardTitle>
            <CardDescription>يجب أن تكون مسجلاً الدخول للوصول إلى هذه الصفحة</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const userData = {
    phone: seisson?.user?.phone,
    email: seisson?.user?.email,
  };

  return <OtpForm phone={userData.phone} email={userData.email || ''} />;
}

export default page;
