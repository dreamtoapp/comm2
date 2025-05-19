// home-seo-actions.ts
"use server";
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';

export async function upsertHomeSeo(data: {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robots?: string;
  // Add more fields as needed
}) {
  try {
    const entityId = 'homepage';
    const entityType = EntityType.PAGE;
    // Add locale support (default to 'en' or pass as needed)
    const locale = 'en'; // TODO: Replace with dynamic locale if needed
    const existing = await db.globalSEO.findUnique({
      where: { entityId_entityType_locale: { entityId, entityType, locale } },
    });
    if (existing) {
      await db.globalSEO.update({
        where: { entityId_entityType_locale: { entityId, entityType, locale } },
        data,
      });
      return { success: true, updated: true };
    } else {
      await db.globalSEO.create({
        data: {
          entityId,
          entityType,
          locale,
          ...data,
        },
      });
      return { success: true, created: true };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
