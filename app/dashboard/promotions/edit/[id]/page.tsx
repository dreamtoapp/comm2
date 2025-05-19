import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import db from '@/lib/prisma';
import PromotionForm from '../../new/components/PromotionForm';

interface EditPromotionPageProps {
  params: Promise<{ id: string }>; // Next.js 15 params are promises
}

async function getPromotionById(id: string) {
  const promotion = await db.promotion.findUnique({
    where: { id },
  });
  if (!promotion) {
    notFound();
  }
  return promotion;
}

export default async function EditPromotionPage({ params: paramsPromise }: EditPromotionPageProps) {
  const params = await paramsPromise;
  const { id } = params;
  const promotion = await getPromotionById(id);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          تعديل العرض: {promotion.title}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/promotions" className="flex items-center gap-2">
            <ArrowRight className={iconVariants({ size: 'sm' })} />
            <span>العودة إلى قائمة العروض</span>
          </Link>
        </Button>
      </div>
      <PromotionForm initialData={promotion} />
    </div>
  );
}
