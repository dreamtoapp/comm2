import React from 'react';
import { format } from 'date-fns';
import { FileText, } from 'lucide-react';
import { userStatment } from './action/action';
import EmptyState from '../../../../components/warinig-msg';

interface Order {
  id: string;
  status: string;
  orderNumber: string;
  createdAt: Date;
  amount: number;
}

interface UserStatement {
  id: string;
  phone: string;
  name: string;
  email: string;
  orders: Order[];
}

type OrderStatus = 'delivered' | 'pending' | 'inway' | 'canceled';

async function StatementPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const userId = resolvedSearchParams.id;

  if (!userId) return <EmptyState message='معرّف المستخدم غير صالح' />;

  const statement = (await userStatment(userId)) as UserStatement | null;

  if (!statement?.orders?.length) {
    return <EmptyState message='لا توجد طلبات مرتبطة بهذا المستخدم' />;
  }

  const totalSpent = statement.orders.reduce((sum, order) => sum + order.amount, 0);
  const orderCounts = statement.orders.reduce(
    (acc, order) => {
      acc[order.status.toLowerCase() as OrderStatus] =
        (acc[order.status.toLowerCase() as OrderStatus] || 0) + 1;
      return acc;
    },
    {} as Record<OrderStatus, number>,
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6' dir='rtl'>
      {/* Header Section */}
      <div className='mx-auto mb-6 max-w-6xl md:mb-8'>
        <h1 className='mb-3 text-2xl font-bold text-gray-900 md:mb-4 md:text-3xl'>
          كشف حساب المستخدم
        </h1>
        <div className='flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-4'>
          <p className='text-sm text-gray-600 md:text-base'>
            <span className='font-medium'>{statement?.name}</span>
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className='mx-auto mb-6 grid max-w-6xl grid-cols-1 gap-4 md:mb-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
        <SummaryCard
          title='إجمالي الإنفاق'
          value={`$${totalSpent.toFixed(2)}`}
          icon={<FileText className='h-6 w-6 text-blue-600 md:h-8 md:w-8' />}
        />
        <SummaryCard
          title='عدد الطلبات'
          value={statement.orders.length}
          icon={<FileText className='h-6 w-6 text-green-600 md:h-8 md:w-8' />}
        />
        <div className='space-y-2 rounded-lg bg-white p-4 shadow-md md:space-y-4 md:p-6'>
          <h3 className='text-base font-medium text-gray-800 md:text-lg'>حالة الطلبات</h3>
          {Object.entries(orderCounts).map(([status, count]) => (
            <div key={status} className='flex items-center justify-between'>
              <span className='text-sm capitalize text-gray-600 md:text-base'>{status}</span>
              <span
                className={`font-medium ${getStatusColor(status as OrderStatus)} rounded-full px-2 py-1 text-sm md:px-3 md:text-base`}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className='mx-auto max-w-6xl overflow-hidden rounded-lg bg-white shadow-md'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-3 text-right text-sm md:px-6 md:text-base'>رقم الطلب</th>
                <th className='px-4 py-3 text-right text-sm md:px-6 md:text-base'>التاريخ</th>
                <th className='px-4 py-3 text-right text-sm md:px-6 md:text-base'>المبلغ</th>
                <th className='px-4 py-3 text-right text-sm md:px-6 md:text-base'>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {statement.orders.map((order: Order) => (
                <tr key={order.id} className='border-t transition hover:bg-gray-50'>
                  <td className='px-4 py-3 text-sm font-medium md:px-6 md:text-base'>
                    {order.orderNumber}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-600 md:px-6 md:text-base'>
                    {format(new Date(order.createdAt), 'dd MMM yyyy')}
                  </td>
                  <td className='px-4 py-3 text-sm font-medium text-green-600 md:px-6 md:text-base'>
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className='px-4 py-3 md:px-6'>
                    <span
                      className={`rounded-full px-2 py-1 text-sm md:px-3 md:text-base ${getStatusColor(order.status.toLowerCase() as OrderStatus)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const SummaryCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className='flex items-center gap-3 rounded-lg bg-white p-4 shadow-md md:gap-4 md:p-6'>
    <div className='rounded-lg bg-blue-100 p-2 md:p-3'>{icon}</div>
    <div>
      <h3 className='text-base font-medium text-gray-800 md:text-lg'>{title}</h3>
      <p className='mt-1 text-xl text-gray-900 md:text-2xl'>{value}</p>
    </div>
  </div>
);

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-600';
    case 'pending':
      return 'bg-yellow-100 text-yellow-600';
    case 'inway':
      return 'bg-blue-100 text-blue-600';
    case 'canceled':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default StatementPage;
