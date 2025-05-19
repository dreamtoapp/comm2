'use server';
import { revalidatePath } from 'next/cache';

import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import db from '@/lib/prisma'; // Adjusted path
import { prevState } from '@/types/commonType';
import { Slugify } from '@/utils/slug';
import { Prisma } from '@prisma/client';

export async function updateProduct(_prevState: prevState, formData: FormData): Promise<prevState> {
  const id = formData.get('id') as string;
  if (!id) {
    return { success: false, message: "Product ID is missing." };
  }

  const name = formData.get('name') as string;
  const categoryIds = formData.getAll('categoryIds') as string[];

  // Server-side validation for categories (optional for update, could allow removing all)
  // For now, let's assume if categoryIds is empty, all categories are removed.
  // If a product MUST have a category, this validation should be here:
  // if (!categoryIds || categoryIds.length === 0) {
  //   return { success: false, message: "يجب اختيار صنف واحد على الأقل للمنتج." };
  // }

  const priceString = formData.get('price') as string;
  const price = priceString ? parseFloat(priceString) : undefined; // Price might not be updated

  const size = formData.get('size') as string | null;
  const details = formData.get('details') as string | null;

  const mainImageFile = formData.get('image') as File | null;
  const galleryImageFiles = formData.getAll('galleryImages') as File[];

  // const productCode = formData.get('productCode') as string | null; // Removed from form
  const brand = formData.get('brand') as string | null;
  const material = formData.get('material') as string | null;
  const color = formData.get('color') as string | null;
  const dimensions = formData.get('dimensions') as string | null;
  const weight = formData.get('weight') as string | null;
  const featuresString = formData.get('features') as string | null;

  const publishedString = formData.get('published') as string | null; // Checkboxes might not send value if unchecked
  const published = publishedString === 'on' || formData.get('published') === 'true'; // Handle 'on' or actual boolean string

  const outOfStockString = formData.get('outOfStock') as string | null;
  const outOfStock = outOfStockString === 'on' || formData.get('outOfStock') === 'true';

  const compareAtPriceString = formData.get('compareAtPrice') as string | null;
  const compareAtPrice = compareAtPriceString ? parseFloat(compareAtPriceString) : null;

  const costPriceString = formData.get('costPrice') as string | null;
  const costPrice = costPriceString ? parseFloat(costPriceString) : null;

  const stockQuantityString = formData.get('stockQuantity') as string | null;
  const stockQuantity = stockQuantityString ? parseInt(stockQuantityString, 10) : null;

  const manageInventoryString = formData.get('manageInventory') as string | null;
  const manageInventory = manageInventoryString === 'on' || formData.get('manageInventory') === 'true';

  const requiresShippingString = formData.get('requiresShipping') as string | null;
  const requiresShipping = requiresShippingString === 'on' || formData.get('requiresShipping') === 'true';

  // const gtin = formData.get('gtin') as string | null; // Removed from form

  const updateData: Prisma.ProductUpdateInput = {};

  if (name) {
    updateData.name = name;
    updateData.slug = Slugify(name);
  }
  if (price !== undefined) updateData.price = price;
  if (size !== null) updateData.size = size; // Allow clearing by sending empty string
  if (details !== null) updateData.details = details;

  // Handle main image update
  if (mainImageFile && mainImageFile.size > 0) {
    const mainImageData = await ImageToCloudinary(mainImageFile, process.env.CLOUDINARY_UPLOAD_PRESET_PRODUCTS || '');
    if (mainImageData.result?.secure_url) {
      updateData.imageUrl = mainImageData.result.secure_url;
    } else {
      // Optional: handle upload failure if image was provided but failed
      console.error("Main image upload failed, not updating imageUrl.");
    }
  } else if (formData.has('image') && !mainImageFile) {
    // If 'image' field was present (meaning ImageUpload was rendered) but no file was selected,
    // it could mean user wants to remove the image. This needs careful handling.
    // For now, if no new file, we don't change imageUrl unless explicitly told to remove.
    // To remove: add a hidden input like name="removeMainImage" value="true"
  }

  // Handle gallery images update: Replace strategy
  if (galleryImageFiles.length > 0 && galleryImageFiles.some(f => f.size > 0)) {
    const galleryImageUrls: string[] = [];
    for (const file of galleryImageFiles) {
      if (file && file.size > 0) {
        const galleryImageData = await ImageToCloudinary(file, process.env.CLOUDINARY_UPLOAD_PRESET_PRODUCTS || '');
        if (galleryImageData.result?.secure_url) {
          galleryImageUrls.push(galleryImageData.result.secure_url);
        }
      }
    }
    updateData.images = galleryImageUrls;
  } else if (formData.has('galleryImages') && galleryImageFiles.every(f => f.size === 0)) {
    // If galleryImages field was present but all files are empty (e.g. user cleared selection)
    updateData.images = []; // Set to empty array
  }


  // Optional fields: only update if a value is provided or explicitly cleared
  // For text fields, an empty string from form means clear. For numbers, need to parse.
  // if (productCode !== null) updateData.productCode = productCode === '' ? null : productCode; // Removed
  if (brand !== null) updateData.brand = brand === '' ? null : brand;
  if (material !== null) updateData.material = material === '' ? null : material;
  if (color !== null) updateData.color = color === '' ? null : color;
  if (dimensions !== null) updateData.dimensions = dimensions === '' ? null : dimensions;
  if (weight !== null) updateData.weight = weight === '' ? null : weight;

  if (featuresString !== null) {
    updateData.features = featuresString ? featuresString.split(',').map(feature => feature.trim()).filter(feature => feature) : [];
  }

  updateData.published = published;
  updateData.outOfStock = outOfStock;
  updateData.manageInventory = manageInventory;
  updateData.requiresShipping = requiresShipping;

  if (compareAtPriceString !== null) updateData.compareAtPrice = compareAtPrice; // Handles null if string was empty
  if (costPriceString !== null) updateData.costPrice = costPrice;
  if (stockQuantityString !== null) updateData.stockQuantity = stockQuantity;
  // if (gtin !== null) updateData.gtin = gtin === '' ? null : gtin; // Removed


  try {
    // Transaction for product update and category assignments
    await db.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: updateData,
      });

      // Handle category assignments
      // 1. Get current assignments
      const currentAssignments = await tx.categoryProduct.findMany({
        where: { productId: id },
        select: { categoryId: true },
      });
      const currentCategoryIds = currentAssignments.map(ca => ca.categoryId);

      // 2. Determine categories to add and remove
      const categoryIdsToSet = categoryIds || []; // Ensure it's an array
      const categoriesToAdd = categoryIdsToSet.filter(catId => !currentCategoryIds.includes(catId));
      const categoriesToRemove = currentCategoryIds.filter(catId => !categoryIdsToSet.includes(catId));

      // 3. Remove old assignments
      if (categoriesToRemove.length > 0) {
        await tx.categoryProduct.deleteMany({
          where: {
            productId: id,
            categoryId: { in: categoriesToRemove },
          },
        });
      }

      // 4. Add new assignments
      if (categoriesToAdd.length > 0) {
        await tx.categoryProduct.createMany({
          data: categoriesToAdd.map(catId => ({
            productId: id,
            categoryId: catId,
          })),
        });
      }
      return updatedProduct; // Return value for transaction
    });

    revalidatePath(`/dashboard/products-control`);
    revalidatePath(`/dashboard/products/edit/${id}`);
    revalidatePath('/'); // Revalidate homepage
    // Potentially revalidate specific category pages if needed

    return { success: true, message: 'تم تحديث المنتج بنجاح.' };
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    let userFriendlyMessage = "حدث خطأ غير متوقع أثناء تحديث المنتج. يرجى المحاولة مرة أخرى.";
    if (error instanceof Error) {
      if ((error as any)?.code === 'P2002' && (error as any)?.meta?.target?.includes('slug')) {
        userFriendlyMessage = "منتج آخر بنفس الاسم (أو اسم مشابه ينتج عنه نفس الرابط) موجود بالفعل. يرجى اختيار اسم مختلف.";
      } else if (error.message.includes('Unknown argument')) {
        userFriendlyMessage = "حدثت مشكلة في البيانات المرسلة للمنتج. يرجى التأكد من صحة جميع الحقول. (ملاحظة: عدم تطابق مخطط البيانات).";
      }
    }
    return { success: false, message: userFriendlyMessage };
  }
}
