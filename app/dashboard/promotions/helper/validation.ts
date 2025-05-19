// app/dashboard/products/logic/validation.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  price: z.number().positive('Price must be a positive number.'),
  size: z.string().min(1, 'Size is required.'),
});
