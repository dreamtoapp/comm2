import { fetchOrders } from '../../orders-management/actions/orders';
// app/dashboard/page.tsx
import { fetchAnalytics } from '../action/fetchAnalytics';
import DashboardHeader from './component/DashboardHeader';
import OrderCardView from './component/OrderCardView';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  // Show all orders when no status is specified
  const statusFilter = resolvedSearchParams.status || undefined;

  // Fetch data in parallel
  const [filteredOrders, analytics] = await Promise.all([
    fetchOrders({
      status: statusFilter, // undefined will fetch all orders
      page: 1,
      pageSize: 10,
    }),
    fetchAnalytics(),
  ]);

  const { totalOrders, pendingOrders, deliveredOrders, inWaydOrders, canceledOrders } = analytics;

  return (
    <div className='font-cairo relative flex flex-col space-y-6 p-4'>
      {/* Header shows "All" when no filter */}
      <DashboardHeader
        initialFilter={statusFilter || 'All'}
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        deliveredOrders={deliveredOrders}
        inWayOrders={inWaydOrders}
        cancelOrders={canceledOrders}
      />

      {/* Order list with proper empty state handling */}
      <OrderCardView initialOrders={filteredOrders ?? []} status={statusFilter} />
    </div>
  );
}
