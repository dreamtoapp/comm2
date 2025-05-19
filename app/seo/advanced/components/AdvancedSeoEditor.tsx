// app/seo/advanced/components/AdvancedSeoEditor.tsx
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import ReactSwal from '@/lib/swal-config';

import { getSeoEntryById } from '@/app/seo/actions/seo';
import { updateAdvancedSeo } from '@/app/seo/actions/update-seo';
import AdvancedSeoFormFields, { type AdvancedSeoFormDataSubset } from '@/app/seo/components/edit-forms/advanced-seo-form-fields';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { GlobalSEO } from '@prisma/client';

type SeoEntryOption = {
  id: string;
  label: string;
  value: string;
};

type AdvancedSeoEditorProps = {
  seoEntryOptions: SeoEntryOption[];
};

const initialFormState: AdvancedSeoFormDataSubset = {
  schemaOrg: '', // Expecting stringified JSON
  industryData: '', // Expecting stringified JSON
};

const initialActionState = {
  success: false,
  errors: null,
  message: '',
};

export default function AdvancedSeoEditor({ seoEntryOptions }: AdvancedSeoEditorProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [currentSeoEntry, setCurrentSeoEntry] = useState<GlobalSEO | null>(null);
  const [formData, setFormData] = useState<AdvancedSeoFormDataSubset>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(updateAdvancedSeo, initialActionState);

  useEffect(() => {
    if (selectedEntryId) {
      setIsLoading(true);
      getSeoEntryById(selectedEntryId)
        .then(entry => {
          if (entry) {
            setCurrentSeoEntry(entry);
            setFormData({
              schemaOrg: entry.schemaOrg ? JSON.stringify(entry.schemaOrg, null, 2) : '',
              industryData: entry.industryData ? JSON.stringify(entry.industryData, null, 2) : '',
            });
          } else {
            setCurrentSeoEntry(null);
            setFormData(initialFormState);
            ReactSwal.fire('Error', 'Could not load SEO entry details.', 'error');
          }
        })
        .catch(() => {
          ReactSwal.fire('Error', 'Failed to fetch SEO entry.', 'error');
          setCurrentSeoEntry(null);
          setFormData(initialFormState);
        })
        .finally(() => setIsLoading(false));
    } else {
      setCurrentSeoEntry(null);
      setFormData(initialFormState);
    }
  }, [selectedEntryId]);

  useEffect(() => {
    if (state.success) {
      ReactSwal.fire({
        title: 'Success!',
        text: state.message || 'Advanced SEO updated successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push('/seo');
      });
    } else if (state.errors) {
      const errorMessages = Object.values(state.errors).flat().join('\n');
      ReactSwal.fire('Error!', errorMessages || state.message || 'Failed to update Advanced SEO.', 'error');
    }
  }, [state, router]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { // Textarea only for these fields
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select SEO Entry</CardTitle>
        <CardDescription>Choose an existing page/entity to manage its advanced SEO settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select
          onValueChange={(value) => setSelectedEntryId(value)}
          value={selectedEntryId || undefined}
          disabled={isLoading || isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a page/entity..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pages/Entities</SelectLabel>
              {seoEntryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {isLoading && <p>Loading entry details...</p>}

        {selectedEntryId && !isLoading && currentSeoEntry && (
          <form action={formAction}>
            <input type="hidden" name="entryId" value={selectedEntryId} />
            <AdvancedSeoFormFields
              formData={formData}
              errors={state.errors || {}}
              handleChange={handleChange}
              entityType={currentSeoEntry.entityType}
              industryType={currentSeoEntry.industryType}
            />
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Advanced SEO'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
