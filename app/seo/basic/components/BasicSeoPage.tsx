// app/seo/basic/components/BasicSeoPage.tsx
import {
  Edit,
  PlusCircle,
} from 'lucide-react'; // Added Edit icon
import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  EntityType,
  type GlobalSEO,
  IndustryType,
} from '@prisma/client';

export const metadata: Metadata = {
  title: 'Page SEO Hub',
  description: 'Manage and create SEO settings for your website pages.',
};

// Dummy data structure matching GlobalSEO for now
const dummySeoEntries = [
  {
    id: 'clxkrg1230000abcdef1234',
    entityId: 'homepage',
    entityType: EntityType.PAGE,
    metaTitle: 'Welcome to Our Awesome Site!',
    metaDescription: 'Discover amazing things and services. Your one-stop destination.',
    industryType: IndustryType.OTHER,
    robots: 'index, follow',
    keywords: ['awesome', 'site', 'services'],
    canonicalUrl: 'https://example.com',
    socialMedia: { openGraphTitle: 'OG Title for Homepage', openGraphImages: null, twitterCardType: null, twitterImages: null },
    technicalSEO: { securityHeaders: [], preloadAssets: [], httpEquiv: [] },
    localization: { defaultLanguage: 'en-US', supportedLanguages: ['en-US', 'es-ES'], hreflang: null },
    schemaOrg: null,
    industryData: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    // translations: [], // Removed
  },
  {
    id: 'clxkrg4560001bcdefg5678',
    entityId: 'about-us',
    entityType: EntityType.PAGE,
    metaTitle: 'About Our Company | Our Story',
    metaDescription: 'Learn more about our company, mission, and the team behind our success.',
    industryType: IndustryType.OTHER,
    robots: 'index, follow',
    keywords: ['about us', 'company', 'mission'],
    canonicalUrl: 'https://example.com/about-us',
    socialMedia: { openGraphTitle: 'About Us - OG Title', openGraphImages: null, twitterCardType: null, twitterImages: null },
    technicalSEO: { securityHeaders: [], preloadAssets: [], httpEquiv: [] },
    localization: { defaultLanguage: 'en-US', supportedLanguages: ['en-US'], hreflang: null },
    schemaOrg: null,
    industryData: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function BasicSeoPage() {
  // Using dummy data for now
  const seoEntries = dummySeoEntries.filter(entry => entry.entityType === EntityType.PAGE) as GlobalSEO[]; // Cast to GlobalSEO[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className='text-3xl font-bold'>Page SEO Management Hub</h1>
          <p className='mt-1 text-muted-foreground'>
            Create new page SEO entries or manage existing ones.
          </p>
        </div>
        <Button asChild>
          <Link href="/seo/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Page SEO
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Existing Page SEO Entries (SEO Page Table)</h2>
        {seoEntries.length === 0 ? (
          <p className="text-muted-foreground">No page SEO entries found. Create one to get started!</p>
        ) : (
          <div className="overflow-hidden rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page ID / Slug</TableHead>
                  <TableHead>Meta Title</TableHead>
                  <TableHead>Meta Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seoEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.entityId}</TableCell>
                    <TableCell>{entry.metaTitle || <span className="text-xs text-muted-foreground">Not set</span>}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.metaDescription || <span className="text-xs text-muted-foreground">Not set</span>}</TableCell>
                    <TableCell>
                      {entry.metaTitle && entry.metaDescription ? (
                        <Badge variant="default">Configured</Badge>
                      ) : (
                        <Badge variant="secondary">Basic</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button asChild variant="outline" size="sm">
                        {/* This link should now point to the (entry) route group */}
                        <Link href={`/seo/${entry.id}/edit`}>
                          <Edit className="mr-1 h-3 w-3" /> Edit
                        </Link>
                      </Button>
                      {/* Delete button placeholder */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
