'use client'; // Will become client component if we add client-side pagination/sorting later

import Image from 'next/image';
import { Supplier } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import SupplierTableClientActions from './SupplierTableClientActions'; // Uncomment and import

// Define a more specific type for the props, including productCount
interface SupplierWithProductCount extends Omit<Supplier, '_count'> {
  productCount: number;
}

interface SupplierTableProps {
  suppliers: SupplierWithProductCount[];
  // onDeleted?: (supplierId: string) => void; // For client-side refresh after delete
}

export default function SupplierTable({ suppliers }: SupplierTableProps) {
  if (!suppliers || suppliers.length === 0) {
    return (
      <div className='flex min-h-[200px] items-center justify-center text-muted-foreground'>
        لا توجد شركات/موردين لعرضهم.
      </div>
    );
  }

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className='w-full rounded-lg border bg-card shadow-sm'>
      <table className='rtl w-full text-right text-sm table-auto'>
        <thead className='bg-accent text-accent-foreground'>
          <tr>
            <th className='px-4 py-3'>الشعار</th>
            <th className='px-4 py-3'>الاسم</th>
            <th className='px-4 py-3'>البريد الإلكتروني</th>
            <th className='px-4 py-3'>الهاتف</th>
            <th className='px-4 py-3'>النوع</th>
            <th className='px-4 py-3 text-center'>عدد المنتجات</th>
            <th className='px-4 py-3'>تاريخ الإضافة</th>
            <th className='px-4 py-3 text-center'>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className='px-4 py-2'>
                {supplier.logo ? (
                  <Image
                    src={supplier.logo}
                    alt={supplier.name}
                    width={40}
                    height={40}
                    className='h-10 w-10 rounded-full object-cover'
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
              </td>
              <td className='px-4 py-2 font-medium'>
                <span title={supplier.name} className="block max-w-[200px] line-clamp-2">{supplier.name}</span>
              </td>
              <td className='px-4 py-2'>
                <span title={supplier.email} className="block max-w-[200px] line-clamp-1">{supplier.email || '-'}</span>
              </td>
              <td className='px-4 py-2 whitespace-nowrap'>{supplier.phone || '-'}</td>
              <td className='px-4 py-2'>
                <Badge variant={supplier.type === 'company' ? 'default' : 'secondary'}>{supplier.type || 'غير محدد'}</Badge>
              </td>
              <td className='px-4 py-2 text-center font-medium'>{supplier.productCount}</td>
              <td className='px-4 py-2 whitespace-nowrap'>{formatDate(supplier.createdAt)}</td>
              <td className='px-4 py-2 text-center'>
                <SupplierTableClientActions supplierId={supplier.id} supplierName={supplier.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
