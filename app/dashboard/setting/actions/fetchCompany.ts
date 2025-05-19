'use server';
import db from '@/lib/prisma';
import { Company } from '@/types/company';

export const fetchCompany = async (): Promise<Company | null> => {
  try {
    const data = await db.company.findFirst();
    if (!data) return null; // Return null if no company is found
    return {
      id: data.id,
      fullName: data.fullName || '',
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      whatsappNumber: data.whatsappNumber || '',
      logo: data.logo || '',
      profilePicture: data.profilePicture || '',
      bio: data.bio || '',
      taxNumber: data.taxNumber || '',
      taxQrImage: data.taxQrImage || '',
      twitter: data.twitter || '',
      linkedin: data.linkedin || '',
      instagram: data.instagram || '',
      tiktok: data.tiktok || '',
      facebook: data.facebook || '',
      snapchat: data.snapchat || '',
      website: data.website || '',
      address: data.address || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
    };
  } catch (error) {
    console.error('Error fetching company:', error);
    throw new Error('Failed to fetch company.');
  }
};
