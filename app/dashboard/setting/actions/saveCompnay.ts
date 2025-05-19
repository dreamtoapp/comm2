'use server';
import db from '@/lib/prisma';
import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import { Company } from '@/types/company';

export const saveCompany = async (formData: FormData): Promise<void> => {
  try {
    const companyData = collectData(formData);
    const existingCompany = await db.company.findFirst();

    if (formData.has('logo')) {
      const ImageData = await ImageToCloudinary(
        formData.get('logo') as File,
        process.env.CLOUDINARY_UPLOAD_PRESET_ASSETS || '',
      );

      // const { secure_url, public_id } = await uploadImage(imageFile);
      const imageUrl = ImageData.result?.secure_url;

      companyData.logo = imageUrl;
    } else {
      console.warn('No imageUrl');
    }

    if (existingCompany) {
      // Update the existing company
      await db.company.update({
        where: { id: existingCompany.id },
        data: companyData,
      });
    } else {
      // Create a new company
      await db.company.create({ data: companyData });
    }
  } catch (error) {
    console.error('Error saving company:', error);
    throw new Error('Failed to save company.');
  }
};
const collectData = (formData: FormData): Partial<Company> => {
  const data = Object.fromEntries(formData.entries());
  return {
    fullName: String(data.fullName || ''),
    email: String(data.email || ''),
    phoneNumber: String(data.phoneNumber || ''),
    whatsappNumber: String(data.whatsappNumber || ''),
    // logo: String(data.logo || ""),
    profilePicture: String(data.profilePicture || ''),
    bio: String(data.bio || ''),
    taxNumber: String(data.taxNumber || ''),
    taxQrImage: String(data.taxQrImage || ''),
    twitter: String(data.twitter || ''),
    linkedin: String(data.linkedin || ''),
    instagram: String(data.instagram || ''),
    tiktok: String(data.tiktok || ''),
    facebook: String(data.facebook || ''),
    snapchat: String(data.snapchat || ''),
    website: String(data.website || ''),
    address: String(data.address || ''),
    latitude: String(data.latitude || ''),
    longitude: String(data.longitude || ''),
  };
};
