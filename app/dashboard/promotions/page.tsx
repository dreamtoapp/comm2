import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

import { getPromotions, PromotionListItem } from './actions/getPromotions'; // Import PromotionListItem
import PromotionsTable from './components/PromotionsTable';
import EmptyBox from '@/components/empty-box';

export default async function PromotionsPage() {
  let promotions: PromotionListItem[] = []; // Explicitly type promotions
  try {
    promotions = await getPromotions();
  } catch (error) {
    console.error("Failed to load promotions for page:", error);
    // Optionally display an error message component here
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            إدارة العروض والخصومات
          </h1>
          <Badge variant="secondary" className="shadow-sm">
            {promotions.length} عرض
          </Badge>
        </div>
        <Button asChild>
          <Link href="/dashboard/promotions/new" className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>إضافة عرض جديد</span>
          </Link>
        </Button>
      </header>

      <main className="flex-1">
        {promotions.length > 0 ? (
          <PromotionsTable promotions={promotions} />
        ) : (
          <EmptyBox
            title="لا توجد عروض أو خصومات مضافة بعد"
            description="ابدأ بإضافة العروض باستخدام الزر أعلاه."
          />
        )}
      </main>
    </div>
  );
}
