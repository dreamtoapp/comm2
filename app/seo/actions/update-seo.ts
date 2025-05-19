// app/seo/actions/update-seo.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';
import type { SocialMedia, TechnicalSEO, Localization } from '@prisma/client'; // Import Localization
const socialSeoFormDataSubsetSchema = z.object({
  openGraphTitle: z.string().optional().nullable(),
  openGraphDescription: z.string().optional().nullable(),
  openGraphImages: z.any().optional().nullable(), // Prisma Json can be array or object, handle accordingly or refine
  twitterCardType: z.string().optional().nullable(),
  twitterSite: z.string().optional().nullable(),
  twitterCreator: z.string().optional().nullable(),
  twitterTitle: z.string().optional().nullable(),
  twitterDescription: z.string().optional().nullable(),
  twitterImages: z.any().optional().nullable(), // Prisma Json can be array or object
});

export type UpdateSocialSeoResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]> | null;
};

export async function updateSocialSeo(
  prevState: UpdateSocialSeoResult,
  formData: FormData
): Promise<UpdateSocialSeoResult> {
  const entryId = formData.get('entryId') as string;
  if (!entryId) {
    return { success: false, message: 'Entry ID is missing.' };
  }

  const rawFormData: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const actualKey = key.slice(0, -2);
      if (!rawFormData[actualKey]) {
        rawFormData[actualKey] = [];
      }
      (rawFormData[actualKey] as string[]).push(value as string);
    } else {
      rawFormData[key] = value;
    }
  });

  // Remove entryId before validation as it's not part of socialSeoFormDataSubsetSchema
  const { entryId: _, ...socialDataToValidate } = rawFormData;


  const validatedFields = socialSeoFormDataSubsetSchema.safeParse(socialDataToValidate);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  try {
    // Ensure validatedFields.data matches the SocialMedia type structure expected by Prisma
    // Prisma expects the full SocialMedia object for `set`
    const socialMediaDataToSet: SocialMedia = {
      openGraphTitle: validatedFields.data.openGraphTitle || null,
      openGraphDescription: validatedFields.data.openGraphDescription || null,
      // For JSON fields, Prisma expects JsonValue. If openGraphImages is an array of strings,
      // it's fine. If it's an array of objects, that's also fine.
      // Ensure the actual data structure matches what Prisma expects for Json fields.
      openGraphImages: validatedFields.data.openGraphImages || null,
      twitterCardType: validatedFields.data.twitterCardType || null,
      twitterSite: validatedFields.data.twitterSite || null,
      twitterCreator: validatedFields.data.twitterCreator || null,
      twitterTitle: validatedFields.data.twitterTitle || null,
      twitterDescription: validatedFields.data.twitterDescription || null,
      twitterImages: validatedFields.data.twitterImages || null,
    };

    await db.globalSEO.update({
      where: { id: entryId },
      data: {
        socialMedia: {
          set: socialMediaDataToSet, // Use 'set' operation for embedded types
        }
      },
    });
    revalidatePath(`/seo`);
    revalidatePath(`/seo/${entryId}`); // Revalidate the specific view page if it exists
    return { success: true, message: 'Social SEO settings updated successfully.' };
  } catch (error) {
    console.error('Error updating social SEO:', error);
    return { success: false, message: 'Failed to update social SEO settings.' };
  }
}

// Define the schema for technical SEO data subset
const technicalSeoFormDataSubsetSchema = z.object({
  securityHeaders: z.array(z.string()).optional(),
  preloadAssets: z.array(z.string()).optional(),
  httpEquiv: z.array(z.string()).optional(),
});

export type UpdateTechnicalSeoResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]> | null;
};

export async function updateTechnicalSeo(
  prevState: UpdateTechnicalSeoResult,
  formData: FormData
): Promise<UpdateTechnicalSeoResult> {
  const entryId = formData.get('entryId') as string;
  if (!entryId) {
    return { success: false, message: 'Entry ID is missing.' };
  }

  const rawFormData: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const actualKey = key.slice(0, -2);
      if (!rawFormData[actualKey]) {
        rawFormData[actualKey] = [];
      }
      (rawFormData[actualKey] as string[]).push(value as string);
    } else if (key !== 'entryId') { // Exclude entryId from data to validate
      rawFormData[key] = value;
    }
  });

  const validatedFields = technicalSeoFormDataSubsetSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed for Technical SEO.',
    };
  }

  try {
    const technicalSeoDataToSet: TechnicalSEO = {
      securityHeaders: validatedFields.data.securityHeaders || [],
      preloadAssets: validatedFields.data.preloadAssets || [],
      httpEquiv: validatedFields.data.httpEquiv || [],
    };

    await db.globalSEO.update({
      where: { id: entryId },
      data: {
        technicalSEO: {
          set: technicalSeoDataToSet,
        },
      },
    });
    revalidatePath(`/seo`);
    revalidatePath(`/seo/${entryId}`);
    return { success: true, message: 'Technical SEO settings updated successfully.' };
  } catch (error) {
    console.error('Error updating technical SEO:', error);
    return { success: false, message: 'Failed to update technical SEO settings.' };
  }
}

