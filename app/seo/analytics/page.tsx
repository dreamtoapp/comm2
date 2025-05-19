// app/seo/analytics/page.tsx
import type { Metadata } from 'next';
import { getAnalyticsSettings } from '@/app/seo/actions/settings-actions';
import AnalyticsSettingsForm from './components/AnalyticsSettingsForm';

export const metadata: Metadata = {
  title: 'Analytics & Tracking Settings',
  description: 'Manage site-wide analytics and tracking configurations.',
};

export default async function AnalyticsPage() {
  const settings = await getAnalyticsSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className='text-3xl font-bold'>Analytics & Tracking</h1>
        <p className='mt-1 text-muted-foreground'>
          Configure site-wide analytics IDs and verification tags.
        </p>
      </div>
      <AnalyticsSettingsForm initialSettings={settings} />
    </div>
  );
}
