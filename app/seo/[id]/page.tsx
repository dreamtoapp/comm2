import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getSeoEntryById } from '@/app/seo/actions/seo';
import BackButton from '@/components/BackButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;

  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!objectIdPattern.test(id)) {
    return {
      title: 'Invalid SEO Entry ID',
    };
  }

  const seo = await getSeoEntryById(id);

  if (!seo) {
    return {
      description: 'SEO Entry Not Found',
    };
  }

  return {
    title: `View SEO: ${seo.metaTitle || seo.entityId}`,
    description: seo.metaDescription || 'Detailed view of SEO entry.',
  };
}

export default async function SeoDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!objectIdPattern.test(id)) {
    notFound();
  }

  const seo = await getSeoEntryById(id);

  if (!seo) {
    return (
      <div>
        <h1>SEO Data Not Found</h1>
        <p>The SEO data for the given ID was not found.</p>
      </div>
    );
  }

  const renderJsonOrString = (data: any, title: string) => {
    if (!data) return <span className="text-muted-foreground">Not set</span>;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return (
          <pre className="mt-1 max-h-60 overflow-auto rounded-md bg-muted p-3 text-sm">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
      } catch (e) {
        return <span className="text-foreground">{data}</span>;
      }
    }
    if (typeof data === 'object') {
      return (
        <pre className="mt-1 max-h-60 overflow-auto rounded-md bg-muted p-3 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      );
    }
    return <span className="text-foreground">{String(data)}</span>;
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            SEO Details: <span className="text-primary">{seo.entityId}</span>
          </h1>
          <p className="text-muted-foreground">
            Viewing details for the SEO entry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BackButton />
          <Button asChild variant="outline">
            <Link href="/seo">← Back to SEO Hub</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic SEO</CardTitle>
          <CardDescription>Core search engine optimization settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div><Label>Entity ID / Slug</Label><p className="text-foreground">{seo.entityId}</p></div>
          <div><Label>Entity Type</Label><Badge variant="outline">{seo.entityType}</Badge></div>
          <div><Label>Industry Type</Label><Badge variant="outline">{seo.industryType}</Badge></div>
          <div><Label>Meta Title</Label><p className="text-foreground">{seo.metaTitle}</p></div>
          <div className="md:col-span-2"><Label>Meta Description</Label><p className="text-foreground">{seo.metaDescription}</p></div>
          <div><Label>Canonical URL</Label><p className="text-foreground">{seo.canonicalUrl || 'Not set'}</p></div>
          <div><Label>Robots Directive</Label><Badge variant="secondary">{seo.robots}</Badge></div>
          <div><Label>Keywords</Label><p className="text-foreground">{seo.keywords.join(', ') || 'Not set'}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media SEO</CardTitle>
          <CardDescription>Settings for social media platforms.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div><Label>Open Graph Title</Label><p className="text-foreground">{seo.socialMedia?.openGraphTitle || 'Not set'}</p></div>
          <div><Label>Twitter Card Type</Label><p className="text-foreground">{seo.socialMedia?.twitterCardType || 'Not set'}</p></div>
          <div className="md:col-span-2"><Label>Open Graph Images</Label>{renderJsonOrString(seo.socialMedia?.openGraphImages, 'Open Graph Images')}</div>
          <div className="md:col-span-2"><Label>Twitter Images</Label>{renderJsonOrString(seo.socialMedia?.twitterImages, 'Twitter Images')}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical SEO</CardTitle>
          <CardDescription>Advanced technical optimization settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div><Label>Security Headers</Label><p className="text-foreground">{seo.technicalSEO?.securityHeaders.join(', ') || 'Not set'}</p></div>
          <div><Label>Preload Assets</Label><p className="text-foreground">{seo.technicalSEO?.preloadAssets.join(', ') || 'Not set'}</p></div>
          <div><Label>HTTP-Equiv Tags</Label><p className="text-foreground">{seo.technicalSEO?.httpEquiv.join(', ') || 'Not set'}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
          <CardDescription>Language and regional settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div><Label>Default Language</Label><p className="text-foreground">{seo.localization?.defaultLanguage}</p></div>
          <div><Label>Supported Languages</Label><p className="text-foreground">{seo.localization?.supportedLanguages.join(', ') || 'Not set'}</p></div>
          <div className="md:col-span-2"><Label>Hreflang Links</Label>{renderJsonOrString(seo.localization?.hreflang, 'Hreflang Links')}</div>
        </CardContent>
      </Card>

      {seo.schemaOrg && (
        <Card>
          <CardHeader><CardTitle>Schema.org (JSON-LD)</CardTitle></CardHeader>
          <CardContent>{renderJsonOrString(seo.schemaOrg, 'Schema.org')}</CardContent>
        </Card>
      )}

      {seo.industryData && (
        <Card>
          <CardHeader><CardTitle>Industry-Specific Data</CardTitle></CardHeader>
          <CardContent>{renderJsonOrString(seo.industryData, 'Industry Data')}</CardContent>
        </Card>
      )}

      <Separator />

      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
        <p>Created At: {new Date(seo.createdAt).toLocaleString()}</p>
        <p>Updated At: {new Date(seo.updatedAt).toLocaleString()}</p>
      </div>

      {/* <div className="mt-8 flex justify-end">
        <Button asChild>
          <Link href={`/seo/${seo.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit SEO Entry
          </Link>
        </Button>
      </div> */}
    </div>
  );
}
