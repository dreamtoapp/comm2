import { notFound } from 'next/navigation';
import db from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import ProductViewContent from './product-view-content';

interface ProductViewPageProps {
  params: { id: string };
}

async function getFullProductDetails(id: string) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      supplier: true,
      categoryAssignments: {
        include: {
          category: true,
        },
      },
      reviews: {
        include: {
          user: { select: { name: true, image: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    notFound();
  }
  return product;
}

export default async function ProductViewPage({ params: paramsPromise }: ProductViewPageProps) { // Rename
  const params = await paramsPromise; // Await
  const { id } = params;
  const product = await getFullProductDetails(id);

  const totalReviews = product.reviews.length;
  const averageRating = totalReviews > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  const productWithStats = {
    ...product,
    averageRating: parseFloat(averageRating.toFixed(1)),
    reviewCount: totalReviews,
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          تفاصيل المنتج: {product.name}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/products-control" className="flex items-center gap-2">
            <ArrowRight className={iconVariants({ size: 'sm' })} />
            <span>العودة إلى قائمة المنتجات</span>
          </Link>
        </Button>
      </div> {/* This div closes the flex container for header and button */}
      <ProductViewContent product={productWithStats} />
    </div> /* This div closes the main container */
  );
}
