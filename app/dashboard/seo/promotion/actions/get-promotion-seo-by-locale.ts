// Server action to get SEO by locale for a promotion
import { db } from '@/lib/db';
import { EntityType } from '@prisma/client';
;

export async function getPromotionSeoByLocale(promotionId: string) {
  const seo = await db.globalSEO.findMany({
    where: {
      entityId: promotionId,
      entityType: EntityType.PROMOTION,
    },
  });
  const seoByLocale: Record<string, any> = {};
  seo.forEach((entry) => {
    seoByLocale[entry.locale] = entry;
  });
  return seoByLocale;
}
