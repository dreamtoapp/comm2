// app/dashboard/seo/pixels/actions.ts
"use server";
import db from '@/lib/prisma';

export async function getAnalyticsSettings() {
  const settings = await db.analyticsSettings.findFirst({
    where: { singletonKey: 'global_analytics_settings' },
  });
  return settings;
}

export async function upsertAnalyticsSettings(data: {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  tiktokPixelId?: string;
  snapchatPixelId?: string;
  pinterestTagId?: string;
  linkedinInsightTagId?: string;
}) {
  // Remove id and updatedAt from data if present
  const cleanData = { ...data };
  delete (cleanData as any).id;
  delete (cleanData as any).updatedAt;
  delete (cleanData as any).singletonKey;

  const updated = await db.analyticsSettings.upsert({
    where: { singletonKey: 'global_analytics_settings' },
    update: cleanData,
    create: {
      singletonKey: 'global_analytics_settings',
      ...cleanData,
    },
  });
  return updated;
}
