// app/seo/localization/page.tsx
import type { Metadata } from 'next';
import { getAllSeoEntries } from '@/app/seo/actions/seo';
import LocalizationSeoEditor from './components/LocalizationSeoEditor'; // New client component

export const metadata: Metadata = {
  title: 'Localization SEO Settings',
  description: 'Manage localization SEO for existing pages.',
};

export default async function LocalizationSeoPageContainer() {
  const seoEntries = await getAllSeoEntries();

  const entryOptions = seoEntries.map(entry => ({
    id: entry.id,
    label: `${entry.entityId} (${entry.metaTitle || 'No title'})`,
    value: entry.id,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className='text-3xl font-bold'>Localization SEO Editor</h1>
        <p className='mt-1 text-muted-foreground'>
          Select a page to configure its localization SEO settings.
        </p>
      </div>
      <LocalizationSeoEditor seoEntryOptions={entryOptions} />
    </div>
  );
}
