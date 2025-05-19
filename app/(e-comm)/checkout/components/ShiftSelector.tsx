// components/ShiftSelector.tsx
'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Shift } from '../../../../types/shift';
import { getAvailableShifts } from '../actions/shiftActions';

interface ShiftSelectorProps {
  selectedShiftId: string;
  onShiftSelect: (selectedShiftId: string) => void;


export const ShiftSelector = ({ selectedShiftId, onShiftSelect }: ShiftSelectorProps) => {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const fetchShifts = async () => {
      const shiftsData = await getAvailableShifts();
      setShifts(shiftsData);
      if (shiftsData.length > 0 && !selectedShiftId) {
        onShiftSelect(shiftsData[0].id); // Auto-select first shift
      }
    };
    fetchShifts();
  }, [onShiftSelect, selectedShiftId]);

  return (
    <Select value={selectedShiftId} onValueChange={onShiftSelect}>
      <SelectTrigger className='w-full bg-input'>
        <SelectValue placeholder='Select delivery time' />
      </SelectTrigger>
      <SelectContent>
        {shifts.map((shift) => (
          <SelectItem key={shift.id} value={shift.id}>
            {`${shift.startTime} - ${shift.endTime}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
