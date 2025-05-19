'use server';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary'; // Assuming this handles delete too if needed
import db from '@/lib/prisma';
import { Slugify } from '@/utils/slug';

interface PrevState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
}

export async function updateSupplier(prevState: PrevState, formData: FormData): Promise<PrevState> {
  const id = formData.get('id') as string;
  if (!id) {
    return { success: false, message: "معرف المورد مفقود." };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string | null;
  const phone = formData.get('phone') as string | null;
  const address = formData.get('address') as string | null;
  const type = formData.get('type') as string | null;
  const logoFile = formData.get('logo') as File | null;
  const removeLogo = formData.get('removeLogo') === 'true';

  if (!name) {
    return { success: false, message: "اسم المورد مطلوب.", errors: { name: ["الاسم مطلوب"] } };
  }

  const updateData: Prisma.SupplierUpdateInput = {
    name,
    slug: Slugify(name),
    email: email ?? undefined, // Use undefined if null to avoid setting empty string if not intended
    phone: phone ?? undefined,
    address: address ?? undefined,
    type: type ?? undefined,
  };

  if (removeLogo) {
    updateData.logo = null;
    // TODO: Optionally delete old logo from Cloudinary here if supplier.logo existed
  } else if (logoFile && logoFile.size > 0) {
    try {
      // TODO: Optionally delete old logo from Cloudinary before uploading new one
      const logoData = await ImageToCloudinary(
        logoFile,
        process.env.CLOUDINARY_UPLOAD_PRESET_SUPPLIER || 'default_preset_for_suppliers' // Corrected ENV variable name
      );
      if (logoData.result?.secure_url) {
        updateData.logo = logoData.result.secure_url;
      } else {
        console.warn("Supplier logo upload failed for update, existing logo preserved unless removed:", logoData.error);
      }
    } catch (uploadError) {
      console.error("Error uploading new supplier logo for update:", uploadError);
    }
  }
  // If no new logoFile and removeLogo is not true, updateData.logo remains unset, preserving the existing logo.

  try {
    await db.supplier.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/dashboard/suppliers');
    revalidatePath(`/dashboard/suppliers/edit/${id}`);
    revalidatePath(`/dashboard/suppliers/view/${id}`); // Ensure view page is revalidated
    // If supplier name/info is shown on product pages, revalidate those too.
    // For example, if products list shows supplier name:
    // revalidatePath('/dashboard/products'); 
    // revalidatePath('/dashboard/products-control');
    return { success: true, message: 'تم تحديث المورد بنجاح!' };

  } catch (error: unknown) {
    console.error('Error updating supplier:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('slug')) {
          return { success: false, message: 'مورد آخر بهذا الاسم (أو رابط مشابه) موجود بالفعل.' };
        }
        if (target.includes('name') && !target.includes('slug')) {
          return { success: false, message: 'مورد آخر بهذا الاسم موجود بالفعل.' };
        }
        return { success: false, message: 'حدث خطأ في البيانات، قد يكون هناك تكرار في حقل فريد.' };
      }
      if (error.code === 'P2025') { // Record to update not found
        return { success: false, message: 'المورد المراد تحديثه غير موجود.' };
      }
    }
    return { success: false, message: 'فشل في تحديث المورد. يرجى المحاولة مرة أخرى.' };
  }
}
