'use server'

import { revalidatePath } from 'next/cache';

import { uploadImageToCloudinary } from '@/lib/cloudinary'; // Added import
import prisma from '@/lib/prisma';

// Types
interface CategoryCreateInput {
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  // parentId removed for single-level system
}

interface CategoryUpdateInput {
  name?: string
  slug?: string
  description?: string | null
  imageUrl?: string | null
  // parentId removed for single-level system
}

/**
 * Creates a new category.
 * @param data - The data for the new category.
 * @returns An object with success status and the created category or an error message.
 */
export async function createCategory(data: CategoryCreateInput) {
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        // parentId removed
      },
    })
    revalidatePath('/dashboard/categories') // Admin categories list
    revalidatePath(`/categories/${newCategory.slug}`) // Public category page
    revalidatePath('/') // Homepage or any global category listings
    return { success: true, category: newCategory }
  } catch (error: unknown) {
    let errorMessage = 'Failed to create category. Please check server logs.';
    if (error instanceof Error && 'code' in error && 'meta' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } };
      if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('slug')) {
        errorMessage = 'A category with this slug already exists.';
      } else if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('name')) {
        errorMessage = 'A category with this name already exists.';
      } else {
        console.error('Error creating category:', error);
      }
    } else {
      console.error('Error creating category:', error);
    }
    return { success: false, error: errorMessage };
  }
}

/**
 * Fetches all categories, including counts for children and product assignments.
 * @returns An object with success status and the list of categories or an error message.
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          // children count removed as children relation is removed
          select: { productAssignments: true },
        },
        // parent relation removed
      },
    })
    return { success: true, categories }
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Failed to fetch categories.' };
  }
}

/**
 * Fetches a single category by its ID, including parent, children, and product assignments.
 * @param id - The ID of the category to fetch.
 * @returns An object with success status and the category data or an error message.
 */
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        // parent and children relations removed
        productAssignments: {
          select: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } }
          },
          take: 10, // Limit initial product list for performance
        },
        _count: {
          // children count removed
          select: { productAssignments: true },
        },
      },
    })
    if (!category) {
      return { success: false, error: 'Category not found.' }
    }
    return { success: true, category }
  } catch (error: unknown) {
    console.error('Error fetching category by ID:', error);
    return { success: false, error: 'Failed to fetch category.' };
  }
}

/**
 * Fetches a single category by its slug, including parent, children, and assigned products.
 * @param slug - The slug of the category to fetch.
 * @returns An object with success status and the category data or an error message.
 */
export async function getCategoryBySlug(slug: string) {
  console.log(`[getCategoryBySlug] Received slug: "${slug}" (length: ${slug.length})`);
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        // parent and children relations removed
        productAssignments: {
          include: {
            product: true, // Fetch full product details for category pages
          },
        },
        // _count for children is not applicable anymore
      },
    })
    if (!category) {
      console.log(`[getCategoryBySlug] Category not found for slug: "${slug}"`);
      return { success: false, error: 'Category not found.' }
    }
    console.log(`[getCategoryBySlug] Found category: ${category.name} (ID: ${category.id}) for slug: "${slug}"`);
    return { success: true, category }
  } catch (error: unknown) {
    console.error(`[getCategoryBySlug] Error fetching category by slug "${slug}":`, error);
    return { success: false, error: 'Failed to fetch category.' };
  }
}

/**
 * Updates an existing category.
 * @param id - The ID of the category to update.
 * @param data - The data to update the category with.
 * @returns An object with success status and the updated category or an error message.
 */
