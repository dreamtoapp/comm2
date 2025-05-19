import Link from '@/components/link';

import { ArrowRight } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
import ClientAnalyticsDashboard from './ClientAnalyticsDashboard';
import { getProductAnalytics } from './getAnalytics';
import ProductNotFound from './ProductNotFound';
// Removed Icon import: import { Icon } from '@/components/icons';

function isValidObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export default async function ProductAnalyticsPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ id: string }>; // Type remains Promise
  searchParams?: Promise<{ from?: string; to?: string; chartType?: string }>; // Type remains Promise
}) {
  const params = await paramsPromise; // Await params
  const { id } = params;

  if (!isValidObjectId(id)) {
    return <ProductNotFound />;
  }

  const resolvedSearchParams = searchParamsPromise ? await searchParamsPromise : {}; // Await searchParams
  const { from, to, chartType } = resolvedSearchParams;

  const analytics = await getProductAnalytics(id, from, to);
  if (!analytics?.product) {
    return <ProductNotFound />;
  }

  return (
    <div className='container mx-auto py-8' dir='rtl'>
      <div className='mb-4'>
        <Link
          href='/dashboard/products-control'
          className='inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1 font-medium text-muted-foreground shadow-sm transition hover:text-primary hover:bg-muted' // Changed bg-white to bg-card, border-muted to border-border, added hover:bg-muted
        >
          <ArrowRight className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
          <span>رجوع للمنتجات</span>
        </Link>
      </div>
      <ClientAnalyticsDashboard
        analytics={analytics}
        id={id}
        initialChartType={chartType || 'bar'}
        initialFrom={from || ''}
        initialTo={to || ''}
      />
    </div>
  );
}
