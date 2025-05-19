import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Product SEO Management',
  description: 'Manage SEO settings for individual products by editing them directly.',
};

async function getProductsForSeoOverview(page = 1, pageSize = 20) {
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      metaTitle: true,
      metaDescription: true,
      published: true,
    },
  });
  const totalProducts = await prisma.product.count();
  return { products, totalProducts, totalPages: Math.ceil(totalProducts / pageSize) };
}

export default async function ProductSeoPage() {
  const { products } = await getProductsForSeoOverview(1, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product SEO</h1>
        <p className="mt-2 text-muted-foreground">
          Manage SEO for your products. Product SEO (meta title, description) is typically edited directly on the product's main edit page.
        </p>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Meta Title Status</TableHead>
                <TableHead>Meta Description Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>

                    {product.metaTitle ? (
                      <p>{product.metaTitle}</p>
                    ) : (
                      <Badge variant="destructive">Not Set</Badge>
                    )}
                  </TableCell>
                  <TableCell>

                    {product.metaDescription ? (
                      <p>{product.metaDescription}</p>
                    ) : (
                      <Badge variant="destructive">Not Set</Badge>
                    )}

                  </TableCell>
                  <TableCell>
                    <Badge variant={product.published ? 'outline' : 'destructive'}>
                      {product.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/seo/products/view/${product.id}`}>
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/seo/products/edit/${product.id}`}>
                        Edit Seo
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* TODO: Add pagination controls if many products */}
    </div>
  );
}
