import {
  ORDER_STATUS_DISPLAY_AR,
  ORDER_STATUS_STYLES,
} from '@/constant/order-status';

// Re-export the styles from the central order-status.ts file and add a default style
export const STATUS_STYLES = {
  ...ORDER_STATUS_STYLES,
  DEFAULT: 'bg-gray-100 text-gray-800', // Add a default style
};

// Re-export the Arabic translations from the central order-status.ts file
export const STATUS_TRANSLATIONS = {
  ...ORDER_STATUS_DISPLAY_AR,
  // Keep any additional translations not in the enum
  Returned: 'مرتجع',
  Default: 'حالة غير معروفة',
};
