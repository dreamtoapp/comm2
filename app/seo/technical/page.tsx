// app/seo/technical/page.tsx
import type { Metadata } from 'next';
import { getAllSeoEntries } from '@/app/seo/actions/seo';
import TechnicalSeoEditor from './components/TechnicalSeoEditor'; // New client component

export const metadata: Metadata = {
  title: 'Technical SEO Settings',
  description: 'Manage technical SEO for existing pages.',
};

export default async function TechnicalSeoPageContainer() {
  const seoEntries = await getAllSeoEntries();

  const entryOptions = seoEntries.map(entry => ({
    id: entry.id,
    label: `${entry.entityId} (${entry.metaTitle || 'No title'})`,
    value: entry.id,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className='text-3xl font-bold'>Technical SEO Editor</h1>
        <p className='mt-1 text-muted-foreground'>
          Select a page to configure its technical SEO settings.
        </p>
      </div>
      <TechnicalSeoEditor seoEntryOptions={entryOptions} />
    </div>
  );
}
