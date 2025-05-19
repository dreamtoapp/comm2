// app/seo/actions/settings-actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';
import type { AnalyticsSettings } from '@prisma/client';

const analyticsSettingsSchema = z.object({
  googleAnalyticsId: z.string().optional().nullable(),
  googleTagManagerId: z.string().optional().nullable(),
  facebookPixelId: z.string().optional().nullable(),
  googleSiteVerificationId: z.string().optional().nullable(),
  bingSiteVerificationId: z.string().optional().nullable(),
  tiktokPixelId: z.string().optional().nullable(), // Added
  snapchatPixelId: z.string().optional().nullable(), // Added
});

export type UpdateAnalyticsSettingsResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]> | null;
  data?: AnalyticsSettings | null;
};

const SINGLETON_KEY = "global_analytics_settings";

export async function getAnalyticsSettings(): Promise<AnalyticsSettings | null> {
  try {
    const settings = await db.analyticsSettings.findUnique({
      where: { singletonKey: SINGLETON_KEY },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching analytics settings:", error);
    return null;
  }
}

export async function updateAnalyticsSettings(
  prevState: UpdateAnalyticsSettingsResult,
  formData: FormData
): Promise<UpdateAnalyticsSettingsResult> {
  const rawFormData: Record<string, any> = {};
  formData.forEach((value, key) => {
    rawFormData[key] = value === '' ? null : value; // Treat empty strings as null for optional fields
  });

  const validatedFields = analyticsSettingsSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed for Analytics Settings.',
    };
  }

  try {
    const settings = await db.analyticsSettings.upsert({
      where: { singletonKey: SINGLETON_KEY },
      update: validatedFields.data,
      create: {
        ...validatedFields.data,
        singletonKey: SINGLETON_KEY, // Ensure singletonKey is set on create
      },
    });
    revalidatePath('/seo/analytics'); // Revalidate the analytics page
    return { success: true, message: 'Analytics settings updated successfully.', data: settings };
  } catch (error) {
    console.error('Error updating analytics settings:', error);
    return { success: false, message: 'Failed to update analytics settings.' };
  }
}
