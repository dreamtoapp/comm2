import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import db from '@/lib/prisma';
import EditSupplierForm from './edit-supplier-form';

interface EditSupplierPageProps {
  params: { id: string };
}

async function getSupplierById(id: string) {
  const supplier = await db.supplier.findUnique({
    where: { id },
    // Select all fields needed for the form
  });
  if (!supplier) {
    notFound();
  }
  return supplier;
}

export default async function EditSupplierPage({ params: paramsPromise }: EditSupplierPageProps) { // Rename to paramsPromise
  const params = await paramsPromise; // Await the promise
  const { id } = params;
  const supplier = await getSupplierById(id);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          تعديل المورد: {supplier.name}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/suppliers" className="flex items-center gap-2">
            <ArrowRight className={iconVariants({ size: 'sm' })} />
            <span>العودة إلى قائمة الموردين</span>
          </Link>
        </Button>
      </div>
      <EditSupplierForm supplier={supplier} />
    </div>
  );
}
