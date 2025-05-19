'use client'; // Mark as a Client Component
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import DeleteDriverAlert from './DeleteDriverAlert';
import EditDriverDialog from './EditDriverDialog';

interface DriverCardProps {
  driver: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    password?: string | null;
    imageUrl?: string | null;
  };
}

export default function DriverCard({ driver }: DriverCardProps) {
  return (
    <Card className='overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-md transition-shadow hover:shadow-lg'>
      {/* Card Header */}
      <CardHeader className='border-b border-border bg-muted/50 p-4'>
        <CardTitle className='line-clamp-1 text-lg font-semibold text-primary'>
          {driver.name}
        </CardTitle>
      </CardHeader>

      {/* Card Content */}
      <CardContent className='space-y-4 p-4'>
        {/* Image */}
        <div className='relative h-48 w-full overflow-hidden rounded-lg bg-muted/20'>
          {driver.imageUrl ? (
            <Image
              src={driver.imageUrl}
              alt={`${driver.name}'s profile`}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover object-center transition-transform duration-300 hover:scale-105'
            // onError={(e) => {
            //   e.currentTarget.src = "/default-driver.jpg"; // Fallback image
            // }}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-muted/50'>
              <span className='text-muted-foreground'>No Image</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className='space-y-2'>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <strong className='font-medium'>Email:</strong> {driver.email}
          </p>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <strong className='font-medium'>Phone:</strong> {driver.phone}
          </p>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className='flex justify-between border-t border-border bg-muted/50 p-4'>
        {/* Edit Driver Dialog */}
        <EditDriverDialog driver={driver}>
          <button className='flex items-center gap-1 text-primary hover:underline'>
            <Pencil className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */} Edit
          </button>
        </EditDriverDialog>

        {/* Delete Driver Alert */}
        <DeleteDriverAlert driverId={driver.id}>
          <button className='flex items-center gap-1 text-destructive hover:underline'>
            <Trash2 className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */} Delete
          </button>
        </DeleteDriverAlert>
      </CardFooter>
    </Card>
  );
}
