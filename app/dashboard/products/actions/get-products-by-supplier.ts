import db from '../../../../lib/prisma';
import { isValidObjectId } from '../../../../lib/isValidObjectId';

/**
 * جلب جميع المنتجات وتفاصيل المورد لمورد معين.
 */
export async function getProductsBySupplier(supplierId: string) {
  // استخدم الدالة المساعدة للتحقق من صحة معرف المورد
  if (!isValidObjectId(supplierId)) {
    return {
      success: false,
      message: 'معرف المورد غير صالح.',
      data: null,
    };
  }
  try {
    const supplier = await db.supplier.findUnique({
      where: { id: supplierId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        email: true,
        phone: true,
        address: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        // Removed the first, incomplete 'products' select clause
        products: { // Keep only the second, more complete 'products' select clause
          select: { // Select all fields needed for Product type
            id: true,
            name: true,
            slug: true,
            price: true,
            // salePrice: true, // Remove salePrice as it's not in the schema
            details: true,
            size: true,
            published: true,
            outOfStock: true,
            imageUrl: true,
            images: true, // Add images
            type: true,
            rating: true, // Add rating
            reviewCount: true, // Add reviewCount
            supplierId: true, // Add supplierId
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!supplier) {
      return {
        success: false,
        message: 'المورد غير موجود.',
        data: null,
      };
    }

    // Map products to add derived inStock field
    const processedSupplier = {
      ...supplier,
      products: supplier.products.map(p => ({
        ...p,
        inStock: !p.outOfStock, // Derive inStock
        // Note: We don't include the nested 'supplier' object here
        // as the Product type expects the full Supplier object,
        // but Prisma only returns scalar fields in nested selects by default.
        // If the full supplier object is needed *within* each product,
        // the query structure or Product type needs adjustment.
        // For now, we assume the top-level supplier info is sufficient.
      }))
    };

    return {
      success: true,
      data: processedSupplier,
    };
  } catch (e) {
    let errorMessage = 'فشل في جلب بيانات المورد والمنتجات.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error('حدث خطأ أثناء جلب المورد والمنتجات:', errorMessage);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
}