export async function updateCategory(id: string, data: CategoryUpdateInput) {
  try {
    const categoryToUpdate = await prisma.category.findUnique({ where: { id } });
    if (!categoryToUpdate) {
      return { success: false, error: 'Category not found.' };
    }

    // The check "if (data.parentId === id)" is removed as parentId is no longer part of CategoryUpdateInput.

    // Construct a complete data object for the update.
    // parentId is no longer part of the update data from the form.
    // Prisma will not attempt to update parentId if it's not in the data payload.
    const updatePayload: {
      name?: string;
      slug?: string;
      description?: string | null;
      imageUrl?: string | null;
    } = {};

    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.slug !== undefined) updatePayload.slug = data.slug;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.imageUrl !== undefined) updatePayload.imageUrl = data.imageUrl;

    // Ensure name and slug are not null if they are being updated to new values.
    // This check is more for logical integrity, TS should catch type issues.
    // This specific check might be redundant if Zod/form validation handles it.
    // if (updatePayload.name === null || updatePayload.slug === null) {
    //   console.error("Critical error: name or slug became null before update.", updatePayload);
    //   return { success: false, error: "Internal error: Name or slug cannot be null." };
    // }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updatePayload, // Pass only the fields that might have changed
    });
    revalidatePath('/dashboard/categories')
    revalidatePath(`/dashboard/categories/edit/${id}`)
    revalidatePath(`/categories/${updatedCategory.slug}`)
    if (categoryToUpdate.slug !== updatedCategory.slug) {
      revalidatePath(`/categories/${categoryToUpdate.slug}`)
    }
    revalidatePath('/')
    return { success: true, category: updatedCategory }
  } catch (error: unknown) {
    let errorMessage = 'Failed to update category. Please check server logs.';
    if (error instanceof Error && 'code' in error && 'meta' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } };
      if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('slug')) {
        errorMessage = 'A category with this slug already exists.';
      } else if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('name')) {
        errorMessage = 'A category with this name already exists.';
      } else {
        console.error('Error updating category:', error);
      }
    } else {
      console.error('Error updating category:', error);
    }
    return { success: false, error: errorMessage };
  }
}

/**
 * Deletes a category.
 * @param id - The ID of the category to delete.
 * @returns An object with success status or an error message.
 */
export async function deleteCategory(id: string) {
  try {
    // No need to include children as the relation is removed.
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return { success: false, error: 'Category not found.' }
    }

    // The check for children is no longer needed.
    // if (category.children && category.children.length > 0) {
    //   return {
    //     success: false,
    //     error: 'لا يمكن حذف الصنف لأنه يحتوي على أصناف فرعية. يرجى أولاً تعديل الأصناف الفرعية (مثلاً، بنقلها أو حذفها).',
    //   }
    // }

    const deletedCategory = await prisma.category.delete({ where: { id } })
    revalidatePath('/dashboard/categories')
    revalidatePath(`/categories/${deletedCategory.slug}`) // In case it was accessible
    revalidatePath('/')
    return { success: true, category: deletedCategory }
  } catch (error: unknown) {
    let errorMessage = 'فشل حذف الصنف. يرجى مراجعة سجلات الخادم.';
    if (error instanceof Error && 'code' in error && 'meta' in error) {
      const prismaError = error as { code: string; meta?: { field_name?: string } };
      // P2003 on parentId often means it's a parent to other categories (children foreign key constraint)
      // P2014 means a required relation would be violated (less common for simple parent/child via parentId)
      if (prismaError.code === 'P2003' && prismaError.meta?.field_name?.includes('parentId')) {
        errorMessage = 'لا يمكن حذف هذا الصنف لأنه أب لأصناف أخرى. يرجى معالجة الأصناف الفرعية أولاً.';
      } else if (prismaError.code === 'P2014') { // More generic relation constraint
        errorMessage = 'لا يمكن حذف هذا الصنف بسبب وجود ارتباطات قائمة. يرجى إزالة هذه الارتباطات أولاً.';
      } else {
        console.error('Error deleting category:', error);
      }
    } else {
      console.error('Error deleting category:', error);
    }
    return { success: false, error: errorMessage };
  }
}

/**
 * Assigns a product to a category.
 * @param productId - The ID of the product.
 * @param categoryId - The ID of the category.
 * @returns An object with success status and the assignment or an error message.
 */
export async function assignProductToCategory(productId: string, categoryId: string) {
  try {
    const assignment = await prisma.categoryProduct.create({
      data: { productId, categoryId },
    })
    revalidatePath(`/dashboard/products/edit/${productId}`)
    revalidatePath(`/dashboard/categories/edit/${categoryId}`)
    // Potentially revalidate specific product and category pages
    // revalidatePath(`/products/${productSlug}`)
    // revalidatePath(`/categories/${categorySlug}`)
    return { success: true, assignment }
  } catch (error: unknown) {
    let errorMessage = 'فشل ربط المنتج بالصنف.';
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2002') {
        errorMessage = 'المنتج مرتبط بالفعل بهذا الصنف.';
      } else {
        console.error('Error assigning product to category:', error);
      }
    } else {
      console.error('Error assigning product to category:', error);
    }
    return { success: false, error: errorMessage };
  }
}

