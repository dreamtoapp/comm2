import React from 'react';

import { Search, Undo2 } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
// Removed Icon import: import { Icon } from '@/components/icons';

interface ProductFiltersProps {
  value: string;
  onChange: (name: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  type: string;
  onTypeChange: (type: string) => void;
  stock: string;
  onStockChange: (stock: string) => void;
  onReset?: () => void; // Optional reset handler
}

export default function ProductFilters({
  value,
  onChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  stock,
  onStockChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <div className='w-full'>
      <p className='mb-1 select-none text-right text-xs text-muted-foreground'>
        فلترة المنتجات (بحث، حالة المنتج، نوع المنتج، المخزون)
      </p>
      {/* Removed bg-white and shadow from this div, parent now provides card styling */}
      <div className='mb-2 flex flex-wrap items-center justify-end gap-2 rounded-lg px-1 py-1'>
        {/* Search input fills remaining space */}
        <div className='flex min-w-[180px] flex-1 items-center gap-2'>
          <Search className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import + CVA */}
          <input
            className='w-full rounded border border-input bg-input px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
            type='text'
            placeholder='بحث باسم المنتج...'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ direction: 'rtl' }}
          />
        </div>
        {/* Status filter */}
        <select
          className='min-w-[110px] rounded border border-input bg-input px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value='all'>كل الحالات</option>
          <option value='published'>منشور</option>
          <option value='unpublished'>غير منشور</option>
        </select>
        {/* Type filter */}
        <select
          className='min-w-[110px] rounded border border-input bg-input px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value='all'>كل الأنواع</option>
          <option value='company'>مورد</option>
          <option value='offer'>عرض</option>
        </select>
        {/* Stock filter */}
        <select
          className='min-w-[110px] rounded border border-input bg-input px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
          value={stock}
          onChange={(e) => onStockChange(e.target.value)}
        >
          <option value='all'>كل المخزون</option>
          <option value='in'>متوفر</option>
          <option value='out'>غير متوفر</option>
        </select>
        {/* Reset button as icon with tooltip */}
        {onReset && (
          <Tooltip>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='text-primary hover:bg-primary/10'
              title='إعادة تعيين الفلاتر'
              onClick={onReset}
            >
              <Undo2 className={iconVariants({ size: 'sm' })} /> {/* Use direct import + CVA */}
              <span className='sr-only'>إعادة تعيين الفلاتر</span>
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
