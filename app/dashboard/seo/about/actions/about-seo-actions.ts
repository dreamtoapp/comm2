// about-seo-actions.ts
"use server";
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';

export async function upsertAboutSeo(data: {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robots?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  twitterCardType?: string;
  twitterImage?: string;
  schemaOrg?: any;
  locale: string;
}) {
  try {
    const entityId = 'aboutpage';
    const entityType = EntityType.PAGE;
    const locale = data.locale;
    const existing = await db.globalSEO.findUnique({
      where: { entityId_entityType_locale: { entityId, entityType, locale } },
    });
    const payload = {
      entityId,
      entityType,
      locale,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      canonicalUrl: data.canonicalUrl || null,
      robots: data.robots || 'index, follow',
      openGraphTitle: data.openGraphTitle || null,
      openGraphDescription: data.openGraphDescription || null,
      openGraphImage: data.openGraphImage || null,
      twitterCardType: data.twitterCardType || null,
      twitterImage: data.twitterImage || null,
      schemaOrg: data.schemaOrg || null,
    };
    if (existing) {
      await db.globalSEO.update({
        where: { entityId_entityType_locale: { entityId, entityType, locale } },
        data: payload,
      });
      return { success: true, updated: true };
    } else {
      await db.globalSEO.create({
        data: payload,
      });
      return { success: true, created: true };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
