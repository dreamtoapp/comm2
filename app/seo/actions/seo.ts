"use server"
import { revalidatePath } from 'next/cache'; // Import revalidatePath
import { z } from 'zod';

import db from '@/lib/prisma';
import {
  EntityType,
  type GlobalSEO,
} from '@prisma/client';

// Placeholder for SEO actions
export async function getAllSeoEntries() {
  try {
    const seoEntries = await db.globalSEO.findMany();
    return seoEntries;
  } catch (error) {
    console.error('Error fetching SEO entries:', error);
    return []; // Return empty array on error
  }
}

export async function getSeoEntryById(id: string) { // New function
  try {
    const seoEntry = await db.globalSEO.findUnique({
      where: { id },
    });
    return seoEntry;
  } catch (error) {
    console.error(`Error fetching SEO entry with ID ${id}:`, error);
    return null; // Return null on error
  }
}

/**
 * Fetch a single SEO entry by business key (entityId + entityType + locale).
 * This is the recommended way for main pages (homepage, about, blog, etc).
 */
export async function getSeoEntryByEntity(entityId: string, entityType: EntityType, locale: string) {
  try {
    const seoEntry = await db.globalSEO.findUnique({
      where: {
        entityId_entityType_locale: {
          entityId,
          entityType,
          locale,
        },
      },
    });
    return seoEntry;
  } catch (error) {
    console.error(`Error fetching SEO entry for entityId=${entityId}, entityType=${entityType}, locale=${locale}:`, error);
    return null;
  }
}

export async function deleteSeoEntry(id: string) { // New function
  try {
    await db.globalSEO.delete({
      where: { id },
    });
    revalidatePath('/seo');
    return { success: true };
  } catch (error) {
    console.error(`Error deleting SEO entry with ID ${id}:`, error);
    return { success: false, errors: { _form: ['Failed to delete SEO entry.'] } };
  }
}

const seoFormDataSchema = z.object({
  entityId: z.string().min(1, { message: 'Entity ID is required' }),
  metaTitle: z.string().min(1, { message: 'Meta title is required' }).max(120, { message: 'Meta title must be less than 120 characters' }),
  metaDescription: z.string().max(320, { message: 'Meta description must be less than 320 characters' }),
  entityType: z.nativeEnum(EntityType),
  locale: z.string().min(2, { message: 'Locale is required' }),
  canonicalUrl: z.string().url().optional(),
  robots: z.string().optional(),
  schemaOrg: z.any().optional(),
});

export type SeoFormData = z.infer<typeof seoFormDataSchema>;

export type ServerActionResult = {
  success: boolean;
  data?: { id: string };
  errors?: Record<string, string[]>;
};

export async function createSeoEntry(data: SeoFormData): Promise<ServerActionResult> {
  try {
    const validatedData = seoFormDataSchema.safeParse(data);

    if (!validatedData.success) {
      const errors: Record<string, string[]> = {};
      validatedData.error.errors.forEach((error) => {
        const field = error.path.join('.');
        errors[field] = errors[field] || [];
        errors[field].push(error.message);
      });
      return { success: false, errors };
    }

    const seoEntry: GlobalSEO = await db.globalSEO.create({
      data: {
        ...validatedData.data,
        // locale is now required and included in validatedData.data
      },
    });

    return { success: true, data: { id: seoEntry.id } };
  } catch (error: any) {
    console.error('Error creating SEO entry:', error);
    return { success: false, errors: { _form: ['Failed to create SEO entry.'] } };
  }
}

export async function updateSeoEntry(id: string, data: Partial<{ metaTitle: string; metaDescription: string; schemaOrg: string }>) {
  try {
    await db.globalSEO.update({
      where: { id },
      data,
    });
    revalidatePath('/dashboard/seo');
    return { success: true };
  } catch (error) {
    console.error('Error updating SEO entry:', error);
    return { success: false, errors: { _form: ['Failed to update SEO entry.'] } };
  }
}
