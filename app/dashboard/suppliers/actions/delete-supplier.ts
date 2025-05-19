'use server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/prisma';

export async function deleteSupplier(id: string): Promise<{ success: boolean; message: string }> {
  const productCount = await db.product.count({
    where: { supplierId: id },
  });

  if (productCount > 0) {
    return {
      success: false,
      message:
        'نعتذر، لا يمكن حذف الشركة الحالية نظرًا لارتباطها بمنتجات نشطة. يرجى إزالة كافة المنتجات المرتبطة قبل المحاولة مرة أخرى.',
    };
  }

  // If no related products, proceed with deletion
  await db.supplier.delete({
    where: { id },
  });

  revalidatePath('/dashboard/suppliers');
  revalidatePath('/');
  return {
    success: true,
    message: 'تم حذف بيانات المورد بنجاح من السجلات بشكل نهائي.',
  };
}
