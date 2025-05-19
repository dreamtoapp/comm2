export interface Company {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  logo: string; // Changed to mandatory
  profilePicture: string;
  bio: string;
  taxNumber: string;
  taxQrImage: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  snapchat: string;
  website: string;
  address: string;
  latitude: string;
  longitude: string;
  createdAt?: Date;
  updatedAt?: Date;
}
