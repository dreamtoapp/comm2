import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
import { auth } from '@/auth';
import { getUserWishlist } from '@/app/(e-comm)/product/actions/wishlist';
// Removed Icon import: import { Icon } from '@/components/icons';
import ProductCard from '@/components/product/ProductCard';
import Link from '@/components/link';

export const metadata = {
  title: 'المفضلة | المتجر الإلكتروني',
  description: 'عرض المنتجات المفضلة لديك',
};

export default async function WishlistPage() {
  // Get the current user
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/auth/login?redirect=/user/wishlist');
  }

  // Get the user's wishlist
  const wishlistProducts = await getUserWishlist();

  return (
    <div className='container mx-auto max-w-6xl py-8'>
      <div className='mb-8 flex items-center gap-3'>
        <div className='rounded-full bg-red-100 p-2'>
          <Heart className={iconVariants({ size: 'md', variant: 'destructive' })} /> {/* Use direct import + CVA */}
        </div>
        <h1 className='text-2xl font-bold'>المفضلة</h1>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className='rounded-lg bg-muted/30 py-12 text-center shadow-sm'>
          <Heart className={iconVariants({ size: 'xl', variant: 'destructive', className: 'mx-auto mb-4 opacity-80' })} /> {/* Use direct import + CVA */}
          <h2 className='mb-2 text-xl font-medium'>لا توجد منتجات في المفضلة</h2>
          <p className='mb-6 text-muted-foreground'>
            لم تقم بإضافة أي منتجات إلى المفضلة بعد. تصفح المتجر وأضف المنتجات التي تعجبك!
          </p>
          <Link
            href='/'
            className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90'
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {wishlistProducts.map((product) => (
            <div key={product.id} className='relative'>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
