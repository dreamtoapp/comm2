import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Check, Info, Star } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

import { auth } from '@/auth';
// Removed Icon import: import { Icon } from '@/components/icons';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import RelatedProducts from '@/components/product/RelatedProducts';
import RateProductButton from '@/components/rating/RateProductButton';
import RatingDisplay from '@/components/rating/RatingDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getProductBySlug, getProductReviews } from '../actions/actions';
import ProductQuantity from './ProductQuantity';

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'المنتج غير موجود | المتجر الإلكتروني',
      description: 'عذراً، المنتج الذي تبحث عنه غير موجود',
    };
  }

  return {
    title: `${product.name} | المتجر الإلكتروني`,
    description: product.details || 'تفاصيل المنتج في المتجر الإلكتروني',
    openGraph: {
      title: product.name,
      description: product.details || 'تفاصيل المنتج في المتجر الإلكتروني',
      images: [
        {
          url: product.imageUrl || '/fallback/product-fallback.avif',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
      siteName: 'المتجر الإلكتروني',
      locale: 'ar_SA',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const session = await auth();
  const product = await getProductBySlug(slug);

  // If product not found, show 404 page
  if (!product) {
    notFound();
  }

  // Get product reviews
  const reviews = await getProductReviews(product.id);

  // Check if product is in user's wishlist


  // Format price
  const formattedPrice = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(product.price);

  // No sale price in the product model, so no discount
  const discountPercentage = 0;

  // No sale price available
  const formattedSalePrice = null;

  // Get all product images
  const mainImage = product.imageUrl || '/fallback/product-fallback.avif';
  const additionalImages = product.images?.filter((img) => img !== mainImage) || [];

  return (
    <div className='container py-8'>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        {/* Product Images */}
        <div className='relative'>
          <ProductImageGallery mainImage={mainImage} additionalImages={additionalImages} />
        </div>

        {/* Product Details */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-bold'>{product.name}</h1>
            <div className='mt-2 flex items-center gap-2'>
              <RatingDisplay
                rating={product.rating || 0}
                reviewCount={product.reviewCount || 0}
                productId={product.id}
                productSlug={product.slug}
              />
              {!product.outOfStock ? (
                <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700'>
                  <Check className={iconVariants({ size: 'xs', className: 'mr-1' })} /> {/* Use direct import + CVA */}
                  متوفر
                </Badge>
              ) : (
                <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700'>
                  غير متوفر
                </Badge>
              )}
            </div>
          </div>

          <div className='flex items-baseline gap-2'>
            {formattedSalePrice ? (
              <>
                <span className='text-2xl font-bold text-primary'>{formattedSalePrice}</span>
                <span className='text-lg text-muted-foreground line-through'>{formattedPrice}</span>
                <Badge className='bg-red-500'>{discountPercentage}% خصم</Badge>
              </>
            ) : (
              <span className='text-2xl font-bold'>{formattedPrice}</span>
            )}
          </div>

          <Separator />

          <div className='space-y-4'>
            <p className='text-muted-foreground'>{product.details === null ? product.name : product.details}</p>
          </div>

          <div className='pt-4'>
            <ProductQuantity product={product} />
          </div>

          <div className='flex items-center gap-2 pt-2 text-sm text-muted-foreground'>
            <Info className={iconVariants({ size: 'sm' })} /> {/* Use direct import + CVA */}
            <span>الشحن خلال 3-5 أيام عمل</span>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className='mt-12'>
        <Tabs defaultValue='details'>
          <TabsList className='w-full justify-start'>
            <TabsTrigger value='details'>التفاصيل</TabsTrigger>
            <TabsTrigger value='reviews'>التقييمات ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='py-4'>
            <div className='prose prose-sm max-w-none'>
              <h3>معلومات المنتج</h3>
              <p>{product.details || product.name}</p>

              <div className='mt-6 grid grid-cols-1 gap-8 md:grid-cols-2'>
                <div>
                  <h4>المواصفات</h4>
                  <ul>
                    <li>المورد: {product.supplier?.name || 'غير محدد'}</li>
                    <li>رمز المنتج: {product.productCode || product.id.substring(0, 8)}</li>
                    {product.size && <li>المقاس: {product.size}</li>}
                    {product.material && <li>الخامة: {product.material}</li>}
                    {product.brand && <li>الماركة: {product.brand}</li>}
                    {product.features && product.features.length > 0 && (
                      <li>
                        المميزات:
                        <ul className='ml-4 mt-1 list-inside list-disc'>
                          {product.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </li>
                    )}
                    {product.careInstructions && (
                      <li>تعليمات العناية: {product.careInstructions}</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4>الشحن والإرجاع</h4>
                  <ul>
                    <li>الشحن خلال {product.shippingDays || '3-5'} أيام عمل</li>
                    <li>إمكانية الإرجاع خلال {product.returnPeriodDays || 14} يوم</li>
                    {product.hasQualityGuarantee !== false && <li>ضمان الجودة</li>}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='reviews' className='py-4'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>تقييمات المنتج</h3>
                {session?.user && (
                  <RateProductButton
                    productId={product.id}
                    productName={product.name}
                    productImage={mainImage}
                  />
                )}
              </div>

              {reviews.length === 0 ? (
                <div className='rounded-lg bg-muted/30 py-12 text-center'>
                  <Star className={iconVariants({ size: 'xl', className: 'mx-auto mb-4 text-amber-400' })} /> {/* Use direct import + CVA */}
                  <h3 className='mb-2 text-lg font-medium'>لا توجد تقييمات بعد</h3>
                  <p className='mb-6 text-muted-foreground'>
                    كن أول من يقيم هذا المنتج وشارك تجربتك مع الآخرين
                  </p>
                  {session?.user ? (
                    <RateProductButton
                      productId={product.id}
                      productName={product.name}
                      productImage={mainImage}
                      variant='default'
                      size='lg'
                      showIcon
                      buttonText='إضافة تقييم'
                    />
                  ) : (
                    <Button asChild>
                      <a href={`/auth/login?redirect=/product/${product.slug}`}>
                        تسجيل الدخول لإضافة تقييم
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <div className='space-y-6'>
                  {reviews.map((review) => (
                    <div key={review.id} className='border-b border-border pb-6 last:border-0'>
                      <div className='flex items-start gap-4'>
                        <div className='relative h-10 w-10 overflow-hidden rounded-full bg-muted'>
                          {review.user?.image ? (
                            <Image
                              src={review.user.image}
                              alt={review.user.name || 'مستخدم'}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <span className='flex h-full w-full items-center justify-center text-xl font-medium'>
                              {(review.user?.name || 'م')[0]}
                            </span>
                          )}
                        </div>

                        <div className='flex-1'>
                          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                            <div>
                              <h4 className='font-medium'>{review.user?.name || 'مستخدم'}</h4>
                              <div className='mt-1 flex items-center gap-2'>
                                <RatingDisplay rating={review.rating} showCount={false} size='sm' />
                                {review.isVerified && (
                                  <Badge
                                    variant='outline'
                                    className='border-green-300 bg-green-100 text-green-800'
                                  >
                                    مشتري مؤكد
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                            </div>
                          </div>

                          <p className='mt-3 text-muted-foreground'>{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className='mt-16'>
        <h2 className='mb-6 text-xl font-bold'>منتجات مشابهة</h2>
        <RelatedProducts currentProductId={product.id} supplierId={product.supplierId} />
      </div>
    </div>
  );
}
