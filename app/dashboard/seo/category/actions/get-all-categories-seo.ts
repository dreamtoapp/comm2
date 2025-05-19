// Server action to get all categories with SEO status
import { db } from '@/lib/db';
import { EntityType } from '@/constant/enums';

export async function getAllCategoriesWithSeoStatus() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      // Add other fields as needed
      globalSEO: true,
    },
    orderBy: { name: 'asc' },
  });

  // Map SEO status per locale
  return categories.map((category) => {
    const seoStatus: Record<string, { hasMetaTitle: boolean; hasMetaDescription: boolean }> = {};
    (category.globalSEO || []).forEach((seo: any) => {
      seoStatus[seo.locale] = {
        hasMetaTitle: !!seo.metaTitle,
        hasMetaDescription: !!seo.metaDescription,
      };
    });
    return { ...category, seoStatus };
  });
}
