// app/dashboard/suppliers/validation.ts
import { z } from 'zod';

// Define the validation schema for supplier data
export const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required.'),
});

// Infer the TypeScript type from the schema
export type SupplierFormData = z.infer<typeof supplierSchema>;
