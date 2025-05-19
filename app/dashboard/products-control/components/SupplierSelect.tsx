'use client';
import React, {
  useEffect,
  useState,
} from 'react';

import Image from 'next/image';

import { fetchSuppliers } from '../actions/fetchSuppliers';

export interface Supplier {
  id: string;
  name: string;
  logo?: string;
  type?: string; // "supplier" or "offer"
}

interface SupplierSelectProps {
  id?: string; // Optional id for the select element
  label?: string; // Optional label text
  value?: string | null;
  onChange: (id: string | null) => void;
  onSupplierCount?: (count: number) => void;
  onAddSupplier?: () => void; // Optional callback to show add supplier dialog
  required?: boolean; // Optional flag to indicate if the field is required
}

export default function SupplierSelect({
  id = 'supplier-select', // Default ID
  label,
  value,
  onChange,
  onSupplierCount,
  onAddSupplier,
  required,
}: SupplierSelectProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    fetchSuppliers().then((data) => {
      setSuppliers(
        data.map((s) => ({
          ...s,
          logo: s.logo ?? undefined,
        })),
      );
      setLoading(false);
      if (onSupplierCount) onSupplierCount(data.length);
    });
  }, [onSupplierCount]); // Added onSupplierCount dependency

  const selected = suppliers.find((s) => s.id === value);

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className='flex h-12 w-full max-w-full flex-row items-center gap-2'>
        {/* Supplier select and info fill the area, same height as filter */}
        <div className='flex h-full min-w-0 flex-1 flex-row items-center gap-1'>
          <select
            id={id}
            className='input input-bordered h-10 min-w-[140px] text-sm'
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            disabled={loading}
            style={{ height: '40px' }}
          >
            <option value=''>-- اختر المورد --</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} {supplier.type === 'offer' ? '(عرض)' : '(مورد)'}
              </option>
            ))}
          </select>
          {/* Hint: Only show if no supplier is selected, not clickable, gentle guidance */}
          {!selected && (
            <p className='ml-2 select-none whitespace-nowrap text-xs text-muted-foreground'>
              يرجى اختيار المورد لإكمال العملية
            </p>
          )}
          {/* Supplier info fills the remaining area */}
          {selected && (
            <div className='flex h-full min-w-0 flex-1 flex-row items-center gap-2 overflow-x-auto rounded-lg border border-border bg-input px-2 py-1 text-foreground'>
              <span className='whitespace-nowrap text-sm font-bold'>{selected.name}</span>
              <span className='whitespace-nowrap text-xs text-muted-foreground'>
                {selected.type === 'offer' ? 'عرض' : 'مورد'}
              </span>
              {selected.logo && (
                <button
                  className='m-0 p-0 transition hover:scale-105'
                  title='عرض صورة المورد'
                  onClick={() => setShowImage(true)}
                  type='button'
                  style={{ lineHeight: 0 }}
                >
                  <Image
                    src={selected.logo!}
                    alt={selected.name}
                    width={26}
                    height={26}
                    className='rounded-full border shadow-sm'
                    style={{ minWidth: 26, minHeight: 26 }}
                  />
                </button>
              )}
              {showImage && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                  <div className='relative rounded-lg bg-popover p-4 shadow-lg text-popover-foreground'>
                    <button
                      className='absolute left-3 top-3 text-muted-foreground hover:text-foreground'
                      onClick={() => setShowImage(false)}
                    >
                      &times;
                    </button>
                    <Image
                      src={selected.logo!}
                      alt={selected.name}
                      width={180}
                      height={180}
                      className='mx-auto rounded-xl border'
                    />
                    <div className='mt-2 text-center text-sm'>{selected.name}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
