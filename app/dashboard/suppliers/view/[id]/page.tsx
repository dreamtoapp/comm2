import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import db from '@/lib/prisma';
import SupplierViewContent from './supplier-view-content';

type Params = Promise<{ id: string }>;

async function getFullSupplierDetails(id: string) {
  const supplier = await db.supplier.findUnique({
    where: { id },
    include: {
      products: { // Include a count or a small sample of products
        select: { id: true, name: true, imageUrl: true },
        take: 5, // Example: show first 5 products
      },
      _count: {
        select: { products: true },
      },
      // translations can be added if needed for display
    },
  });
  if (!supplier) {
    notFound();
  }
  return supplier;
}

export default async function ViewSupplierPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supplier = await getFullSupplierDetails(id);

  // Augment supplier with productCount if not directly on the fetched object
  const supplierForView = {
    ...supplier,
    productCount: supplier._count?.products ?? 0,
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          تفاصيل المورد: {supplier.name}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/suppliers" className="flex items-center gap-2">
            <ArrowRight className={iconVariants({ size: 'sm' })} />
            <span>العودة إلى قائمة الموردين</span>
          </Link>
        </Button>
      </div>
      <SupplierViewContent supplier={supplierForView} />
    </div>
  );
}
