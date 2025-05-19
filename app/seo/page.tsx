import { PlusCircle } from 'lucide-react';
import type { Metadata } from 'next';
// import { revalidatePath } from 'next/cache'; // No longer needed here
import Link from 'next/link';

import { getAllSeoEntries } from '@/app/seo/actions/seo';
import SeoActionsMenu from '@/app/seo/components/seo-actions-menu'; // Import SeoActionsMenu
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

// import ReactSwal from '@/lib/swal-config'; // No longer needed here

export const metadata: Metadata = {
  title: 'Page SEO Hub',
  description: 'Manage and create SEO settings for your website pages.',
};

export default async function PageSeoHubPage() {
  const seoEntries = await getAllSeoEntries();



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
                  <TableRow key={entry.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{entry.entityId}</TableCell>
                    <TableCell>{entry.metaTitle || <span className="text-xs text-muted-foreground">Not set</span>}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.metaDescription || <span className="text-xs text-muted-foreground">Not set</span>}</TableCell>
                    <TableCell>
                      {entry.metaTitle && entry.metaDescription ? (
                        <Badge variant="default" className="bg-green-500 text-white">Configured</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-500 text-white">Basic</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <SeoActionsMenu entry={entry} />
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
