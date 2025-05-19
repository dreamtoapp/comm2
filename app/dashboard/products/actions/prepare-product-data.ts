'use server';
import { Prisma } from '@prisma/client'; // Import Prisma

import { ImageToCloudinary } from '../../../../lib/cloudinary/uploadImageToCloudinary';

// Define a more specific type for the expected input data
export interface ProductUpdatePayload { // Added export
  name?: string;
  price?: number | string;
  details?: string | null;
  size?: string | null;
  published?: boolean | string;
  outOfStock?: boolean | string;
  imageUrl?: string | File | Blob | null; // For new main image upload

  // Existing specification fields (assuming they can be updated)
  productCode?: string | null;
  brand?: string | null;
  material?: string | null;
  color?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  features?: string; // Comma-separated string from form

  // New SaaS fields
  compareAtPrice?: number | string | null;
  stockQuantity?: number | string | null;
  manageInventory?: boolean | string;
  gtin?: string | null;
  requiresShipping?: boolean | string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags?: string; // Comma-separated string from form
  // categoryIds are typically handled separately in the main update action, not here
}

/**
 * Helper function to prepare product data with optional image handling.
 */
export async function prepareProductData(data: ProductUpdatePayload): Promise<Prisma.ProductUpdateInput> {
  let finalImageUrl: string | undefined | null = undefined; // Use undefined initially

  // Process image only if it's provided and is a File/Blob (new upload) or a non-empty string (existing url - though unlikely needed here)
  if (data.imageUrl && (typeof data.imageUrl === 'string' || data.imageUrl instanceof File || data.imageUrl instanceof Blob)) {
    try {
      const imageUrlData = await ImageToCloudinary(
        data.imageUrl, // Pass the valid type
        process.env.CLOUDINARY_UPLOAD_PRESET_PRODUCTS || '',
      );
      finalImageUrl = imageUrlData.result?.secure_url ?? null; // Use null if upload fails
    } catch (error) {
      console.error("Image upload failed:", error);
      finalImageUrl = null; // Explicitly set to null on error
    }
  }

  // Construct the update input, converting types as needed
  const updateData: Prisma.ProductUpdateInput = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.details !== undefined) updateData.details = data.details;
  if (data.size !== undefined) updateData.size = data.size;
  if (data.published !== undefined) updateData.published = String(data.published) === 'true' || data.published === true;
  if (data.outOfStock !== undefined) updateData.outOfStock = String(data.outOfStock) === 'true' || data.outOfStock === true;
  if (finalImageUrl !== undefined) updateData.imageUrl = finalImageUrl; // Handles new main image

  // Existing specifications
  if (data.productCode !== undefined) updateData.productCode = data.productCode;
  if (data.brand !== undefined) updateData.brand = data.brand;
  if (data.material !== undefined) updateData.material = data.material;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.dimensions !== undefined) updateData.dimensions = data.dimensions;
  if (data.weight !== undefined) updateData.weight = data.weight;
  if (data.features !== undefined) {
    updateData.features = data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : [];
  }

  // New SaaS fields
  if (data.compareAtPrice !== undefined) {
    updateData.compareAtPrice = data.compareAtPrice !== null && data.compareAtPrice !== '' ? Number(data.compareAtPrice) : null;
  }
  if (data.stockQuantity !== undefined) {
    updateData.stockQuantity = data.stockQuantity !== null && data.stockQuantity !== '' ? parseInt(String(data.stockQuantity), 10) : null;
  }
  if (data.manageInventory !== undefined) updateData.manageInventory = String(data.manageInventory) === 'true' || data.manageInventory === true;
  if (data.gtin !== undefined) updateData.gtin = data.gtin;
  if (data.requiresShipping !== undefined) updateData.requiresShipping = String(data.requiresShipping) === 'true' || data.requiresShipping === true;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
  if (data.tags !== undefined) {
    updateData.tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(t => t) : [];
  }

  // Note: Updating categoryAssignments (linking to categories) is more complex
  // and usually handled in the main `updateProduct` action, as it might involve
  // deleting old assignments and creating new ones. This helper focuses on direct Product fields.

  return updateData;
}
