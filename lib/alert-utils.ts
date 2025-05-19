// lib/alert-utils.ts
import ReactSwal from './swal-config';

type AlertOptions = {
  title?: string;
  text?: string;
  html?: string;
  timer?: number;
};

export const Alert = {
  // Toast-style notifications
  toast: {
    success: (message: string) => {
      ReactSwal.fire({
        title: 'تم بنجاح!',
        text: message,
        icon: 'success',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },

    error: (message: string) => {
      ReactSwal.fire({
        title: 'خطأ!',
        text: message,
        icon: 'error',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 4000,
      });
    },
  },

  // Full-screen dialogs
  dialog: {
    confirm: (options: AlertOptions) =>
      ReactSwal.fire({
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'تأكيد',
        cancelButtonText: 'إلغاء',
        ...options,
      }),

    success: (options: AlertOptions) =>
      ReactSwal.fire({
        icon: 'success',
        confirmButtonText: 'حسناً',
        ...options,
      }),
  },
};
