// Update or create product SEO for a given locale
"use server";
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const schema = z.object({
  productId: z.string(),
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

export async function updateProductSeo(input: any) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const data = parsed.data;
  const { productId, locale, ...seoFields } = data;
  try {
    await db.globalSEO.upsert({
      where: {
        entityId_entityType_locale: {
          entityId: productId,
          entityType: EntityType.PRODUCT,
          locale,
        },
      },
      update: seoFields,
      create: {
        entityId: productId,
        entityType: EntityType.PRODUCT,
        locale,
        ...seoFields,
      },
    });
    revalidatePath('/dashboard/seo/product');
    revalidatePath(`/dashboard/seo/product/${productId}`);
    return { success: true };
  } catch (e: any) {
    console.error('updateProductSeo error:', e);
    return {
      success: false,
      error: e?.message || e?.toString() || 'Unknown server error while saving SEO data.',
    };
  }
}
