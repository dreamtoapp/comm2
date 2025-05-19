// app/seo/components/seo-actions-menu.tsx
'use client';

import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
// import { revalidatePath } from 'next/cache'; // Remove revalidatePath
import { useRouter } from 'next/navigation'; // Import useRouter
import ReactSwal from '@/lib/swal-config';

import { deleteSeoEntry } from '@/app/seo/actions/seo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { GlobalSEO } from '@prisma/client'; // Import GlobalSEO type

type SeoActionsMenuProps = {
  entry: GlobalSEO;
};

export default function SeoActionsMenu({ entry }: SeoActionsMenuProps) {
  const router = useRouter(); // Initialize useRouter

  async function handleDelete(id: string) {
    // No 'use server' here as this is a client component function
    // The server action `deleteSeoEntry` will be called
    const result = await ReactSwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteSeoEntry(id);
      if (deleteResult.success) {
        // revalidatePath('/seo'); // Remove revalidatePath
        router.refresh(); // Use router.refresh() to update UI
        ReactSwal.fire(
          'Deleted!',
          'Your SEO entry has been deleted.',
          'success'
        );
      } else {
        ReactSwal.fire(
          'Error!',
          deleteResult.errors?._form?.join('\n') || 'Failed to delete SEO entry.',
          'error'
        );
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/seo/${entry.id}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" /> View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/seo/${entry.id}/edit`} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleDelete(entry.id);
          }}
          className="flex items-center text-destructive hover:!bg-destructive/10 hover:!text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
