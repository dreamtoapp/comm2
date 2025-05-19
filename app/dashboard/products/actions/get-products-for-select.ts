'use server';

import prisma from '@/lib/prisma';

export interface SelectableProduct {
  id: string;
  name: string;
  imageUrl?: string | null;
  price?: number;
}

export interface PaginatedProductsResponse {
  products: SelectableProduct[];
  hasMore: boolean;
  totalCount: number;
}

const DEFAULT_LIMIT = 20;

export async function getProductsForSelect({
  query,
  page = 1,
  limit = DEFAULT_LIMIT,
}: {
  query?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedProductsResponse> {
  try {
    const whereClause: any = {
      // Add any default filters if needed, e.g., isActive: true
    };

    if (query) {
      whereClause.name = {
        contains: query,
        mode: 'insensitive',
      };
    }

    const totalCount = await prisma.product.count({ where: whereClause });

    const productsData = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        images: true,
        price: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const selectableProducts = productsData.map(product => ({
      id: product.id,
      name: product.name,
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
      price: product.price,
    }));

    return {
      products: selectableProducts,
      hasMore: page * limit < totalCount,
      totalCount,
    };
  } catch (error) {
    console.error('Failed to fetch products for select:', error);
    return { products: [], hasMore: false, totalCount: 0 }; // Return empty paginated response on error
  }
}
