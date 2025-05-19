import { redirect } from 'next/navigation';
import { ShoppingBag, Star } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

import { auth } from '@/auth';
// Removed Icon import: import { Icon } from '@/components/icons';
import { getUserPurchaseHistory } from './actions';
import PurchaseHistoryList from './components/PurchaseHistoryList';
import Link from '@/components/link';

export const metadata = {
  title: 'سجل المشتريات | المتجر الإلكتروني',
  description: 'عرض سجل مشترياتك السابقة وتقييم المنتجات التي اشتريتها',
};

export default async function PurchaseHistoryPage() {
  // Get the current user
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/auth/login?redirect=/user/purchase-history');
  }

  // Get the user's purchase history
  const userId = session.user.id;
  if (!userId) {
    redirect('/auth/login?redirect=/user/purchase-history');
  }
  const purchaseHistory = await getUserPurchaseHistory(userId);

  return (
    <div className='container mx-auto max-w-4xl py-8'>
      <div className='mb-8 flex items-center gap-3'>
        <div className='rounded-full bg-primary/10 p-2'>
          <ShoppingBag className={iconVariants({ size: 'md', variant: 'primary' })} /> {/* Use direct import + CVA */}
        </div>
        <h1 className='text-2xl font-bold'>سجل المشتريات</h1>
      </div>

      {purchaseHistory.length === 0 ? (
        <div className='rounded-lg bg-muted/30 py-12 text-center'>
          <ShoppingBag className={iconVariants({ size: 'xl', variant: 'muted', className: 'mx-auto mb-4' })} /> {/* Use direct import + CVA */}
          <h2 className='mb-2 text-xl font-medium'>لا توجد مشتريات سابقة</h2>
          <p className='mb-6 text-muted-foreground'>
            لم تقم بشراء أي منتجات بعد. تصفح المتجر واستمتع بالتسوق!
          </p>
          <Link
            href='/'
            className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90'
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <>
          <div className='mb-6 flex items-center gap-3 rounded-lg bg-muted/20 p-4'>
            <Star className={iconVariants({ size: 'sm', variant: 'warning' })} /> {/* Use direct import + CVA */}
            <p className='text-sm'>يمكنك تقييم المنتجات التي اشتريتها لمساعدة المتسوقين الآخرين</p>
          </div>

          <PurchaseHistoryList purchases={purchaseHistory} />
        </>
      )}
    </div>
  );
}
