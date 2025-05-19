'use server';
import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';

// Helper function to fetch promotions
async function fetchPromotions() {
  try {
    const promotions = await db.promotion.findMany({});

    // Process promotions to ensure valid image URLs
    return promotions.map((promotion) => {
      const fallbackImage = '/fallback/fallback.avif';

      // Check if the image URL exists and is valid
      const hasValidImageUrl =
        promotion.imageUrl &&
        typeof promotion.imageUrl === 'string' &&
        (promotion.imageUrl.startsWith('/') || // Local images
          promotion.imageUrl.startsWith('http')); // Remote images

      return {
        ...promotion,
        // Always return a string for imageUrl
        imageUrl: hasValidImageUrl ? promotion.imageUrl : fallbackImage,
      };
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw new Error('Failed to fetch promotions');
  }
}

export const getPromotions = cacheData(
  fetchPromotions,
  ['getPromotions'], // Cache key
  { revalidate: 3600 }, // Revalidate every 120 seconds
);
