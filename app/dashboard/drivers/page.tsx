import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button'; // Import Button from shadcn/ui

import { getDrivers } from './actions/Actions';
import AddDriverDialog from './components/AddDriverDialog';
import DriverCard from './components/DriverCard';

export default async function DriversPage() {
  const drivers = await getDrivers();

  if (!drivers) {
    notFound();
  }

  return (
    <div className='space-y-6 bg-background p-6 text-foreground'>
      {/* Page Title */}
      <h1 className='text-3xl font-bold text-primary'>ادارة السائقين</h1>

      {/* Add New Driver Button */}
      <div className='flex justify-end'>
        <AddDriverDialog>
          <Button variant='default' size='sm' className='flex items-center gap-2'>
            <Plus className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */} اضافة سائق
          </Button>
        </AddDriverDialog>
      </div>

      {/* Driver List */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {drivers.length > 0 ? (
          drivers.map((driver) => <DriverCard key={driver.id} driver={driver} />)
        ) : (
          <div className='col-span-full text-center text-muted-foreground'>
            لا يوجد سائقون متاحون. يرجى إضافة سائق جديد.
          </div>
        )}
      </div>
    </div>
  );
}
