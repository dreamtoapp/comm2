// import { Supplier } from '@prisma/client'; // Removed unused import

export interface Product {
  id: string;
  name: string;
  slug: string; // Add slug field for SEO-friendly URLs
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  details?: string;
  size?: string;
  published: boolean;
  outOfStock: boolean;
  imageUrl: string | null; // Changed to always be string | null for compatibility with CartItem
  images?: string[];
  type: string;
  stockQuantity?: number | null;
  manageInventory?: boolean;

  // Product specifications from schema
  productCode?: string; // Changed from string | null
  gtin?: string;        // Changed from string | null
  brand?: string;       // Changed from string | null
  material?: string;    // Changed from string | null
  color?: string;       // Changed from string | null
  dimensions?: string;  // Changed from string | null
  weight?: string;      // Changed from string | null
  features?: string[];

  // Shipping and return information from schema
  requiresShipping?: boolean;
  shippingDays?: string;    // Changed from string | null
  returnPeriodDays?: number | null;
  hasQualityGuarantee?: boolean;
  careInstructions?: string; // Changed from string | null

  // Organization & SEO from schema
  tags?: string[];
  metaTitle?: string;       // Changed from string | null
  metaDescription?: string; // Changed from string | null

  // Rating and review properties
  rating?: number | null;
  reviewCount?: number | null;

  // Additional properties that might be included from the database
  supplier?: { id: string; name: string; } | null;
  supplierId?: string;
  createdAt: Date;
  updatedAt: Date;
}
