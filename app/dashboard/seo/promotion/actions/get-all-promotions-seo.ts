// Server action to get all promotions with SEO status
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';;

export async function getAllPromotionsWithSeoStatus() {
  const promotions = await db.promotion.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: { id: 'asc' },
  });

  // Fetch all GlobalSEO for promotions in one query
  const seoList = await db.globalSEO.findMany({
    where: {
      entityType: EntityType.PROMOTION,
      entityId: { in: promotions.map((p: any) => p.id) },
    },
  });

  // Map SEO status per locale
  return promotions.map((promotion: any) => {
    const seoStatus: Record<string, { hasMetaTitle: boolean; hasMetaDescription: boolean }> = {};
    seoList.filter(seo => seo.entityId === promotion.id).forEach((seo: any) => {
      seoStatus[seo.locale] = {
        hasMetaTitle: !!seo.metaTitle,
        hasMetaDescription: !!seo.metaDescription,
      };
    });
    return { ...promotion, seoStatus };
  });
}
