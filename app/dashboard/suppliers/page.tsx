import EmptyBox from '@/components/empty-box'; // Keep for empty state if table is empty
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // For Add New button
import Link from 'next/link'; // For Add New button link

import { getSuppliers } from './actions/get-supplier';
import SupplierTable from './components/SupplierTable'; // Import new table component
// AddSupplierDialog might be reused or we'll create a new page/form for adding suppliers
// For now, let's assume we'll link to a new page: /dashboard/suppliers/new

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className='flex min-h-screen flex-col p-4 md:p-6'>
      {/* Header */}
      <header className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-bold text-foreground'>إدارة الموردين</h1>
          <Badge variant='secondary' className='shadow-sm'>
            {suppliers.length} مورد
          </Badge>
        </div>
        <Button asChild>
          <Link href="/dashboard/suppliers/new">إضافة مورد جديد</Link>
        </Button>
      </header>

      {/* Main Content */}
      <main className='flex-1'>
        {suppliers.length > 0 ? (
          <SupplierTable suppliers={suppliers} />
        ) : (
          <EmptyBox
            title='لا يوجد موردين مضافين بعد'
            description='ابدأ بإضافة الموردين باستخدام الزر أعلاه.'
          />
        )}
      </main>
    </div>
  );
}
