import EmptyBox from '@/components/empty-box';
import { Badge } from '@/components/ui/badge';
import AddOffer from './components/AddOffer';
import OfferCard from './components/offer-card';
import { getOfferCount } from '@/app/dashboard/offer/actions';

// Define the type for the supplier data returned by getOfferCount
interface OfferSupplier {
  id: string;
  name: string;
  logo: string | null; // Matches Prisma schema
  type: string;
  productCount: number;
}


export default async function OfferPage() {
  const suppliers = await getOfferCount();

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Enhanced Sticky Header */}
      <header className='sticky top-0 z-10 border-b border-border bg-background p-4 shadow-sm md:p-6'>
        <div className='flex items-center justify-between'>
          {/* Title and Count */}
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold text-foreground'>العروض الترويجية</h1>
            <Badge variant='destructive' className='shadow-md'>
              {suppliers.length}
            </Badge>
          </div>

          {/* Add Supplier Button */}
          <AddOffer aria-label='إضافة شركة' />
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 space-y-6 p-4 md:p-6'>
        {/* Display Suppliers as Cards */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {suppliers.length > 0 ? (
            suppliers.map((supplier: OfferSupplier) => <OfferCard supplier={supplier} key={supplier.id} />) // Use defined type
          ) : (
            <EmptyBox
              title='لا توجد عروض مضافة بعد'
              description='ابدأ بإضافة العروض باستخدام الزر أعلاه.'
            />
          )}
        </div>
      </main>
    </div>
  );
}
