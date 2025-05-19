import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BackButton from '@/components/BackButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { getSeoProducById } from './actions';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!objectIdPattern.test(id)) {
    return {
      title: 'Invalid SEO Entry ID',
    };
  }

  const seo = await getSeoProducById(id);

  if (!seo) {
    return {
      title: 'SEO Entry Not Found',
    };
  }

  return {
    title: `View SEO: ${seo.metaTitle || seo.name}`,
    description: seo.metaDescription || 'Detailed view of SEO entry.',
  };
}

export default async function SeoProductPage({ params }: Props) {
  const { id } = await params;

  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!objectIdPattern.test(id)) {
    notFound();
  }

  const seo = await getSeoProducById(id);

  if (!seo) {
    return (
      <div>
        <h1>SEO Data Not Found</h1>
        <p>The SEO data for the given ID was not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            SEO Details: <span className="text-primary">{seo.name}</span>
          </h1>
          <p className="text-muted-foreground">
            Viewing details for the SEO entry.
          </p>
          <p className="text-muted-foreground">
            Brief: {seo.metaDescription}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BackButton />

        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic SEO</CardTitle>
          <CardDescription>Core search engine optimization settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div><Label>Product Name</Label><p className="text-foreground">{seo.name}</p></div>
          <div><Label>Product Slug</Label><p className="text-foreground">{seo.slug}</p></div>
          <div><Label>Meta Title</Label><p className="text-foreground">{seo.metaTitle}</p></div>
          <div className="md:col-span-2"><Label>Meta Description</Label><p className="text-foreground">{seo.metaDescription}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}
