'use client';
import { Package } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import MenuList from './MenuList';

interface DriverHeaderProps {
  orderCount?: number;
  drivername?: string;
  onRefresh?: () => void; // Callback for refresh action
  inWayOrders: number;
  canceledOrders: number;
  deliveredOrders: number;
  driverId: string;
}

const DriverHeader = ({
  drivername = 'السائق',
  inWayOrders,
  canceledOrders,
  deliveredOrders,
  driverId,
}: DriverHeaderProps) => {
  return (
    <header className='fixed top-0 z-50 w-full bg-gradient-to-b from-primary to-primary/90 px-4 py-2 shadow-lg'>
      <div className='flex w-full items-center justify-between'>
        {/* Start (Right in RTL): Driver's name with icon */}
        <div className='flex items-center gap-2'>
          <Package className={iconVariants({ size: 'xl', variant: 'muted', className: 'text-primary-foreground' })} /> {/* Use direct import + CVA (adjust size/variant if needed) */}
          <span className='text-sm font-medium text-primary-foreground'>{drivername}</span>
        </div>

        {/* End (Left in RTL): Order count and refresh button */}
        <div className='flex items-center gap-3'>
          {/* Refresh button with timer*/}
          <MenuList
            inWayOrders={inWayOrders}
            canceledOrders={canceledOrders}
            deliveredOrders={deliveredOrders}
            driverId={driverId}
          />
        </div>
      </div>
      <div className='mt-2 h-[1px] w-full bg-primary-foreground/10' />
    </header>
  );
};

export default DriverHeader;
