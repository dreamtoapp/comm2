// SelectDriver.tsx
'use client';
import { PersonStanding } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
// Removed Icon import: import { Icon } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Driver {
  id: string;
  name: string;
}
interface SelectDriverProps {
  drivers: Driver[];
  selectedDriverId?: string;
  setSelectedDriverId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function Drivers({ drivers, selectedDriverId, setSelectedDriverId }: SelectDriverProps) {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex items-center gap-2'>
        <PersonStanding className={iconVariants({ size: 'sm' })} /> {/* Use direct import + CVA (adjust size if needed) */}
        <p>اختار السائق</p>
      </div>
      <Select value={selectedDriverId} onValueChange={(value) => setSelectedDriverId(value)}>
        <SelectTrigger className='text-foreground'>
          <SelectValue placeholder='اختر السائق' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>السائقون المتاحون</SelectLabel>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
