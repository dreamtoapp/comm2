import { memo } from 'react';
import { Check } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';

// Optimized notification using CSS animations instead of framer-motion
const Notification = memo(({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div
      className={`absolute left-0 right-0 top-0 z-10 flex animate-slideUp items-center justify-between bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900 dark:text-green-200`}
      style={{
        willChange: 'transform, opacity',
        contain: 'content',
      }}
    >
      <span className='text-sm font-medium'>تمت الإضافة!</span>
      <Check className={iconVariants({ size: 'xs', className: 'text-green-600 dark:text-green-400' })} /> {/* Use direct import + CVA */}
    </div>
  );
});

export default Notification;
Notification.displayName = 'Notification'
