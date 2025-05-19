'use server';
import { Prisma } from '@prisma/client'; // Import Prisma
import db from '@/lib/prisma';

export interface ProductFilters {
  name?: string;
  supplierId?: string;
  published?: boolean;
  outOfStock?: boolean;
}

export interface FetchProductsArgs {
  page?: number;
  pageSize?: number;
  filters?: ProductFilters;
}

export async function fetchProducts({ page = 1, pageSize = 10, filters = {} }: FetchProductsArgs) {
  const where: Prisma.ProductWhereInput = {}; // Use correct type
  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }
  if (filters.supplierId) {
    where.supplierId = filters.supplierId;
  }
  if (typeof filters.published === 'boolean') {
    where.published = filters.published;
  }
  if (typeof filters.outOfStock === 'boolean') {
    where.outOfStock = filters.outOfStock;
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { supplier: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    db.product.count({ where }),
  ]);

  return { products, total };
}
