// Server action to fetch all products and their SEO status for each locale
import { db } from '@/lib/db'; // Use your custom db wrapper
import { EntityType } from '@prisma/client';

const LOCALES = ['ar-SA', 'en-US'];

export async function getAllProductsWithSeoStatus() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // For each product, fetch SEO status for each locale
  const results = await Promise.all(
    products.map(async (product: { id: string; name: string }) => {
      const seoStatus: Record<string, { hasMetaTitle: boolean; hasMetaDescription: boolean }> = {};
      for (const locale of LOCALES) {
        const seo = await db.globalSEO.findUnique({
          where: {
            entityId_entityType_locale: {
              entityId: product.id,
              entityType: EntityType.PRODUCT,
              locale,
            },
          },
        });
        seoStatus[locale] = {
          hasMetaTitle: !!seo?.metaTitle,
          hasMetaDescription: !!seo?.metaDescription,
        };
      }
      return { ...product, seoStatus };
    })
  );
  return results;
}
