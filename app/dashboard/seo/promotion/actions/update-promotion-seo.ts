// Update or create promotion SEO for a given locale
"use server";
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const schema = z.object({
  promotionId: z.string(),
  locale: z.string(),
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  openGraphTitle: z.string().optional(),
  openGraphDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robots: z.string().optional(),
  openGraphImage: z.string().optional(),
  twitterImage: z.string().optional(),
  schemaOrg: z.string().optional(),
  twitterCardType: z.string().optional(),
});

export async function updatePromotionSeo(input: any) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const data = parsed.data;
  const { promotionId, locale, ...seoFields } = data;
  try {
    await db.globalSEO.upsert({
      where: {
        entityId_entityType_locale: {
          entityId: promotionId,
          entityType: EntityType.PROMOTION,
          locale,
        },
      },
      update: seoFields,
      create: {
        entityId: promotionId,
        entityType: EntityType.PROMOTION,
        locale,
        ...seoFields,
      },
    });
    await revalidatePath('/dashboard/seo/promotion');
    await revalidatePath(`/dashboard/seo/promotion/${promotionId}`);
    return { success: true };
  } catch (e: any) {
    console.error('Promotion SEO update error:', e);
    return { success: false, error: e.message || 'Unknown error' };
  }
}
