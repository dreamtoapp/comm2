import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { iconVariants } from '@/lib/utils';

import PromotionForm from './components/PromotionForm';

// Removed getProductsForSelect and SelectableProduct imports as they are no longer needed here

export default async function AddPromotionPage() {
  // productsForSelect is no longer fetched here; ProductSelectorModal fetches its own data

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          إضافة عرض/خصم جديد
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/promotions" className="flex items-center gap-2">
            <ArrowRight className={iconVariants({ size: 'sm' })} />
            <span>العودة إلى قائمة العروض</span>
          </Link>
        </Button>
      </div>
      <PromotionForm /> {/* productsForSelect prop removed */}
    </div>
  );
}
