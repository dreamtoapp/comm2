// translations.ts
export type Language = 'ar' | 'en';

export interface Translation {
  settings: string;
  appearance: string;
  account: string;
  notifications: string;
  language: string;
  darkMode: string;
  appearanceDesc: string;
  email: string;
  password: string;
  changePassword: string;
  save: string;
  english: string;
  arabic: string;
  emailNotifications: string;
  smsNotifications: string;
  pushNotifications: string;
}

export const translations: Record<Language, Translation> = {
  ar: {
    settings: 'الإعدادات',
    appearance: 'المظهر',
    account: 'الحساب',
    notifications: 'الإشعارات',
    language: 'اللغة',
    darkMode: 'الوضع الليلي',
    appearanceDesc: 'قم بتخصيص مظهر التطبيق',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    changePassword: 'تغيير كلمة المرور',
    save: 'حفظ التغييرات',
    english: 'الإنجليزية',
    arabic: 'العربية',
    emailNotifications: 'إشعارات البريد',
    smsNotifications: 'إشعارات الرسائل',
    pushNotifications: 'الإشعارات الفورية',
  },
  en: {
    settings: 'Settings',
    appearance: 'Appearance',
    account: 'Account',
    notifications: 'Notifications',
    language: 'Language',
    darkMode: 'Dark Mode',
    appearanceDesc: 'Customize application appearance',
    email: 'Email',
    password: 'Password',
    changePassword: 'Change Password',
    save: 'Save Changes',
    english: 'English',
    arabic: 'Arabic',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    pushNotifications: 'Push Notifications',
  },
};
