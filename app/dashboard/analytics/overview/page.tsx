import { getOverallAnalytics } from '../actions/getOverallAnalytics';
import OverallAnalyticsDashboard from './OverallAnalyticsDashboard';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import BackButton from '@/components/BackButton'; // Added import

export default async function Page({ searchParams }: { searchParams?: { from?: string; to?: string } }) {
  const from = searchParams?.from;
  const to = searchParams?.to;

  // Fetch analytics data on the server
  const analyticsData = await getOverallAnalytics(from, to);

  if (!analyticsData) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center" dir="rtl">
        <h1 className="text-2xl font-bold text-primary md:text-3xl mb-6">لوحة تحكم التحليلات العامة</h1>
        <p className="text-destructive">حدث خطأ أثناء تحميل بيانات التحليلات. يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary md:text-3xl text-center flex-grow">
          لوحة تحكم التحليلات العامة
        </h1>
        <BackButton /> {/* Added BackButton */}
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <OverallAnalyticsDashboard initialData={analyticsData} />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
      </div>
      <Skeleton className="h-64 rounded-lg" /> {/* For chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48 rounded-lg" /> {/* For top products table */}
        <Skeleton className="h-48 rounded-lg" /> {/* For low stock table */}
      </div>
    </div>
  );
}
