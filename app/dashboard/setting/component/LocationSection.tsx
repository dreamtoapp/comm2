'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { MapPin, Navigation, Target, Loader2, CheckCircle } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
// Removed Icon import: import { Icon } from '@/components/icons';
import Map from '../../../../components/GoogleMap';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import useAccurateGeolocation from '../../../../hooks/use-geo';
import { Company } from '../../../../types/company';

interface FormErrors {
  address?: string;
  latitude?: string;
  longitude?: string;
  [key: string]: string | undefined;
}

interface LocationSectionProps {
  company: Company | null;
  errors: FormErrors;
  isGeolocationAvailable: boolean;
  latitude: string;
  longitude: string;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
}

const LocationSection = ({
  company,
  errors,
  isGeolocationAvailable,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}: LocationSectionProps) => {
  const {
    geoLatitude,
    geoLongitude,
    geoError,
    geoIsLoading,
    getGeolocation,
  } = useAccurateGeolocation({
    accuracyThreshold: 10,
    maxRetries: 1,
  });

  useEffect(() => {
    getGeolocation();
  }, [getGeolocation]);

  const isValidCoordinate = (value: string) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidCoordinate(value)) setLatitude(value);
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidCoordinate(value)) setLongitude(value);
  };

  const handleApproveCoordinates = () => {
    if (geoLatitude && geoLongitude) {
      setLatitude(geoLatitude.toFixed(7));
      setLongitude(geoLongitude.toFixed(7));
      toast.success('تم اعتماد الإحداثيات بنجاح');
    }
  };

  return (
    <Card className='relative'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2'>
          <MapPin className={iconVariants({ size: 'sm' })} /> {/* Use direct import + CVA */}
          <span>الموقع الجغرافي</span>
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='address' className='flex items-center gap-2 text-muted-foreground'>
            <Navigation className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
            العنوان التفصيلي
          </Label>
          <Input
            id='address'
            name='address'
            defaultValue={company?.address}
            aria-invalid={!!errors.address}
            placeholder='مثال: الرياض - حي الملقا - شارع الملك فهد'
            className='h-12'
          />
          {errors.address && (
            <p className='mt-1 flex items-center gap-1 text-xs text-red-500'>
              <Target className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA (adjust size if needed) */}
              {errors.address}
            </p>
          )}
        </div>

        <div className='rounded-lg border bg-muted/50 p-4'>
          <p className='font-bold text-primary underline underline-offset-4'>اتوماتيك</p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <Label className='flex items-center gap-2 text-sm font-medium'>
                <span className='text-muted-foreground'>خط العرض</span>
                <span className='text-primary'>
                  {geoLatitude?.toFixed(7) || '--'}
                </span>
              </Label>
            </div>

            <div>
              <Label className='flex items-center gap-2 text-sm font-medium'>
                <span className='text-muted-foreground'>خط الطول</span>
                <span className='text-primary'>
                  {geoLongitude?.toFixed(7) || '--'}
                </span>
              </Label>
            </div>

            {geoError && (
              <div className='flex items-center gap-2 rounded-md bg-red-50 text-sm text-red-600'>
                <Target className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
                {geoError}
              </div>
            )}
          </div>

          <div className='flex w-full items-center justify-end gap-4'>
            <Button
              type='button'
              onClick={getGeolocation}
              disabled={geoIsLoading || !isGeolocationAvailable}
              className='h-12 gap-2'
              variant={geoError ? 'destructive' : 'default'}
            >
              {geoIsLoading ? (
                <>
                  <Loader2 className={iconVariants({ size: 'xs', animation: 'spin' })} /> {/* Use direct import + CVA */}
                  جاري البحث...
                </>
              ) : (
                <>
                  <Target className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
                  {geoError ? 'إعادة المحاولة' : 'تحديد الموقع'}
                </>
              )}
            </Button>

            <Button
              type='button'
              onClick={handleApproveCoordinates}
              disabled={!geoLatitude || !geoLongitude}
              className='h-12 gap-2 bg-green-600 text-white hover:bg-green-700'
            >
              <CheckCircle className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
              اعتماد الإحداثيات
            </Button>
          </div>
        </div>

        <div className='rounded-lg border bg-muted/50 p-4'>
          <p className='font-bold text-primary underline underline-offset-8'>يدوي</p>
          <div className='grid grid-cols-1 items-end gap-4 rounded-md bg-secondary p-2 md:grid-cols-4'>
            <div className='space-y-2'>
              <Label htmlFor='latitude'>إدخال خط العرض</Label>
              <Input
                id='latitude'
                name='latitude'
                value={latitude}
                onChange={handleLatitudeChange}
                placeholder='مثال: 24.7136'
                pattern='-?\d*\.?\d*'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='longitude'>إدخال خط الطول</Label>
              <Input
                id='longitude'
                name='longitude'
                value={longitude}
                onChange={handleLongitudeChange}
                placeholder='مثال: 46.6753'
                pattern='-?\d*\.?\d*'
              />
            </div>

            {latitude && longitude && (
              <Map
                latitude={parseFloat(latitude)}
                longitude={parseFloat(longitude)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
