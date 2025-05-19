'use client';

import dynamic from 'next/dynamic';

// Dynamic import for Newsletter (client-only, interactive)
const Newsletter = dynamic(() => import('./Newsletter'), {
  ssr: false,
  loading: () => <div>Loading newsletter…</div>,
});

// Dynamic import for WhatsAppButton (optional, lightweight)
const WhatsAppButton = dynamic(() => import('@/app/(e-comm)/homepage/component/WhatsAppButton'), {
  ssr: false,
  loading: () => null,
});

// Dynamic import for SupportPingButton (optional, lightweight)
// FIX: Use default import for dynamic() when component is exported as named function
const SupportPingButton = dynamic(
  () => import('@/components/SupportPingButton').then((mod) => mod.SupportPingButton),
  {
    ssr: false,
    loading: () => null,
  },
);

import React from 'react';

import { Separator } from '@/components/ui/separator';

import AboutUs from './AboutUs';
import ContactInfo from './ContactInfo';
import Copyright from './Copyright';
import QuickLinks from './QuickLinks';
import SocialMedia from './SocialMedia';

interface FooterProps {
  aboutus?: string;
  email?: string;
  phone?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  companyName?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
}

const Footer = ({
  aboutus,
  email,
  phone,
  whatsapp,
  address,
  latitude,
  longitude,
  facebook,
  instagram,
  twitter,
  linkedin,
  companyName,
}: FooterProps) => {
  return (
    <footer className='bg-background py-12 text-foreground'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Footer Grid */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          <AboutUs aboutus={aboutus} companyName={companyName} />
          <QuickLinks />
          <ContactInfo
            email={email}
            phone={phone}
            address={address}
            latitude={latitude}
            longitude={longitude}
          />

          <Newsletter />
        </div>

        <Separator className='my-6' />

        <SocialMedia
          facebook={facebook}
          instagram={instagram}
          twitter={twitter}
          linkedin={linkedin}
        />

        <Copyright />
        {/* --- Floating Support & WhatsApp Buttons --- */}
        <div className='fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4'>
          {/* Support Ping Button (with badge overlay for timer) */}
          <SupportPingButton userId='guest' />
          {/* WhatsApp Button (large, round, shadow) */}
          {whatsapp && <WhatsAppButton whatsapp={whatsapp} />}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
