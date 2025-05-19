import React, { useState } from 'react';
import SupplierSelect from './SupplierSelect';
import { X } from 'lucide-react';
import { toast } from 'sonner';

// Define the shape of the filters object
interface AdvancedFilters {
  status: string;
  stock: string;
  priceMin: string | number; // Can be string from input or number
  priceMax: string | number; // Can be string from input or number
  supplierType: string;
  supplierId: string | null;
}

interface AdvancedProductFiltersModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void; // Use specific type
  initialFilters: Partial<AdvancedFilters>; // Use specific type, allow partial
}

export default function AdvancedProductFiltersModal({
  open,
  onClose,
  onApply,
  initialFilters,
}: AdvancedProductFiltersModalProps) {
  const [status, setStatus] = useState<string>(initialFilters.status ?? 'all');
  const [stock, setStock] = useState<string>(initialFilters.stock ?? 'all');
  const [priceMin, setPriceMin] = useState<string | number>(initialFilters.priceMin ?? '');
  const [priceMax, setPriceMax] = useState<string | number>(initialFilters.priceMax ?? '');
  const [supplierType, setSupplierType] = useState<string>(initialFilters.supplierType ?? 'all');
  const [supplierId, setSupplierId] = useState<string | null>(initialFilters.supplierId ?? null);

  function handleApply() {
    onApply({ status, stock, priceMin, priceMax, supplierType, supplierId });
    toast.success('تم تطبيق التصفية!');
    onClose();
  }

  function handleReset() {
    setStatus('all');
    setStock('all');
    setPriceMin('');
    setPriceMax('');
    setSupplierType('all');
    setSupplierId(null);
    toast.info('تمت إعادة التصفية للوضع الافتراضي');
  }

  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='animate-in fade-in relative w-full max-w-xl rounded-2xl border border-muted bg-white p-8 shadow-2xl dark:bg-zinc-900'>
        <button
          className='absolute left-6 top-6 text-muted-foreground transition hover:text-primary'
          onClick={onClose}
          aria-label='إغلاق'
        >
          <X className='h-6 w-6' />
        </button>
        <h2 className='mb-2 text-center text-2xl font-bold tracking-tight text-primary'>
          تصفية متقدمة
        </h2>
        <p className='mb-8 text-center text-sm text-muted-foreground'>
          اختر ما يناسبك من التصفية، ويمكنك العودة للوضع الافتراضي في أي وقت.
        </p>
        <div className='mb-8 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-medium text-muted-foreground'>المورد</label>
            <SupplierSelect value={supplierId} onChange={setSupplierId} />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-medium text-muted-foreground'>الحالة</label>
            <select
              className='input input-bordered w-full border-blue-300 bg-blue-50 transition-colors duration-150 focus:border-blue-500 focus:ring-blue-200'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value='all'>الكل</option>
              <option value='published'>منشور</option>
              <option value='unpublished'>غير منشور</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-medium text-muted-foreground'>المخزون</label>
            <select
              className='input input-bordered w-full border-blue-300 bg-blue-50 transition-colors duration-150 focus:border-blue-500 focus:ring-blue-200'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            >
              <option value='all'>الكل</option>
              <option value='in'>متوفر</option>
              <option value='out'>غير متوفر</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-medium text-muted-foreground'>نطاق السعر</label>
            <div className='flex gap-2'>
              <input
                className='input input-bordered w-20 border-blue-300 bg-blue-50 transition-colors duration-150 focus:border-blue-500 focus:ring-blue-200'
                type='number'
                min='0'
                placeholder='من'
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <span className='text-xs text-muted-foreground'>-</span>
              <input
                className='input input-bordered w-20 border-blue-300 bg-blue-50 transition-colors duration-150 focus:border-blue-500 focus:ring-blue-200'
                type='number'
                min='0'
                placeholder='إلى'
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 md:col-span-2'>
            <label className='text-xs font-medium text-muted-foreground'>نوع المورد</label>
            <select
              className='input input-bordered w-full max-w-xs border-blue-300 bg-blue-50 transition-colors duration-150 focus:border-blue-500 focus:ring-blue-200'
              value={supplierType}
              onChange={(e) => setSupplierType(e.target.value)}
            >
              <option value='all'>الكل</option>
              <option value='regular'>مورد عادي</option>
              <option value='offer'>عرض</option>
            </select>
          </div>
        </div>
        <div className='mt-2 flex flex-row-reverse justify-start gap-3'>
          <button className='btn btn-primary min-w-[120px]' onClick={handleApply}>
            تطبيق التصفية
          </button>
          <button className='btn btn-outline min-w-[100px]' onClick={onClose}>
            إلغاء
          </button>
          <button className='btn btn-link text-blue-600 hover:underline' onClick={handleReset}>
            إعادة للوضع الافتراضي
          </button>
        </div>
      </div>
    </div>
  );
}
