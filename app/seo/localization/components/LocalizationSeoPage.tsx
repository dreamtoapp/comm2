// app/seo/localization/components/LocalizationSeoPage.tsx
'use client';

import { type Metadata } from 'next';

import LocalizationSeoFormFields
  from '@/app/seo/components/edit-forms/localization-seo-form-fields';

export const metadata: Metadata = {
  title: 'Localization SEO',
  description: 'Manage localization SEO settings for your website.',
};

export default function LocalizationSeoPage() {
  return (
    <div>
      <h1>Localization SEO</h1>
      <LocalizationSeoFormFields
        formData={{
          defaultLanguage: '',
          supportedLanguages: [],
          hreflang: '',
        }}
        errors={{}}
        handleChange={() => { }}
        handleArrayChange={() => { }}
        addToArray={() => { }}
        removeFromArray={() => { }}
      />
    </div>
  );
}
