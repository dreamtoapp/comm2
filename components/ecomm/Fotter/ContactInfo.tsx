'use client';

import React from 'react';

import dynamic from 'next/dynamic';

// Dynamic import for Map (potentially heavy component)
const Map = dynamic(() => import('../../GoogleMap'), {
  ssr: false,
  loading: () => <div>Loading map…</div>,
});

const ContactInfo = ({
  email,
  phone,
  address,
  latitude,
  longitude,
}: {
  email?: string;
  phone?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
}) => {


  return (
    <div className='text-center sm:text-right'>
      <h3 className='mb-4 text-lg font-semibold'>تواصل معنا</h3>
      <p className='text-sm text-muted-foreground'>{email}</p>
      <p className='text-sm text-muted-foreground'>{phone}</p>
      <p className='text-sm text-muted-foreground'>{address}</p>
      {/* Professional Button to Open Dialog */}
      <Map
        latitude={latitude ? parseFloat(latitude) : null}
        longitude={longitude ? parseFloat(longitude) : null}
      />
    </div>
  );
};

export default ContactInfo;
