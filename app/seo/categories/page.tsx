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
import prisma from '@/lib/prisma'; // Corrected: default import

export const metadata: Metadata = {
  title: 'Category SEO Management',
  description: 'Manage SEO settings for product categories by editing them directly.',
};

// Placeholder: Replace with your actual category fetching logic if more complex
async function getCategoriesForSeoOverview(page = 1, pageSize = 20) {
  const categories = await prisma.category.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      metaTitle: true, // New SEO field on Category model
      metaDescription: true, // New SEO field on Category model
      // Add other fields if needed for display, e.g., product count
    },
  });
  const totalCategories = await prisma.category.count();
  return { categories, totalCategories, totalPages: Math.ceil(totalCategories / pageSize) };
}

export default async function CategorySeoPage() {
  const { categories } = await getCategoriesForSeoOverview(1, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Category SEO</h1>
        <p className="mt-2 text-muted-foreground">
          Manage SEO for your product categories. Category SEO (meta title, description) is typically edited directly on the category's main edit page.
        </p>
      </div>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Meta Title Status</TableHead>
                <TableHead>Meta Description Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: typeof categories[0]) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    {category.metaTitle ? (
                      <p >{category.metaTitle}</p>
                    ) : (
                      <Badge variant="destructive">Not Set</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {category.metaDescription ? (
                      <p  >{category.metaDescription}</p>
                    ) : (
                      <Badge variant="destructive">Not Set</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* IMPORTANT: Update this href to your actual category edit path */}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/seo/categories/edit/${category.id}`}>
                        Edit Category
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/seo/categories/view/${category.id}`}>
                        view
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* TODO: Add pagination controls if many categories */}
    </div>
  );
}
