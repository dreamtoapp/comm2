import dynamic from 'next/dynamic';

import { auth } from '@/auth';
import BackToTopButton from '@/components/ecomm/BackToTopButton';

import { generatePageMetadata } from '../../lib/seo-utils';
import { getPromotions } from './homepage/actions/getPromotions';
import { fetchSuppliersWithProducts } from './homepage/actions/getSuppliersWithProducts';
import { getCategories } from './homepage/actions/getCategories';

// Dynamically import components with optimized loading strategies
// Critical above-the-fold components with priority
const SliderSection = dynamic(() => import('./homepage/component/slider/SliderSection'), {
  ssr: true,
  loading: () => <div className='h-64 w-full animate-pulse rounded-xl bg-gray-100 shadow-md'></div>,
});

const PreloadScript = dynamic(() => import('./homepage/component/PreloadScript'), {
  ssr: true,
});

// Main category section with priority loading
const RealCategoryListClient = dynamic(
  () => import('./homepage/component/EcommClientWrappers').then((mod) => mod.RealCategoryListClient),
  {
    ssr: true,
    loading: () => (
      <div className='w-full animate-pulse rounded-xl border border-border bg-card p-4'>
        <div className='mb-4 h-8 w-1/3 rounded bg-gray-200'></div>
        <div className='flex gap-4 overflow-x-auto pb-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-40 w-64 flex-shrink-0 rounded-xl bg-gray-200'></div>
          ))}
        </div>
      </div>
    ),
  },
);

// Featured promotions component
const FeaturedPromotions = dynamic(() => import('./homepage/component/FeaturedPromotions'), {
  ssr: true,
  loading: () => (
    <div className='w-full animate-pulse rounded-xl border border-border bg-card p-4'>
      <div className='mb-4 h-8 w-1/3 rounded bg-gray-200'></div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-64 rounded-xl bg-gray-200'></div>
        ))}
      </div>
    </div>
  ),
});

// Lower priority supplier components
const CategoryListClient = dynamic(
  () => import('./homepage/component/EcommClientWrappers').then((mod) => mod.CategoryListClient),
  {
    ssr: true,
    loading: () => (
      <div className='w-full animate-pulse rounded-xl border border-border bg-card p-4'>
        <div className='mb-4 h-8 w-1/3 rounded bg-gray-200'></div>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-32 rounded bg-gray-200'></div>
          ))}
        </div>
      </div>
    ),
  },
);

const CheckUserActivationClient = dynamic(
  () => import('./homepage/component/EcommClientWrappers').then((mod) => mod.CheckUserActivationClient),
  {
    ssr: true,
  },
);

const CheckUserLocationClient = dynamic(
  () => import('./homepage/component/EcommClientWrappers').then((mod) => mod.CheckUserLocationClient),
  {
    ssr: true,
  },
);

const ClearButton = dynamic(() => import('./homepage/component/supplier/ClearButton'), {
  ssr: true,
  loading: () => <div className='h-12 w-full animate-pulse rounded-xl bg-card'></div>,
});

// Use dynamic imports with optimized component for product section
const ProductsSection = dynamic(() => import('./homepage/component/product/ProductsSection'), {
  ssr: true,
  loading: () => (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className='relative h-80 animate-pulse overflow-hidden rounded-2xl border-border bg-card shadow-md'
          >
            <div className='h-40 bg-gray-300'></div>
            <div className='space-y-4 p-4'>
              <div className='h-4 w-3/4 rounded bg-gray-300'></div>
              <div className='h-4 w-1/2 rounded bg-gray-300'></div>
              <div className='h-8 rounded bg-gray-300'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

// Generate metadata dynamically
export async function generateMetadata() {
  return generatePageMetadata('ecomm');
}

export default async function Page({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { slug } = await searchParams;
  const session = await auth();

  // Fetch data in parallel
  const [supplierWithItems, promotionsData, categories] = await Promise.all([
    fetchSuppliersWithProducts(),
    getPromotions(),
    getCategories(),
  ]);

  // Use promotions if available, otherwise use fallback data
  const displayPromotions =
    promotionsData.length > 0
      ? promotionsData
      : [
        {
          id: 'fallback-1',
          title: 'Special Summer Collection',
          imageUrl: '/fallback/fallback.avif',
        },
        {
          id: 'fallback-2',
          title: 'New Arrivals - Spring 2025',
          imageUrl: '/fallback/fallback.webp',
        },
      ];

  return (
    <div className='container mx-auto flex flex-col gap-4 bg-background text-foreground'>
      {/* Performance optimization script */}
      <PreloadScript />

      {/* User-specific components */}
      {session && (
        <>
          <CheckUserActivationClient user={session.user} />
          <CheckUserLocationClient user={session.user} />
        </>
      )}

      {/* Critical above-the-fold content */}
      <SliderSection promotions={displayPromotions} />

      {/* MAIN CATEGORIES SECTION - Featured prominently at the top */}
      <section className="py-2">
        <RealCategoryListClient
          categories={categories}
          title="تسوق حسب الفئة"
          description="استكشف مجموعتنا المتنوعة من المنتجات حسب الفئة"
        />
      </section>

      {/* FEATURED PROMOTIONS SECTION */}
      <FeaturedPromotions promotions={promotionsData} />

      {/* Filter button - only shown when needed */}
      <ClearButton slugString={slug} />

      {/* Main product grid */}
      <section className="py-2">
        <ProductsSection slug={slug || ''} />
      </section>

      {/* SUPPLIERS SECTION - Moved lower in the page hierarchy */}
      <section className="border-t border-border mt-6 pt-6">
        <h2 className="mb-4 text-xl font-semibold">متاجر وموردون</h2>

        {/* Only show if we have suppliers */}
        {supplierWithItems.companyData && supplierWithItems.companyData.length > 0 && (
          <div className="mb-6">
            <CategoryListClient
              suppliers={supplierWithItems.companyData}
              cardDescription='اكتشف المنتجات من الموردين الموثوقة وتمتع بأفضل الخيارات المتاحة'
              cardHeader='قائمة الموردين المميزة'
            />
          </div>
        )}

        {/* Only show offer section if we have offers */}
        {supplierWithItems.offerData && supplierWithItems.offerData.length > 0 && (
          <CategoryListClient
            suppliers={supplierWithItems.offerData}
            cardDescription='استمتع بأفضل العروض والخصومات على المنتجات المختارة'
            cardHeader='قائمة العروض الحصرية'
          />
        )}
      </section>

      <BackToTopButton />
    </div>
  );
}