// Define the schema for localization SEO data subset
const localizationSeoFormDataSubsetSchema = z.object({
  defaultLanguage: z.string().optional(),
  supportedLanguages: z.array(z.string()).optional(),
  hreflang: z.any().optional().nullable(), // Assuming hreflang might be JSON stored as a string or actual JSON
});

export type UpdateLocalizationSeoResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]> | null;
};

export async function updateLocalizationSeo(
  prevState: UpdateLocalizationSeoResult,
  formData: FormData
): Promise<UpdateLocalizationSeoResult> {
  const entryId = formData.get('entryId') as string;
  if (!entryId) {
    return { success: false, message: 'Entry ID is missing.' };
  }

  const rawFormData: Record<string, any> = {
    supportedLanguages: [], // Ensure array field is initialized
  };
  formData.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const actualKey = key.slice(0, -2);
      if (!rawFormData[actualKey]) {
        rawFormData[actualKey] = [];
      }
      (rawFormData[actualKey] as string[]).push(value as string);
    } else if (key !== 'entryId') {
      rawFormData[key] = value;
    }
  });

  // Ensure supportedLanguages is an array even if not present in formData
  if (!rawFormData.supportedLanguages) {
    rawFormData.supportedLanguages = [];
  }


  const validatedFields = localizationSeoFormDataSubsetSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed for Localization SEO.',
    };
  }

  try {
    let hreflangData = null;
    if (validatedFields.data.hreflang && typeof validatedFields.data.hreflang === 'string') {
      try {
        hreflangData = JSON.parse(validatedFields.data.hreflang);
      } catch (e) {
        // If parsing fails, keep it as a string or handle error - for now, nullify or keep as is if schema allows
        // For Prisma Json type, it should be valid JSON or null.
        // If it's meant to be a string that looks like JSON, the Prisma schema for hreflang should be String.
        // Assuming Prisma schema for hreflang is Json?
        return { success: false, message: 'Hreflang data is not valid JSON.', errors: { hreflang: ['Invalid JSON format for Hreflang.'] } };
      }
    } else if (validatedFields.data.hreflang) {
      // If it's already an object (e.g., from direct state update not via FormData string)
      hreflangData = validatedFields.data.hreflang;
    }


    const localizationDataToSet: Localization = {
      defaultLanguage: validatedFields.data.defaultLanguage || 'ar-SA', // Default from schema
      supportedLanguages: validatedFields.data.supportedLanguages || ['ar-SA'], // Default from schema
      hreflang: hreflangData,
    };

    await db.globalSEO.update({
      where: { id: entryId },
      data: {
        localization: {
          set: localizationDataToSet,
        },
      },
    });
    revalidatePath(`/seo`);
    revalidatePath(`/seo/${entryId}`);
    return { success: true, message: 'Localization SEO settings updated successfully.' };
  } catch (error) {
    console.error('Error updating localization SEO:', error);
    return { success: false, message: 'Failed to update localization SEO settings.' };
  }
}

// Define the schema for advanced SEO data subset
const advancedSeoFormDataSubsetSchema = z.object({
  schemaOrg: z.any().optional().nullable(), // Assuming schemaOrg might be JSON stored as a string or actual JSON
  industryData: z.any().optional().nullable(), // Assuming industryData might be JSON stored as a string or actual JSON
});

export type UpdateAdvancedSeoResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]> | null;
};

export async function updateAdvancedSeo(
  prevState: UpdateAdvancedSeoResult,
  formData: FormData
): Promise<UpdateAdvancedSeoResult> {
  const entryId = formData.get('entryId') as string;
  if (!entryId) {
    return { success: false, message: 'Entry ID is missing.' };
  }

  const rawFormData: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (key !== 'entryId') { // Exclude entryId from data to validate
      rawFormData[key] = value;
    }
  });

  const validatedFields = advancedSeoFormDataSubsetSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed for Advanced SEO.',
    };
  }

  try {
    let schemaOrgData = null;
    if (validatedFields.data.schemaOrg && typeof validatedFields.data.schemaOrg === 'string') {
      try {
        schemaOrgData = JSON.parse(validatedFields.data.schemaOrg);
      } catch (e) {
        return { success: false, message: 'Schema.org data is not valid JSON.', errors: { schemaOrg: ['Invalid JSON format for Schema.org.'] } };
      }
    } else if (validatedFields.data.schemaOrg) {
      schemaOrgData = validatedFields.data.schemaOrg;
    }

    let industryDataFormatted = null;
    if (validatedFields.data.industryData && typeof validatedFields.data.industryData === 'string') {
      try {
        industryDataFormatted = JSON.parse(validatedFields.data.industryData);
      } catch (e) {
        return { success: false, message: 'Industry-specific data is not valid JSON.', errors: { industryData: ['Invalid JSON format for Industry Data.'] } };
      }
    } else if (validatedFields.data.industryData) {
      industryDataFormatted = validatedFields.data.industryData;
    }

    await db.globalSEO.update({
      where: { id: entryId },
      data: {
        schemaOrg: schemaOrgData,
        industryData: industryDataFormatted,
      },
    });
    revalidatePath(`/seo`);
    revalidatePath(`/seo/${entryId}`);
    return { success: true, message: 'Advanced SEO settings updated successfully.' };
  } catch (error) {
    console.error('Error updating advanced SEO:', error);
    return { success: false, message: 'Failed to update advanced SEO settings.' };
  }
}
