import { getCustomerReportData } from './action/getCustomerReportData';
import CustomerReportClient from './component/CustomerReportClient';

export default async function CustomersReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const from = sp?.from;
  const to = sp?.to;

  // جلب البيانات من الخادم
  const data = await getCustomerReportData({ from, to });

  return <CustomerReportClient {...data} initialFrom={from} initialTo={to} />;
}
