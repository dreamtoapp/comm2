'use client';

import Link from 'next/link';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import AddProductForm from '@/app/dashboard/products/components/AddProductForm';
import { Button } from '@/components/ui/button';

interface SimpleCategory {
  id: string;
  name: string;
}

interface NewProductPageContentProps {
  categories: SimpleCategory[];
  initialSupplierId?: string;     // Added prop
  initialSupplierName?: string | null; // Added prop
}

export default function NewProductPageContent({
  categories,
  initialSupplierId,    // Destructure new prop
  initialSupplierName   // Destructure new prop
}: NewProductPageContentProps) {
  const router = useRouter();
  // const searchParams = useSearchParams(); // No longer needed if ID is passed as prop
  // const initialSupplierIdFromHook = searchParams.get('supplierId'); // Keep for reference or remove

  const handleSuccess = () => {
    // Navigation removed. User stays on the form.
    // Form reset logic can be added here or in AddProductForm if desired.
    // For now, the form will retain its values, allowing for quick re-submission with minor edits.
    console.log('Product added successfully. Staying on page.');
  };

  return (
    <div className="container mx-auto space-y-6 bg-background p-6 text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="mb-2 text-3xl font-bold">إضافة منتج جديد</h1>
        <Button variant="outline" asChild>
          {/* Link back behavior might need adjustment if supplier context is important */}
          <Link href={initialSupplierId ? `/dashboard/products?supplierId=${initialSupplierId}` : "/dashboard/products-control"}>
            العودة إلى المنتجات
          </Link>
        </Button>
      </div>
      {initialSupplierId && initialSupplierName && (
        <div className="mb-4 p-3 rounded-md bg-primary/10 border border-primary/30 text-primary">
          <p className="text-sm font-medium">
            إضافة منتج للمورد: <span className="font-bold">{initialSupplierName}</span> (ID: {initialSupplierId})
          </p>
          <p className="text-xs">سيتم تحديد هذا المورد تلقائيًا للمنتج الجديد.</p>
        </div>
      )}
      <AddProductForm
        supplierId={initialSupplierId} // Pass the prop directly
        categories={categories}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
