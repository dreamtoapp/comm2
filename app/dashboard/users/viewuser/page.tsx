import React from 'react';

import { format } from 'date-fns';

import uniqeId from '@/utils/uniqeId';

import { userData } from '../action/actions';

async function page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const USERID = resolvedSearchParams.id;
  const user = await userData(USERID as string);

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <h1 className='mb-10 text-center text-3xl font-extrabold text-green-600'>
        تفاصيل وحركة المستخدم
      </h1>
      <div className='mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg'>
        {user ? (
          <>
            <div className='mb-8'>
              <p className='mb-4 text-lg'>
                <strong className='text-gray-700'>الاسم:</strong>{' '}
                <span className='text-gray-900'>{user.name}</span>
              </p>
              <p className='mb-4 text-lg'>
                <strong className='text-gray-700'>البريد الإلكتروني:</strong>{' '}
                <span className='text-gray-900'>{user.email}</span>
              </p>
              <p className='mb-4 text-lg'>
                <strong className='text-gray-700'>الهاتف:</strong>{' '}
                <span className='text-gray-900'>{user.phone}</span>
              </p>
              <p className='mb-4 text-lg'>
                <strong className='text-gray-700'>العنوان:</strong>{' '}
                <span className='text-gray-900'>{user.address}</span>
              </p>
            </div>
            <h2 className='mt-10 border-b-2 border-blue-600 pb-2 text-xl font-semibold text-blue-600'>
              الطلبات
            </h2>
            <p className='mt-4 text-lg text-gray-800'>
              <strong>عدد الطلبات:</strong> {user.orders ? user.orders.length : 0}
            </p>
            {user.orders && user.orders.length > 0 ? (
              <ul className='mt-6 list-none space-y-6'>
                {user.orders.map((order, index) => (
                  <div key={index} className='rounded-lg bg-gray-50 p-5 shadow-md'>
                    <li className='mb-4'>
                      <p className='mb-2 rounded-lg bg-primary p-2 text-lg text-primary-foreground'>
                        <strong>حالة الطلب:</strong> <span>{order.status}</span>
                      </p>
                      <p className='mb-2 text-lg'>
                        <strong className='text-gray-700'>رقم الطلب:</strong>{' '}
                        <span className='text-gray-900'>{order.id}</span>
                      </p>
                      <p className='mb-2 text-lg'>
                        <strong className='text-gray-700'>التاريخ:</strong>{' '}
                        <span className='text-gray-900'>
                          {format(new Date(order.createdAt), 'yyyy-MM-dd')}
                        </span>
                      </p>
                      <p className='mb-2 text-lg'>
                        <strong className='text-gray-700'>المبلغ:</strong>{' '}
                        <span className='text-gray-900'>{order.amount.toFixed(2)}</span>
                      </p>
                    </li>
                    {order.items && order.items.length > 0 && (
                      <div className='mt-4 flex w-full flex-col items-center gap-2'>
                        {order.items.map((item) => (
                          <div
                            key={uniqeId()}
                            className='flex w-full items-center justify-between rounded-lg border border-gray-200 bg-secondary p-2 shadow-sm'
                          >
                            <p className='text-lg font-medium text-gray-800'>
                              <strong className='text-gray-700'>المنتج:</strong> {item?.product?.name}
                            </p>
                            <p className='text-lg text-gray-600'>
                              <strong className='text-gray-700'>الكمية:</strong> {item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            ) : (
              <p className='mt-6 text-lg text-gray-500'>لا توجد طلبات متوفرة.</p>
            )}
          </>
        ) : (
          <p className='text-center text-lg text-gray-500'>بيانات المستخدم غير متوفرة.</p>
        )}
      </div>
    </div>
  );
}

export default page;
