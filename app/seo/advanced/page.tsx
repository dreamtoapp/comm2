// app/seo/advanced/page.tsx
import type { Metadata } from 'next';
import { getAllSeoEntries } from '@/app/seo/actions/seo';
import AdvancedSeoEditor from './components/AdvancedSeoEditor'; // New client component

export const metadata: Metadata = {
  title: 'Advanced SEO Settings',
  description: 'Manage advanced SEO settings like Schema.org and industry-specific data.',
};

export default async function AdvancedSeoPageContainer() {
  const seoEntries = await getAllSeoEntries();

  const entryOptions = seoEntries.map(entry => ({
    id: entry.id,
    label: `${entry.entityId} (${entry.metaTitle || 'No title'})`,
    value: entry.id,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className='text-3xl font-bold'>Advanced SEO Editor</h1>
        <p className='mt-1 text-muted-foreground'>
          Select a page to configure its advanced SEO settings.
        </p>
      </div>
      <AdvancedSeoEditor seoEntryOptions={entryOptions} />
    </div>
  );
}
