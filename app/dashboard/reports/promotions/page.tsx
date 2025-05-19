import { getPromotionsReportData } from './action/getPromotionsReportData';
import PromotionsReportClient from './component/PromotionsReportClient';
import BackButton from '@/components/BackButton';

export default async function PromotionsReportPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  const { from, to } = searchParams;

  const data = await getPromotionsReportData({ from, to });

  return (
    <div className='rtl mx-auto max-w-7xl px-4 py-10 text-right md:px-6'>
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-3xl font-bold text-foreground'>تقرير العروض الترويجية</h1>
        <BackButton />
      </div>
      <PromotionsReportClient {...data} initialFrom={from} initialTo={to} />
    </div>
  );
}
