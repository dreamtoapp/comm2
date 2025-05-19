'use server';
import { revalidatePath } from 'next/cache';

import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import { prevState } from '@/types/commonType';
import { Slugify } from '@/utils/slug';
import { Prisma } from '@prisma/client'; // Import Prisma namespace

import db from '../../../../lib/prisma';

/**
 * Creates a new product.
 */
export async function createProduct(_prevState: prevState, formData: FormData) {
  const name = formData.get('name') as string;
  const categoryIds = formData.getAll('categoryIds') as string[];

  // Server-side validation for categories
  if (!categoryIds || categoryIds.length === 0) {
    return { success: false, message: "يجب اختيار صنف واحد على الأقل للمنتج." };
  }

  const price = parseFloat(formData.get('price') as string);
  const size = formData.get('size') as string | null;
  const details = formData.get('details') as string | null;
  const mainImageFile = formData.get('image') as File | null; // Main image
  const galleryImageFiles = formData.getAll('galleryImages') as File[]; // Gallery images
  const supplierId = formData.get('supplierId') as string;

  // New specification fields
  // const productCode = formData.get('productCode') as string | null; // Commented out
  const brand = formData.get('brand') as string | null;
  const material = formData.get('material') as string | null;
  const color = formData.get('color') as string | null;
  const dimensions = formData.get('dimensions') as string | null;
  const weight = formData.get('weight') as string | null;
  const featuresString = formData.get('features') as string | null;
  const featuresArray = featuresString ? featuresString.split(',').map(feature => feature.trim()).filter(feature => feature) : [];

  // Get inventory and publishing status
  // FormData returns "on" for checked checkboxes if no value is specified, or null if not checked.
  const published = !!formData.get('published'); // Convert "on" or null to boolean
  const outOfStock = !!formData.get('outOfStock'); // Convert "on" or null to boolean

  // New SaaS fields
  const compareAtPriceString = formData.get('compareAtPrice') as string | null;
  const compareAtPrice = compareAtPriceString ? parseFloat(compareAtPriceString) : null;

  const costPriceString = formData.get('costPrice') as string | null; // Get costPrice
  const costPrice = costPriceString ? parseFloat(costPriceString) : null; // Parse costPrice

  const stockQuantityString = formData.get('stockQuantity') as string | null;
  const stockQuantity = stockQuantityString ? parseInt(stockQuantityString, 10) : null;

  const manageInventory = formData.get('manageInventory') === 'on'; // Checkbox value is "on" or null
  const requiresShipping = formData.get('requiresShipping') === 'on'; // Checkbox value is "on" or null

  // const gtin = formData.get('gtin') as string | null; // Commented out
  // metaTitle, metaDescription, and tags are removed as they will be handled separately
  // const metaTitle = formData.get('metaTitle') as string | null;
  // const metaDescription = formData.get('metaDescription') as string | null;
  // const tagsString = formData.get('tags') as string | null;
  // const tagsArray = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  let mainImageUrl: string | null = null;
  if (mainImageFile && mainImageFile.size > 0) {
    const mainImageData = await ImageToCloudinary(
      mainImageFile,
      process.env.CLOUDINARY_UPLOAD_PRESET_PRODUCTS || '',
    );
    if (mainImageData.result?.secure_url) {
      mainImageUrl = mainImageData.result.secure_url;
    }
  }

  const galleryImageUrls: string[] = [];
  if (galleryImageFiles && galleryImageFiles.length > 0) {
    for (const file of galleryImageFiles) {
      if (file && file.size > 0) { // Ensure file is valid
        const galleryImageData = await ImageToCloudinary(
          file,
          process.env.CLOUDINARY_UPLOAD_PRESET_PRODUCTS || '', // Consider a different preset for gallery if needed
        );
        if (galleryImageData.result?.secure_url) {
          galleryImageUrls.push(galleryImageData.result.secure_url);
        }
      }
    }
  }

  // Temporarily simplified offerData for debugging "Unknown argument compareAtPrice"
  const offerData: Prisma.ProductCreateInput = { // Explicitly type with Prisma.ProductCreateInput
    name: name,
    price: price, // Ensure price is a number
    slug: Slugify(name),
    supplier: { connect: { id: supplierId } },

    // Forcing ONLY fields that have defaults or are relations.
    // All optional scalar fields are removed for this test.
    // This includes compareAtPrice, costPrice, size, details, imageUrl, images, etc.
    // We are testing the absolute bare minimum create.
    // We still need to provide values for fields that are NOT optional AND do NOT have a default value in the schema.
    // 'name', 'price', 'slug', 'supplierId' are covered.
    // 'images' is String[] but has no default in schema - if it's not optional, it needs `images: { set: [] }`
    // Let's assume 'images' is optional or defaults to [] effectively if not provided.
    // Check your schema for any other non-optional fields without defaults.
    // For now, this is the most minimal:
    images: galleryImageUrls.length > 0 ? galleryImageUrls : [], // Ensure images is always an array
    imageUrl: mainImageUrl, // Can be null

    // Explicitly setting other potentially problematic optional fields to undefined if not provided,
    // or their derived values if they are.
    size: size || undefined,
    details: details || undefined,
    productCode: null, // Set to null as it's removed from form
    brand: brand || undefined,
    material: material || undefined,
    color: color || undefined,
    dimensions: dimensions || undefined,
    weight: weight || undefined,
    features: featuresArray.length > 0 ? featuresArray : [],
    published: published,
    outOfStock: outOfStock,
    compareAtPrice: compareAtPrice === null ? undefined : compareAtPrice,
    costPrice: costPrice === null ? undefined : costPrice,
    stockQuantity: stockQuantity === null ? undefined : stockQuantity,
    manageInventory: manageInventory,
    gtin: null, // Set to null as it's removed from form
    requiresShipping: requiresShipping,
  };
  console.log("DEBUG: Full offerData (Restored, no SKU/GTIN from form):", JSON.stringify(offerData, null, 2));

  try {
    const newProduct = await db.product.create({ data: offerData });

    // Link product to categories if categoryIds are provided
    if (categoryIds && categoryIds.length > 0) {
      await db.categoryProduct.createMany({
        data: categoryIds.map(categoryId => ({
          productId: newProduct.id,
          categoryId: categoryId,
        })),
        // skipDuplicates: true, // Not supported by MongoDB, unique index handles this
      });
    }

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/products-control'); // Assuming this path exists or is intended
    revalidatePath('/');
    // Revalidate category pages if product counts are shown there or if products are listed on them
    if (categoryIds && categoryIds.length > 0) {
      const categoriesToRevalidate = await db.category.findMany({
        where: { id: { in: categoryIds } },
        select: { slug: true } // Re-asserting this line
      });
      categoriesToRevalidate.forEach(cat => {
        revalidatePath(`/dashboard/categories/view/${cat.slug}`); // Admin view
        // revalidatePath(`/categories/${cat.slug}`); // Public view if it exists at this path
      });
    }

    return { success: true, message: 'Product created successfully' };
  } catch (error: unknown) { // It's good practice to type error as unknown first
    console.error('Error creating product:', error); // Keep detailed log for server
    let userFriendlyMessage = "حدث خطأ غير متوقع أثناء إنشاء المنتج. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.";

    if (error instanceof Error) {
      // Check for Prisma unique constraint violation (P2002)
      if ((error as any)?.code === 'P2002') {
        const target = (error as any)?.meta?.target;
        if (target && Array.isArray(target) && target.includes('slug')) {
          userFriendlyMessage = "يبدو أن هناك منتجًا آخر بنفس الاسم (أو اسم مشابه ينتج عنه نفس الرابط). يرجى اختيار اسم مختلف للمنتج.";
        } else {
          userFriendlyMessage = "يتعارض هذا المنتج مع منتج موجود بسبب حقل فريد (مثل رمز SKU أو الباركود إذا كان فريدًا). يرجى التحقق من البيانات المدخلة.";
        }
      } else if (error.message.includes('Unknown argument')) {
        // Specific check for "Unknown argument" which often points to schema/client mismatch
        userFriendlyMessage = "حدثت مشكلة في البيانات المرسلة للمنتج. يرجى التأكد من صحة جميع الحقول. إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني (ملاحظة: عدم تطابق مخطط البيانات).";
      }
      // For other types of errors, the generic Arabic message will be used.
    }
    // Return a user-friendly message
    return { success: false, message: userFriendlyMessage };
  }
}
