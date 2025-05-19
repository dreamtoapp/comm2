export interface CompanySettings {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  taxNumber?: string | null;
  taxQrImage?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  snapchat?: string | null;
  website?: string | null;
  defaultShiftId?: string | null;
  defaultShift?: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  } | null;
}
