// app/seo/analytics/components/AnalyticsSettingsForm.tsx
'use client';

import { useEffect, useState, useActionState } from 'react';
import ReactSwal from '@/lib/swal-config';
import { updateAnalyticsSettings, UpdateAnalyticsSettingsResult } from '@/app/seo/actions/settings-actions';
import { AnalyticsFormTooltips } from '@/app/seo/constant/analytics-tooltip-content';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AnalyticsSettings } from '@prisma/client';

type AnalyticsSettingsFormProps = {
  initialSettings: AnalyticsSettings | null;
};

const initialActionState: UpdateAnalyticsSettingsResult = {
  success: false,
  errors: null,
  message: '',
  data: null,
};

export default function AnalyticsSettingsForm({ initialSettings }: AnalyticsSettingsFormProps) {
  const [formData, setFormData] = useState({
    googleAnalyticsId: initialSettings?.googleAnalyticsId || '',
    googleTagManagerId: initialSettings?.googleTagManagerId || '',
    facebookPixelId: initialSettings?.facebookPixelId || '',
    googleSiteVerificationId: initialSettings?.googleSiteVerificationId || '',
    bingSiteVerificationId: initialSettings?.bingSiteVerificationId || '',
    tiktokPixelId: initialSettings?.tiktokPixelId || '', // Added
    snapchatPixelId: initialSettings?.snapchatPixelId || '', // Added
  });

  const [state, formAction, isPending] = useActionState(updateAnalyticsSettings, initialActionState);

  useEffect(() => {
    if (state.success && state.message) {
      ReactSwal.fire('Success!', state.message, 'success');
      if (state.data) {
        setFormData({
          googleAnalyticsId: state.data.googleAnalyticsId || '',
          googleTagManagerId: state.data.googleTagManagerId || '',
          facebookPixelId: state.data.facebookPixelId || '',
          googleSiteVerificationId: state.data.googleSiteVerificationId || '',
          bingSiteVerificationId: state.data.bingSiteVerificationId || '',
          tiktokPixelId: state.data.tiktokPixelId || '', // Added
          snapchatPixelId: state.data.snapchatPixelId || '', // Added
        });
      }
    } else if (!state.success && state.message) {
      ReactSwal.fire('Error!', state.message, 'error');
    }
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form action={formAction}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analytics Platform IDs</CardTitle>
          <CardDescription>Enter your tracking IDs for various analytics platforms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID (GA4)</Label>
              <InfoTooltip content={AnalyticsFormTooltips.googleAnalyticsId} />
            </div>
            <Input
              id="googleAnalyticsId"
              name="googleAnalyticsId"
              value={formData.googleAnalyticsId}
              onChange={handleChange}
              placeholder="G-XXXXXXXXXX"
              className={state.errors?.googleAnalyticsId ? 'border-destructive' : ''}
            />
            {state.errors?.googleAnalyticsId && <p className='text-sm text-destructive'>{state.errors.googleAnalyticsId.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
              <InfoTooltip content={AnalyticsFormTooltips.googleTagManagerId} />
            </div>
            <Input
              id="googleTagManagerId"
              name="googleTagManagerId"
              value={formData.googleTagManagerId}
              onChange={handleChange}
              placeholder="GTM-XXXXXXX"
              className={state.errors?.googleTagManagerId ? 'border-destructive' : ''}
            />
            {state.errors?.googleTagManagerId && <p className='text-sm text-destructive'>{state.errors.googleTagManagerId.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
              <InfoTooltip content={AnalyticsFormTooltips.facebookPixelId} />
            </div>
            <Input
              id="facebookPixelId"
              name="facebookPixelId"
              value={formData.facebookPixelId}
              onChange={handleChange}
              placeholder="Your Pixel ID"
              className={state.errors?.facebookPixelId ? 'border-destructive' : ''}
            />
            {state.errors?.facebookPixelId && <p className='text-sm text-destructive'>{state.errors.facebookPixelId.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="tiktokPixelId">TikTok Pixel ID</Label>
              <InfoTooltip content={AnalyticsFormTooltips.tiktokPixelId} />
            </div>
            <Input
              id="tiktokPixelId"
              name="tiktokPixelId"
              value={formData.tiktokPixelId}
              onChange={handleChange}
              placeholder="Your TikTok Pixel ID"
              className={state.errors?.tiktokPixelId ? 'border-destructive' : ''}
            />
            {state.errors?.tiktokPixelId && <p className='text-sm text-destructive'>{state.errors.tiktokPixelId.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="snapchatPixelId">Snapchat Pixel ID</Label>
              <InfoTooltip content={AnalyticsFormTooltips.snapchatPixelId} />
            </div>
            <Input
              id="snapchatPixelId"
              name="snapchatPixelId"
              value={formData.snapchatPixelId}
              onChange={handleChange}
              placeholder="Your Snap Pixel ID"
              className={state.errors?.snapchatPixelId ? 'border-destructive' : ''}
            />
            {state.errors?.snapchatPixelId && <p className='text-sm text-destructive'>{state.errors.snapchatPixelId.join(', ')}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Verification Tags</CardTitle>
          <CardDescription>Enter the content of meta tags for site verification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="googleSiteVerificationId">Google Site Verification</Label>
              <InfoTooltip content={AnalyticsFormTooltips.googleSiteVerificationId} />
            </div>
            <Input
              id="googleSiteVerificationId"
              name="googleSiteVerificationId"
              value={formData.googleSiteVerificationId}
              onChange={handleChange}
              placeholder="Content of Google's meta tag"
              className={state.errors?.googleSiteVerificationId ? 'border-destructive' : ''}
            />
            {state.errors?.googleSiteVerificationId && <p className='text-sm text-destructive'>{state.errors.googleSiteVerificationId.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="bingSiteVerificationId">Bing Site Verification</Label>
              <InfoTooltip content={AnalyticsFormTooltips.bingSiteVerificationId} />
            </div>
            <Input
              id="bingSiteVerificationId"
              name="bingSiteVerificationId"
              value={formData.bingSiteVerificationId}
              onChange={handleChange}
              placeholder="Content of Bing's meta tag"
              className={state.errors?.bingSiteVerificationId ? 'border-destructive' : ''}
            />
            {state.errors?.bingSiteVerificationId && <p className='text-sm text-destructive'>{state.errors.bingSiteVerificationId.join(', ')}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Analytics Settings'}
        </Button>
      </div>
    </form>
  );
}
