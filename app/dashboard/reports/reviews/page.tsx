import { getReviewsReportData } from './action/getReviewsReportData';
import ReviewsReportClient from './component/ReviewsReportClient'; // Will create this next
import BackButton from '@/components/BackButton';

export default async function ReviewsReportPage({
  searchParams: searchParamsProp, // Rename to avoid conflict if searchParams is a keyword
}: {
  // The searchParams prop can be a Promise or an object depending on Next.js version and rendering mode.
  // Awaiting it handles both cases.
  searchParams: { from?: string; to?: string } | Promise<{ from?: string; to?: string }>;
}) {
  // Await searchParams if it's a Promise, otherwise use it directly
  const resolvedSearchParams = await searchParamsProp;
  const { from, to } = resolvedSearchParams;

  const data = await getReviewsReportData({ from, to });

  return (
    <div className='rtl mx-auto max-w-7xl px-4 py-10 text-right md:px-6'>
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-3xl font-bold text-foreground'>تقرير التقييمات والمراجعات</h1>
        <BackButton />
      </div>
      <ReviewsReportClient {...data} initialFrom={from} initialTo={to} />
    </div>
  );
}