/**
 * Removes a product from a category.
 * @param productId - The ID of the product.
 * @param categoryId - The ID of the category.
 * @returns An object with success status or an error message.
 */
export async function removeProductFromCategory(productId: string, categoryId: string) {
  try {
    await prisma.categoryProduct.delete({
      where: {
        categoryId_productId: { categoryId, productId },
      },
    })
    revalidatePath(`/dashboard/products/edit/${productId}`)
    revalidatePath(`/dashboard/categories/edit/${categoryId}`)
    return { success: true }
  } catch (error: unknown) {
    let errorMessage = 'فشل إزالة ربط المنتج من الصنف.';
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2025') {
        errorMessage = 'ربط المنتج بالصنف غير موجود.';
      } else {
        console.error('Error removing product from category:', error);
      }
    } else {
      console.error('Error removing product from category:', error);
    }
    return { success: false, error: errorMessage };
  }
}

/**
 * Fetches products for a given category ID with pagination.
 * @param categoryId - The ID of the category.
 * @param page - The current page number (default: 1).
 * @param pageSize - The number of products per page (default: 10).
 * @returns An object with success status, products, and pagination details or an error message.
 */
export async function getProductsByCategoryId(categoryId: string, page = 1, pageSize = 10) {
  try {
    const skip = (page - 1) * pageSize
    const [rawProducts, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          categoryAssignments: { some: { categoryId } },
          published: true,
        },
        include: {
          supplier: true, // Include the full supplier object
          reviews: { take: 5, orderBy: { createdAt: 'desc' } },
          _count: { select: { reviews: true } },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({
        where: {
          categoryAssignments: { some: { categoryId } },
          published: true,
        },
      }),
    ]);

    const products = rawProducts.map(product => ({
      ...product,
      inStock: !product.outOfStock,
    }));

    return {
      success: true,
      products,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      totalProducts,
    }
  } catch (error) {
    console.error('Error fetching products by category ID:', error)
    return { success: false, error: 'Failed to fetch products for this category.' };
  }
}

/**
 * Fetches products for a given category slug with pagination.
 * @param categorySlug - The slug of the category.
 * @param page - The current page number (default: 1).
 * @param pageSize - The number of products per page (default: 10).
 * @returns An object with success status, category details, products, and pagination details or an error message.
 */
export async function getProductsByCategorySlug(categorySlug: string, page = 1, pageSize = 10) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      // parentId and parent relation removed from select
      select: { id: true, name: true, description: true, imageUrl: true },
    });

    if (!category) {
      return { success: false, error: 'Category not found.' };
    }

    const skip = (page - 1) * pageSize;
    const [rawProducts, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          categoryAssignments: { some: { categoryId: category.id } },
          published: true,
        },
        include: {
          supplier: true, // Include the full supplier object
          reviews: { take: 5, orderBy: { createdAt: 'desc' } },
          _count: { select: { reviews: true } },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({
        where: {
          categoryAssignments: { some: { categoryId: category.id } },
          published: true,
        },
      }),
    ]);

    const products = rawProducts.map(product => ({
      ...product,
      inStock: !product.outOfStock,
    }));

    return {
      success: true,
      category,
      products,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      totalProducts,
    };
  } catch (error) {
    console.error('Error fetching products by category slug:', error);
    return { success: false, error: 'Failed to fetch products for this category.' };
  }
}

/**
 * Fetches all categories and organizes them into a hierarchical structure.
 * @returns An object with success status and the hierarchical list of categories or an error message.
 */
// This function is obsolete for a single-level category system and will be removed.
// export async function getCategoryHierarchy() { ... }

/**
 * Server action to upload an image to Cloudinary.
 * @param formData - FormData containing the file to upload.
 * @param presetName - The Cloudinary upload preset name.
 * @returns An object with the secure_url or an error message.
 */
export async function handleImageUploadToServer(formData: FormData, presetName: string): Promise<{ secure_url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file found in form data.' };
    }
    // uploadImageToCloudinary is imported from '@/lib/cloudinary'
    // presetName will be passed from the CategoryForm, e.g., 'amwag_assets'
    const result = await uploadImageToCloudinary(file, presetName);
    return { secure_url: result.secure_url };
  } catch (error: unknown) {
    console.error('Error in handleImageUploadToServer:', error);
    if (error instanceof Error) {
      return { error: error.message }; // Keep original error message if specific
    }
    return { error: 'فشل تحميل الصورة بسبب خطأ غير معروف.' };
  }
}
