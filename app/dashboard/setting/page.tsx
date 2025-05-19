'use client';
import React, {
  useEffect,
  useState,
} from 'react';

import { useGeolocated } from 'react-geolocated';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { Company } from '../../../types/company';
import { fetchCompany } from './actions/fetchCompany';
import { saveCompany } from './actions/saveCompnay';
import GeneralInfoSection from './component/GeneralInfoSection';
import LocationSection from './component/LocationSection';
import SettingsSkeleton from './component/SettingsSkeleton';
import SocialMediaSection from './component/SocialMediaSection';

// Main Component
export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);

  // Remove isGeolocationEnabled from destructuring as it's unused
  const { coords, isGeolocationAvailable } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await fetchCompany();
        if (data) {
          setCompany(data);
          setLatitude(data.latitude || '');
          setLongitude(data.longitude || '');
        }
      } catch {
        toast.error('فشل تحميل بيانات الشركة.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCompany();
  }, []); // Dependency array ensures this runs only once on mount

  useEffect(() => {
    if (coords && coords.latitude && coords.longitude) {
      setLatitude(coords.latitude.toString());
      setLongitude(coords.longitude.toString());
    }
  }, [coords]); // Dependency array ensures this runs only when `coords` changes

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const requiredFields = ['fullName', 'email', 'phoneNumber', 'address'];
      const newErrors = requiredFields.reduce(
        (acc, field) => {
          if (!formData.get(field)) acc[field] = `يرجى إدخال ${field}.`;
          return acc;
        },
        {} as { [key: string]: string },
      );

      if (Object.keys(newErrors).length) {
        setErrors(newErrors);
        return;
      }

      formData.set('latitude', latitude);
      formData.set('longitude', longitude);

      if (uploadedLogo) {
        formData.set('logo', uploadedLogo);
      }

      await saveCompany(formData);
      toast.success('تم حفظ بيانات الشركة بنجاح!');
    } catch {
      toast.error('فشل حفظ بيانات الشركة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto bg-background p-8 text-foreground'>
      <h1 className='mb-6 text-center text-3xl font-bold'>إعدادات المنصة</h1>

      {isLoading ? (
        <SettingsSkeleton />
      ) : (
        <form action={handleSubmit} className='relative space-y-6'>
          {isSubmitting && (
            <div className='absolute inset-0 z-10 flex items-center justify-center bg-black/50'>
              <div className='h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent' />
            </div>
          )}
          <GeneralInfoSection
            company={company}
            errors={errors}
            onLogoUpload={(files) => { // Update parameter name and logic
              const file = files && files.length > 0 ? files[0] : null;
              setUploadedLogo(file);
            }}
          />
          <SocialMediaSection company={company} />
          <LocationSection
            company={company}
            errors={errors}
            isGeolocationAvailable={isGeolocationAvailable} // Correct prop name
            // isGeolocationEnabled={isGeolocationEnabled} // Remove incorrect prop
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <div className='flex items-center justify-center'>
                <div className='mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                جاري الحفظ...
              </div>
            ) : (
              'حفظ التغييرات'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
