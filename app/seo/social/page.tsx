// app/seo/social/page.tsx
import type { Metadata } from 'next';
import { getAllSeoEntries } from '@/app/seo/actions/seo';
import SocialSeoEditor from './components/SocialSeoEditor'; // New client component

export const metadata: Metadata = {
  title: 'Social Media SEO Settings',
  description: 'Manage social media SEO for existing pages.',
};

export default async function SocialSeoPageContainer() {
  const seoEntries = await getAllSeoEntries();

  // We'll pass a simplified list for the select, e.g., { id, entityId, metaTitle }
  const entryOptions = seoEntries.map(entry => ({
    id: entry.id,
    label: `${entry.entityId} (${entry.metaTitle || 'No title'})`, // Combine entityId and metaTitle for display
    value: entry.id,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className='text-3xl font-bold'>Social Media SEO Editor</h1>
        <p className='mt-1 text-muted-foreground'>
          Select a page to configure its social media sharing settings.
        </p>
      </div>
      <SocialSeoEditor seoEntryOptions={entryOptions} />
    </div>
  );
}
