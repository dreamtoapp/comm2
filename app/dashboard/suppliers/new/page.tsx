import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import AddSupplierForm from './add-supplier-form';

export default async function AddSupplierPage() {
  // Fetch any data needed for the form, e.g., types of suppliers if it's a select field
  // For now, assuming simple input fields

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          إضافة مورد جديد
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/suppliers" className="flex items-center gap-2">
            <ArrowRight className={iconVariants({ size: 'sm' })} />
            <span>العودة إلى قائمة الموردين</span>
          </Link>
        </Button>
      </div>
      <AddSupplierForm />
    </div>
  );
}
