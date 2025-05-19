import React from 'react';

import { getOrderAnalytics } from './actions/get-order-analytics';
import OrderAnalyticsDashboard from './components/OrderAnalyticsDashboard';

export default async function OrdersManagementPage() {
  // Fetch the analytics data from the server
  const analyticsData = await getOrderAnalytics();

  console.log(analyticsData)
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">تحليل الطلبات</h1>
      <OrderAnalyticsDashboard analyticsData={analyticsData} />
    </div>
  );
};

