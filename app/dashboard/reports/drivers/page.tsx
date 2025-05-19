import { getDriversReport } from './actions/getDriversReport';
import { DriversReportTable } from './components/DriversReportTable';

export default async function DriversReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const drivers = await getDriversReport();
  const sp = await searchParams;
  const page = sp?.page ? Number(sp.page) : 1;

  return (
    <div className='rtl mx-auto max-w-6xl px-2 py-10 text-right'>
      <h1 className='mb-6 text-3xl font-bold text-primary'>تقرير السائقين والتوصيل</h1>
      <DriversReportTable drivers={drivers} page={page} />
    </div>
  );
}
