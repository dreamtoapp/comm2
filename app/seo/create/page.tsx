import type { Metadata } from 'next';

import CreateSeoForm from '@/app/seo/components/create-seo-form'; // Changed import
import Link from '@/components/link';

// EntityType and IndustryType are not directly used here anymore, as CreateSeoForm handles defaults

// import { generateEntityId } from '../../../utils/seo';

export const metadata: Metadata = {
  title: 'Create SEO Entry',
  description: 'Create a new SEO entry for your website',
};

export default function CreateSeoPage() {
  // Generate a default entity ID
  // const defaultEntityId = generateEntityId();

  return (
    <div className='container mx-auto px-4 py-10 text-foreground'> {/* Use semantic text color */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <Link href='/seo' className='mr-2 text-primary hover:text-primary/90'> {/* Use primary color for links */}
            ← Back to SEO Entries
          </Link>
        </div>
        <h1 className='text-3xl font-bold'>Create SEO Entry</h1>
        <p className='mt-1 text-muted-foreground'>Create a new SEO entry for your website</p> {/* Use muted foreground for secondary text */}
      </div>
      <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'> {/* Use card styles */}
        <CreateSeoForm />
      </div>
    </div>
  );
}
