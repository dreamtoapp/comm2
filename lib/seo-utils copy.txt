import { getSEOData } from '../app/(e-comm)/about/action/SeoData';

export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  robots?: string;
  alternates?: {
    canonical?: string;
  };
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
  other?: {
    schemaOrg?: object;
    hreflang?: object;
  };
}

export async function generatePageMetadata(entityId: string): Promise<PageMetadata> {
  try {
    const seoData = await getSEOData(entityId);

    if (!seoData) return getDefaultMetadata();

    return {
      title: seoData.metaTitle || 'امواج',
      description: seoData.metaDescription || undefined,
      keywords: seoData.keywords?.length ? seoData.keywords : undefined,
      robots: seoData.robots || 'index, follow',
      alternates: {
        canonical: seoData.canonicalUrl ?? undefined,
      },
      openGraph: {
        title: seoData.socialMedia.openGraphTitle || seoData.metaTitle || undefined,
        description: seoData.metaDescription || undefined,
        images: parseImages(seoData.socialMedia.openGraphImages),
        type: 'website',
      },
      twitter: {
        card: seoData.socialMedia.twitterCardType || 'summary_large_image',
        title: seoData.socialMedia.openGraphTitle || seoData.metaTitle || undefined,
        description: seoData.metaDescription || undefined,
        images: parseImages(seoData.socialMedia.twitterImages),
      },
      other: {
        schemaOrg: seoData.schemaOrg ? safeJsonParse(seoData.schemaOrg) : undefined,
        hreflang: seoData.localization.hreflang
          ? safeJsonParse(seoData.localization.hreflang)
          : undefined,
      },
    };
  } catch (error) {
    console.error(`SEO Metadata Error for ${entityId}:`, error);
    return getDefaultMetadata();
  }
}

// Helper functions
const parseImages = (images: unknown): string[] => {
  try {
    if (typeof images === 'string') {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter(isString) : [];
    }
    return Array.isArray(images) ? images.filter(isString) : [];
  } catch {
    return [];
  }
};

const safeJsonParse = (data: unknown): object | undefined => {
  try {
    if (typeof data === 'string') return JSON.parse(data);
    if (typeof data === 'object') return { ...data };
    return undefined;
  } catch {
    return undefined;
  }
};

const isString = (value: unknown): value is string => typeof value === 'string';

const getDefaultMetadata = (): PageMetadata => ({
  title: 'امواج',
  robots: 'index, follow',
  openGraph: {
    title: 'امواج',
    images: [],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'امواج',
    images: [],
  },
});
