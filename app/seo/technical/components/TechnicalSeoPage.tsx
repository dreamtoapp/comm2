// app/seo/technical/components/TechnicalSeoPage.tsx
'use client';

import { type Metadata } from 'next';

import TechnicalSeoFormFields from '@/app/seo/components/edit-forms/technical-seo-form-fields';

export const metadata: Metadata = {
  title: 'Technical SEO',
  description: 'Manage technical SEO settings for your website.',
};

export default function TechnicalSeoPage() {
  return (
    <div>
      <h1>Technical SEO</h1>
      <TechnicalSeoFormFields
        formData={{
          securityHeaders: [],
          preloadAssets: [],
          httpEquiv: [],
        }}
        errors={{}}
        handleArrayChange={() => { }}
        addToArray={() => { }}
        removeFromArray={() => { }}
      />
    </div>
  );
}
