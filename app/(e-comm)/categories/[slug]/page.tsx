import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import { getCategories } from '../../homepage/actions/getCategories';
import { getCategoryBySlug, getProductsByCategorySlug } from '../action/actions';

import EnhancedProductCardAdapter from '../components/EnhancedProductCardAdapter';

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const categoryResult = await getCategoryBySlug(slug);

  if (!categoryResult.success || !categoryResult.category) {
    return {
      title: 'Category Not Found',
    };
  }
  const category = categoryResult.category;
  return {
    title: category.metaTitle || category.name,
    description: category.metaDescription || category.description || `Browse products in the ${category.name} category.`,
    openGraph: {
      title: category.metaTitle || category.name,
      description: category.metaDescription || category.description || `Browse products in the ${category.name} category.`,
      images: category.imageUrl ? [{ url: category.imageUrl, alt: category.name }] : [],
    },
  };
}

const PRODUCTS_PER_PAGE = 12;

export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const page = typeof resolvedSearchParams?.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = PRODUCTS_PER_PAGE;

  // Fetch data in parallel for better performance
  const [categoryDataResult, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories() // Get all categories for related categories section
  ]);

  if (!categoryDataResult.success || !categoryDataResult.category) {
    notFound();
  }
  const category = categoryDataResult.category;

  // Fetch products for the current category
  const productsResult = await getProductsByCategorySlug(slug, page, pageSize);

  if (!productsResult.success) {
    console.error("Error fetching products for category:", productsResult.error);
  }

  const products = productsResult.success ? productsResult.products || [] : [];
  const totalPages = productsResult.success ? productsResult.totalPages || 1 : 1;

  // Get related categories (excluding current one)
  const relatedCategories = allCategories
    .filter(c => c.slug !== slug)
    .slice(0, 4); // Limit to 4 related categories

  return (
    <div className="container mx-auto bg-background px-4 py-8 text-foreground">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          الرئيسية
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <Link href="/categories" className="text-muted-foreground hover:text-foreground">
          الفئات
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{category.name}</span>
      </nav>

      {/* Hero header with category image */}
      <header className="mb-8 overflow-hidden rounded-xl bg-accent">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1 p-6 md:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                {category.description}
              </p>
            )}
            <div className="mt-6 rounded-lg bg-muted/50 px-4 py-2">
              <span className="font-medium">{productsResult.success ? productsResult.totalProducts : 0}</span> منتج في هذه الفئة
            </div>
          </div>

          {category.imageUrl && (
            <div className="h-60 w-full md:h-80 md:w-1/2 lg:h-96">
              <div className="relative h-full w-full">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Products grid */}
      {products.length > 0 ? (
        <>
          <h2 className="mb-6 text-2xl font-bold">منتجات {category.name}</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <EnhancedProductCardAdapter
                key={product.id}
                product={product}
                variant="category"
                showQuantityControls={false}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              {page > 1 && (
                <Button asChild variant="outline">
                  <Link href={`/categories/${slug}?page=${page - 1}`}>
                    <span className="ml-2">←</span> الصفحة السابقة
                  </Link>
                </Button>
              )}

              <div className="text-sm text-muted-foreground">
                صفحة {page} من {totalPages}
              </div>

              {page < totalPages && (
                <Button asChild variant="outline">
                  <Link href={`/categories/${slug}?page=${page + 1}`}>
                    الصفحة التالية <span className="mr-2">→</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl bg-muted/20 py-12 text-center">
          <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-muted p-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            لا توجد منتجات في هذا الصنف حاليًا
          </h3>
          <p className="mt-2 text-muted-foreground">
            يرجى التحقق مرة أخرى لاحقًا أو استكشاف أصناف أخرى
          </p>
          <Button asChild className="mt-6">
            <Link href="/categories">استكشاف فئات أخرى</Link>
          </Button>
        </div>
      )}

      {/* Related Categories Section */}
      {relatedCategories.length > 0 && (
        <div className="mt-20">
          <Separator className="mb-8" />
          <h2 className="mb-6 text-2xl font-bold">فئات ذات صلة</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedCategories.map((relatedCategory) => (
              <Link
                key={relatedCategory.id}
                href={`/categories/${relatedCategory.slug}`}
                className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden">
                  {relatedCategory.imageUrl ? (
                    <Image
                      src={relatedCategory.imageUrl}
                      alt={relatedCategory.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{relatedCategory.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {relatedCategory.productCount} منتج
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
