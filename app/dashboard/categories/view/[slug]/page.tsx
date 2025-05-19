import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Adjusted import path for actions
import { getCategoryBySlug, getProductsByCategorySlug } from '../../actions';
import BackButton from '@/components/BackButton'; // Added BackButton import
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

// Removed CategoryViewPageProps interface for Next.js 15 compatibility

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params; // Await params
  const encodedSlug = resolvedParams.slug;
  const slug = decodeURIComponent(encodedSlug); // Decode the slug
  const categoryResult = await getCategoryBySlug(slug);

  if (!categoryResult.success || !categoryResult.category) {
    return {
      title: 'صنف غير موجود',
    };
  }
  const category = categoryResult.category;
  return {
    title: `عرض الصنف: ${category.name}`,
    description: category.description || `استعراض المنتجات في صنف ${category.name}.`,
  };
}

const PRODUCTS_PER_PAGE = 12;

export default async function Page({ params, searchParams }: { params: { slug: string }; searchParams?: { [key: string]: string | string[] | undefined } }) {
  const resolvedParams = await params; // Await params
  const encodedSlugFromParams = resolvedParams.slug;
  const slug = decodeURIComponent(encodedSlugFromParams); // Decode the slug

  const resolvedSearchParams = searchParams ? await searchParams : {}; // Await searchParams if it exists
  const page = typeof resolvedSearchParams?.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = PRODUCTS_PER_PAGE;

  const categoryDataResult = await getCategoryBySlug(slug); // Use decoded slug

  if (!categoryDataResult.success || !categoryDataResult.category) {
    notFound();
  }
  const category = categoryDataResult.category;
  // Pass the original (potentially encoded) slug from params for link generation,
  // or ensure Link component handles encoding of decoded slug correctly.
  // Next.js Link usually handles encoding, so using decoded slug for links should be fine.
  const productsResult = await getProductsByCategorySlug(slug, page, pageSize); // Use decoded slug

  if (!productsResult.success) {
    console.error("خطأ في جلب منتجات الصنف:", productsResult.error);
  }

  const products = productsResult.success ? productsResult.products || [] : [];
  const totalPages = productsResult.success ? productsResult.totalPages || 1 : 1;

  return (
    <section className="space-y-6">
      <div className="flex items-center mb-4">
        <BackButton />
      </div>

      <div className="p-4 bg-card border rounded-lg">
        <h2 className="text-xl font-semibold mb-2 sm:text-2xl"> {/* Adjusted font size */}
          عرض الصنف: {category.name}
        </h2>
        {category.imageUrl && (
          <div className="relative mx-auto mb-3 h-32 w-full max-w-sm overflow-hidden rounded-md md:h-40"> {/* Reduced height, max-width */}
            <Image
              src={category.imageUrl}
              alt={`صورة لـ ${category.name}`}
              fill
              className="object-contain"
            />
          </div>
        )}
        {category.description && (
          <p className="text-sm text-muted-foreground md:text-base"> {/* Adjusted font size */}
            {category.description}
          </p>
        )}
      </div>

      <Separator />

      {products.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold sm:text-xl mb-4">المنتجات في هذا الصنف:</h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center space-x-4">
              {page > 1 && (
                <Button asChild variant="outline">
                  <Link href={`/dashboard/categories/view/${slug}?page=${page - 1}`}>
                    الصفحة السابقة
                  </Link>
                </Button>
              )}
              {page < totalPages && (
                <Button asChild variant="outline">
                  <Link href={`/dashboard/categories/view/${slug}?page=${page + 1}`}>
                    الصفحة التالية
                  </Link>
                </Button>
              )}
            </div>
          )}
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            عرض صفحة {page} من {totalPages}
          </div>
        </>
      ) : (
        <div className="py-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            لا توجد منتجات في هذا الصنف حاليًا.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            يرجى التحقق مرة أخرى لاحقًا أو استكشاف أصناف أخرى.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/categories">العودة إلى قائمة الأصناف</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
