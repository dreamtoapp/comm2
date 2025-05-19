'use server';
import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';

async function getSuppliersWithProducts() {
  const offerData = await db.supplier.findMany({
    where: { type: 'offer' },
    include: {
      _count: {
        select: {
          products: {
            where: { published: true },
          },
        },
      },
    },
  });

  const companyData = await db.supplier.findMany({
    where: { type: 'company' },
    include: {
      _count: {
        select: {
          products: {
            where: { published: true },
          },
        },
      },
    },
  });

  // Process suppliers to ensure valid image URLs
  const fallbackImage = '/fallback/fallback.avif';

  const processedOfferData = offerData.map((supplier) => {
    // Check if the logo exists and is valid
    const hasValidLogo =
      supplier.logo &&
      typeof supplier.logo === 'string' &&
      (supplier.logo.startsWith('/') || // Local images
        supplier.logo.startsWith('http')); // Remote images

    return {
      ...supplier,
      // Always return a string for logo
      logo: hasValidLogo ? supplier.logo : fallbackImage,
    };
  });

  const processedCompanyData = companyData.map((supplier) => {
    // Check if the logo exists and is valid
    const hasValidLogo =
      supplier.logo &&
      typeof supplier.logo === 'string' &&
      (supplier.logo.startsWith('/') || // Local images
        supplier.logo.startsWith('http')); // Remote images

    return {
      ...supplier,
      // Always return a string for logo
      logo: hasValidLogo ? supplier.logo : fallbackImage,
    };
  });

  return {
    offerData: processedOfferData,
    companyData: processedCompanyData,
  };
}

export const fetchSuppliersWithProducts = cacheData(
  getSuppliersWithProducts,
  ['fetchSuppliersWithProducts'], // Cache key
  { revalidate: 3600 }, // Revalidate every 120 seconds
);
