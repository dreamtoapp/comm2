export interface CustomUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  latitude: string;
  longitude: string;
  image?: string | null;
  isOauth: boolean;
  isOtp: boolean;
}

export interface CustomSession {
  user: CustomUser;
  expires: string;
}
