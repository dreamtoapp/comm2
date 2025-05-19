// types/user.ts
export interface User {
  id?: string;
  phone: string | null;
  name?: string | null;
  email?: string | null;
  role: string | null;
  address: string | null;
  isOtp: boolean;
  latitude: string;
  longitude: string;
  password?: string | null | undefined;
  avatar?: string | null;
}

export type UserFormState = Omit<Partial<User>, 'id' | 'phone' | 'password' | 'role'> & {
  avatar?: File | string | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
