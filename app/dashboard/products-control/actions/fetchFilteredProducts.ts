'use server';
import { Prisma } from '@prisma/client'; // Import Prisma
import db from '@/lib/prisma';
import { Product } from '@/types/product'; // Import shared Product type

// Define the type for Product including the supplier relation
type FetchedProduct = Prisma.ProductGetPayload<{ // Renamed for clarity
  include: { supplier: true }
}>;

interface FilterParams {
  name?: string;
  supplierId?: string | null;
  status?: string; // "published", "unpublished", "all"
  type?: string; // "company", "offer", "all"
  stock?: string; // "all", "in", "out"
  page?: number;
  pageSize?: number;
}

export async function fetchFilteredProducts( // Update return type
  filters: FilterParams,
): Promise<{ products: Product[]; total: number }> {
  const where: Prisma.ProductWhereInput = {}; // Use correct type
  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }
  if (filters.supplierId) {
    where.supplierId = filters.supplierId;
  }
  if (filters.status && filters.status !== 'all') {
    where.published = filters.status === 'published';
  }
  if (filters.type && filters.type !== 'all') {
    // Directly filter by supplier type
    where.supplier = { type: filters.type };
  }
  if (filters.stock && filters.stock !== 'all') {
    where.outOfStock = filters.stock === 'out';
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 10;

  const [products, total]: [FetchedProduct[], number] = await Promise.all([ // Use FetchedProduct type
    db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }, // Default findMany fetches all scalar fields
      include: { supplier: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  // Map products to ensure imageUrl is always a string (never null)
  // Map to the shared Product type, handling nulls/defaults
  const mappedProducts: Product[] = products.map((p: FetchedProduct) => ({
    id: p.id,
    name: p.name,
    slug: p.slug, // Include slug
    price: p.price,
    details: p.details, // Keep as string | null
    size: p.size, // Keep as string | null
    published: p.published,
    outOfStock: p.outOfStock,
    imageUrl: p.imageUrl, // Keep as string | null
    images: p.images, // Include images
    type: p.type,
    rating: p.rating, // Include rating
    reviewCount: p.reviewCount, // Include reviewCount
    supplier: p.supplier, // Include full supplier
    createdAt: p.createdAt, // Include createdAt
    updatedAt: p.updatedAt, // Include updatedAt
    inStock: !p.outOfStock, // Derive inStock
  }));

  return { products: mappedProducts, total };
}
