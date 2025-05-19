'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { deleteSeoEntry } from '@/app/seo/actions/seo';
import Link from '@/components/link';
import type { GlobalSEO } from '@prisma/client';

type SeoTableProps = {
  initialData: GlobalSEO[];
};

export default function SeoTable({ initialData }: SeoTableProps) {
  const router = useRouter();
  const [data, setData] = useState<GlobalSEO[]>(initialData);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = data.filter(
    (entry) =>
      entry.metaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.metaDescription.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this SEO entry? This action cannot be undone.')) {
      setIsDeleting(id);

      try {
        const result = await deleteSeoEntry(id);

        if (result.success) {
          setData(data.filter((entry) => entry.id !== id));
          router.refresh();
        } else {
          alert('Failed to delete SEO entry');
        }
      } catch (error) {
        console.error('Error deleting SEO entry:', error);
        alert('An error occurred while deleting the SEO entry');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Search by title, entity ID, or description...'
          className='w-full rounded-md border border-gray-300 px-4 py-2'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='overflow-hidden rounded-lg bg-white shadow-md'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Title
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Entity ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Industry
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Last Updated
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-6 py-4 text-center text-sm text-gray-500'>
                    {searchTerm ? 'No matching SEO entries found' : 'No SEO entries found'}
                  </td>
                </tr>
              ) : (
                filteredData.map((entry) => (
                  <tr key={entry.id} className='hover:bg-gray-50'>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                      {entry.metaTitle || 'Untitled'}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                      {entry.entityId}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                      {entry.industryType}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                      <div className='flex justify-end gap-2 space-x-2'>
                        <Link
                          href={`/seo/${entry.id}`}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          View
                        </Link>
                        <Link
                          href={`/seo/${entry.id}/edit`}
                          className='text-indigo-600 hover:text-indigo-900'
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={isDeleting === entry.id}
                          className='text-red-600 hover:text-red-900 disabled:opacity-50'
                        >
                          {isDeleting === entry.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
