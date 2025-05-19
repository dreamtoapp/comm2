'use client';
import React, { useState } from 'react';
import { Map, MapPinOff } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MapProps {
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number;
}

const GoogleMap = ({ latitude, longitude, }: MapProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check if valid coordinates are provided
  const isLatitudeValid =
    latitude !== undefined && latitude !== null && latitude >= -90 && latitude <= 90;
  const isLongitudeValid =
    longitude !== undefined && longitude !== null && longitude >= -180 && longitude <= 180;
  const hasValidCoordinates = isLatitudeValid && isLongitudeValid;

  // Construct a Google Maps embed URL for high-accuracy display without API key
  const mapUrl = hasValidCoordinates
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=18&output=embed`
    : '';

  return (
    <div>
      {/* Button to Open Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!hasValidCoordinates}
            variant='outline'
            className='flex items-center gap-2'
          >
            {hasValidCoordinates ? (
              <Map className={iconVariants({ size: 'sm' })} /> // Use direct import + CVA
            ) : (
              <MapPinOff className={iconVariants({ size: 'sm' })} /> // Use direct import + CVA
            )}
          </Button>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className='sm:max-w-[800px]'>
          <DialogHeader>
            <DialogTitle>عرض الموقع</DialogTitle>
          </DialogHeader>

          {/* Map Display */}
          {hasValidCoordinates ? (
            <div className='h-[400px] w-full'>
              <iframe
                title='Google Map Location'
                src={mapUrl}
                width='100%'
                height='400'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          ) : (
            <div className='text-red-500'>Invalid coordinates provided.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoogleMap;
