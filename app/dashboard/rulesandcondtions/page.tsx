// app/terms/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createTerm, deleteTerm, updateTerm, getTerms, type Term } from './actions/terms-actions';

export default function TermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const data = await getTerms();
        setTerms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    };
    loadTerms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!content.trim()) throw new Error('Content is required');

      if (editingId) {
        await updateTerm(editingId, content);
      } else {
        await createTerm(content);
      }

      const updatedTerms = await getTerms();
      setTerms(updatedTerms);
      setContent('');
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete?')) {
      try {
        await deleteTerm(id);
        setTerms(terms.filter((term) => term.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete');
      }
    }
  };

  return (
    <div className='container max-w-4xl py-8'>
      <h1 className='mb-6 text-2xl font-bold'>Terms & Conditions</h1>

      {error && <div className='mb-4 rounded bg-red-100 p-3 text-red-700'>{error}</div>}

      <form onSubmit={handleSubmit} className='mb-8 space-y-4'>
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Enter new term...'
          className='w-full'
          disabled={loading}
        />
        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? 'Processing...' : editingId ? 'Update' : 'Add'}
        </Button>
      </form>

      <Table className='rounded-lg border'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[80%]'>Content</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terms.map((term) => (
            <TableRow key={term.id}>
              <TableCell>{term.content}</TableCell>
              <TableCell className='flex justify-end gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    setEditingId(term.id);
                    setContent(term.content);
                  }}
                  disabled={loading}
                >
                  Edit
                </Button>
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleDelete(term.id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
