import React from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

import { Button } from '@/components/ui/button';
// Removed Icon import: import { Icon } from '@/components/icons';

export default function ProductRowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className='flex gap-2'>
      <Button variant='outline' size='icon' onClick={onEdit} title='تعديل المنتج'>
        <MoreHorizontal className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
      </Button>
      <Button variant='destructive' size='icon' onClick={onDelete} title='حذف المنتج'>
        <span className='sr-only'>حذف</span>
        <Trash2 className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
      </Button>
    </div>
  );
}
