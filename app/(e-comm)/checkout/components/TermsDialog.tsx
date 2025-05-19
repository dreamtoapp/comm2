// components/Checkout/TermsDialog.tsx
'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react'; // Import Loader2 directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

import { getTerms, Term } from '../../../dashboard/rulesandcondtions/actions/terms-actions';
// Removed Icon import: import { Icon } from '@/components/icons';

export default function TermsDialog() {
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTerms = async () => {
      if (open) {
        try {
          setLoading(true);
          const data = await getTerms();
          setTerms(data);
          setError('');
        } catch {
          setError('فشل تحميل الشروط، يرجى المحاولة لاحقاً');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTerms();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='link' className='p-0'>
          الشروط والاحكام
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <DialogHeader className='flex items-center justify-center'>
          <DialogTitle>الشروط والأحكام وسياسة الخصوصية</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className={iconVariants({ size: 'lg', animation: 'spin', className: 'text-primary' })} /> {/* Use direct import + CVA */}
          </div>
        ) : error ? (
          <div className='py-4 text-center text-red-500'>{error}</div>
        ) : (
          <div className='space-y-2 text-sm text-gray-700'>
            {terms.map((term) => (
              <div key={term.id} className='rounded-lg bg-muted p-4'>
                <div className='text-left text-xs text-muted-foreground'>
                  آخر تحديث: {new Date(term.updatedAt).toLocaleDateString()}
                </div>
                <div className='whitespace-pre-wrap text-foreground'>{term.content}</div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
