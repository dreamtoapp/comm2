'use server';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import db from '@/lib/prisma';
import { Slugify } from '@/utils/slug'; // Assuming you have a slugify utility

interface PrevState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
}

export async function createSupplier(prevState: PrevState, formData: FormData): Promise<PrevState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string | null;
  const phone = formData.get('phone') as string | null;
  const address = formData.get('address') as string | null;
  const type = formData.get('type') as string | null; // e.g., 'company', 'individual'
  const logoFile = formData.get('logo') as File | null;

  // Basic validation
  if (!name) {
    return { success: false, message: "اسم المورد مطلوب.", errors: { name: ["الاسم مطلوب"] } };
  }

  let logoUrl: string | undefined = undefined;
  if (logoFile && logoFile.size > 0) {
    try {
      const logoData = await ImageToCloudinary(
        logoFile,
        process.env.CLOUDINARY_UPLOAD_PRESET_SUPPLIER || 'default_preset_for_suppliers' // Corrected ENV variable name
      );
      if (logoData.result?.secure_url) {
        logoUrl = logoData.result.secure_url;
      } else {
        console.warn("Supplier logo upload failed, but proceeding without logo:", logoData.error);
        // Optionally return an error if logo upload is critical and fails
      }
    } catch (uploadError) {
      console.error("Error uploading supplier logo:", uploadError);
      // Optionally return an error
    }
  }

  const supplierData: Prisma.SupplierCreateInput = {
    name,
    slug: Slugify(name), // Auto-generate slug
    email: email || '', // Default to empty string if null
    phone: phone || '',
    address: address || '',
    type: type || 'company', // Default type if not provided
    logo: logoUrl,
  };

  try {
    await db.supplier.create({
      data: supplierData,
    });

    revalidatePath('/dashboard/suppliers');
    return { success: true, message: 'تمت إضافة المورد بنجاح!' };

  } catch (error: unknown) {
    console.error('Error creating supplier:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors, e.g., unique constraint violation for slug or name if made unique
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('slug')) {
          return { success: false, message: 'مورد بهذا الاسم (أو رابط مشابه) موجود بالفعل. يرجى اختيار اسم مختلف.' };
        }
        if (target.includes('name') && !target.includes('slug')) { // If name itself is unique
          return { success: false, message: 'مورد بهذا الاسم موجود بالفعل.' };
        }
        return { success: false, message: 'حدث خطأ في البيانات المدخلة، قد يكون هناك تكرار في حقل فريد.' };
      }
    }
    return { success: false, message: 'فشل في إضافة المورد. يرجى المحاولة مرة أخرى.' };
  }
}
