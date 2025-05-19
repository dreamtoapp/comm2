// app/dashboard/products/logic/validation.ts
import { z } from 'zod';

// Regex for basic Arabic letters (for Saudi market support)
const arabicRegex = /^[\u0600-\u06FF\s]+$/;
const englishRegex = /^[A-Za-z0-9\s.,'"-]+$/;

export const productSchema = z.object({
  name: z.object({
    en: z
      .string()
      .min(3, 'يجب أن يكون اسم المنتج بالإنجليزية 3 أحرف على الأقل.')
      .regex(englishRegex, 'يجب أن يحتوي الاسم الإنجليزي على أحرف ورموز إنجليزية فقط.'),
    ar: z
      .string()
      .min(3, 'يجب أن يكون اسم المنتج بالعربية 3 أحرف على الأقل.')
      .regex(arabicRegex, 'يجب أن يحتوي الاسم العربي على أحرف عربية فقط.'),
  }),
  description: z.object({
    en: z
      .string()
      .min(10, 'يجب أن يكون الوصف بالإنجليزية 10 أحرف على الأقل.')
      .regex(englishRegex, 'يجب أن يحتوي الوصف الإنجليزي على أحرف ورموز إنجليزية فقط.'),
    ar: z
      .string()
      .min(10, 'يجب أن يكون الوصف بالعربية 10 أحرف على الأقل.')
      .regex(arabicRegex, 'يجب أن يحتوي الوصف العربي على أحرف عربية فقط.'),
  }),
  price: z.number().positive('يجب أن يكون السعر رقمًا موجبًا.'),
  size: z.string().min(1, 'الحجم مطلوب.'),
  images: z
    .array(z.string().url('يجب أن يكون كل رابط صورة صحيحاً.'))
    .min(1, 'يجب إضافة صورة واحدة على الأقل للمنتج.'),
  category: z.string().min(1, 'التصنيف مطلوب.'),
  stock: z
    .number()
    .int('يجب أن تكون الكمية عددًا صحيحًا.')
    .nonnegative('لا يمكن أن تكون الكمية سالبة.'),
  brand: z.string().optional(),
  discount: z
    .number()
    .min(0, 'لا يمكن أن يكون الخصم أقل من صفر.')
    .max(100, 'لا يمكن أن يتجاوز الخصم 100٪.')
    .optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
