'use server'; // Add 'use server' directive

import { revalidatePath } from 'next/cache'; // Import revalidatePath
import { z } from 'zod';

import db from '@/lib/prisma';
// app/seo/actions/createSeoEntry.ts
import {
  EntityType,
  type GlobalSEO,
  IndustryType,
} from '@prisma/client';

const seoFormDataSchema = z.object({
  entityId: z.string().min(1, { message: 'Entity ID is required' }),
  metaTitle: z.string().min(1, { message: 'Meta title is required' }).max(120, { message: 'Meta title must be less than 120 characters' }),
  metaDescription: z.string().max(320, { message: 'Meta description must be less than 320 characters' }),
  entityType: z.nativeEnum(EntityType),
  industryType: z.nativeEnum(IndustryType),
  canonicalUrl: z.string().refine((value) => { // Custom validation for URL
    if (!value) return true; // Allow empty string
    try {
      new URL(value.startsWith('http') ? value : `http://${value}`);
      return true;
    } catch {
      return false;
    }
  }, { message: "Invalid URL" }).optional().or(z.literal('')),
});

export type SeoFormData = z.infer<typeof seoFormDataSchema>;

export type ServerActionResult = {
  success: boolean;
  data?: { id: string } | SeoFormData; // Updated data type
  errors?: Record<string, string[]>;
};

export async function createSeoEntry(prevState: ServerActionResult, formData: FormData): Promise<ServerActionResult> {
  try {
    const data = Object.fromEntries(formData.entries());
    const validatedData = seoFormDataSchema.safeParse(data);

    if (!validatedData.success) {
      const errors: Record<string, string[]> = {};
      validatedData.error.errors.forEach((error) => {
        const field = error.path.join('.');
        errors[field] = errors[field] || [];
        errors[field].push(error.message);
      });
      return { success: false, errors, data: data as SeoFormData }; // Return form data on error
    }

    const seoEntry: GlobalSEO = await db.globalSEO.create({
      data: {
        ...validatedData.data,
        socialMedia: {
          openGraphTitle: '',
          openGraphImages: null,
          twitterCardType: null,
          twitterImages: null,
        },
        technicalSEO: {
          securityHeaders: ["X-Content-Type-Options: nosniff"],
          preloadAssets: [],
          httpEquiv: ["content-language: ar-SA"],
        },
        localization: {
          defaultLanguage: 'ar-SA',
          supportedLanguages: ['ar-SA'],
          hreflang: null,
        },
        // Rely on default values from Prisma schema for other fields
      },
    });

    revalidatePath('/seo'); // Revalidate /seo path
    return { success: true, data: { id: seoEntry.id } };
  } catch (error: any) {
    console.error('Error creating SEO entry:', error);
    return { success: false, errors: { _form: ['Failed to create SEO entry.'] }, data: Object.fromEntries(formData.entries()) as SeoFormData }; // Return form data on error
  }
}
