'use server';

import prisma from '@/lib/prisma';

/**
 * Fetches all categories with product counts
 * @returns An array of categories with product counts
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { productAssignments: true },
        },
        translations: {
          where: { languageCode: 'ar-SA' }, // Default to Arabic
          take: 1,
        },
      },
    });

    // Transform the categories to include product count
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.translations[0]?.name || category.name,
      description: category.translations[0]?.description || category.description,
      slug: category.slug,
      imageUrl: category.imageUrl,
      productCount: category._count.productAssignments
    }));

    return transformedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
} 