// Keep only one set of date-fns imports
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Star } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { auth } from '@/auth';
import RatingDisplay from '@/components/rating/RatingDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { getUserReviews } from '../../product/actions/rating';
import Link from '@/components/link';

export const metadata = {
  title: 'تقييماتي | المتجر الإلكتروني',
  description: 'عرض تقييماتك للمنتجات',
};

export default async function UserRatingsPage() {
  // Get the current user
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/auth/login?redirect=/user/ratings');
  }

  // Get the user's reviews
  const userId = session.user.id;
  if (!userId) {
    redirect('/auth/login?redirect=/user/ratings');
  }
  const reviews = await getUserReviews(userId);

  return (
    <div className='container mx-auto max-w-4xl py-8'>
      <div className='mb-8 flex items-center gap-3'>
        <div className='rounded-full bg-amber-100 p-2'>
          <Star className={iconVariants({ size: 'md', variant: 'warning' })} /> {/* Use direct import + CVA */}
        </div>
        <h1 className='text-2xl font-bold'>تقييماتي</h1>
      </div>

      {reviews.length === 0 ? (
        <div className='rounded-lg bg-muted/30 py-12 text-center shadow-sm'>
          <Star className={iconVariants({ size: 'xl', variant: 'warning', className: 'mx-auto mb-4 opacity-80' })} /> {/* Use direct import + CVA */}
          <h2 className='mb-2 text-xl font-medium'>لا توجد تقييمات</h2>
          <p className='mb-6 text-muted-foreground'>
            لم تقم بتقييم أي منتجات بعد. يمكنك تقييم المنتجات التي اشتريتها من صفحة سجل المشتريات.
          </p>
          <Link
            href='/user/purchase-history'
            className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90'
          >
            سجل المشتريات
          </Link>
        </div>
      ) : (
        <div className='space-y-6 rounded-lg bg-card p-6 shadow-sm'>
          <h2 className='mb-4 text-lg font-medium'>تقييماتك ({reviews.length})</h2>
          <Separator />

          <div className='space-y-6'>
            {reviews.map((review) => (
              <div
                key={review.id}
                className='flex flex-col gap-4 border-b border-border pb-6 last:border-0 last:pb-0 sm:flex-row'
              >
                <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md'>
                  <Image
                    src={review.product?.imageUrl || '/fallback/product-fallback.avif'}
                    alt={review.product?.name || 'منتج'}
                    fill
                    className='object-cover'
                  />
                </div>

                <div className='flex-1'>
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <h3 className='font-medium'>
                      <Link
                        href={`/product/${review.product?.slug || review.productId}`}
                        className='hover:underline'
                      >
                        {review.product?.name || 'منتج غير متوفر'}
                      </Link>
                    </h3>
                    <div className='text-xs text-muted-foreground'>
                      {format(new Date(review.createdAt), 'd MMMM yyyy', { locale: ar })}
                    </div>
                  </div>

                  <div className='my-2 flex items-center gap-2'>
                    <RatingDisplay rating={review.rating} showCount={false} size='sm' />
                    <Badge
                      variant='outline'
                      className={
                        review.isVerified
                          ? 'border-green-300 bg-green-100 text-green-800'
                          : 'border-amber-300 bg-amber-100 text-amber-800'
                      }
                    >
                      {review.isVerified ? 'مشتري مؤكد' : 'غير مؤكد'}
                    </Badge>
                  </div>

                  <p className='mt-2 text-sm text-muted-foreground'>{review.comment}</p>

                  <div className='mt-3'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-primary/20 text-primary hover:bg-primary/10'
                      asChild
                    >
                      <Link href={`/product/${review.product?.slug || review.productId}`}>
                        عرض المنتج
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
