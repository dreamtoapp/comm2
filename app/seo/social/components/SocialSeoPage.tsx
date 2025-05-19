// app/seo/social/components/SocialSeoPage.tsx
'use client';

import { type Metadata } from 'next';

import SocialSeoFormFields from '@/app/seo/components/edit-forms/social-seo-form-fields';

export const metadata: Metadata = {
  title: 'Social SEO',
  description: 'Manage social media SEO settings for your website.',
};

export default function SocialSeoPage() {
  return (
    <div>
      <h1>Social SEO</h1>
      <SocialSeoFormFields
        formData={{
          openGraphTitle: '',
          openGraphDescription: '',
          openGraphImages: [],
          twitterCardType: '',
          twitterSite: '',
          twitterCreator: '',
          twitterTitle: '',
          twitterDescription: '',
          twitterImages: [],
        }}
        errors={{}}
        handleChange={() => {}}
        handleSelectValueChange={() => {}}
        handleArrayChange={() => {}}
        addToArray={() => {}}
        removeFromArray={() => {}}
      />
    </div>
  );
}
