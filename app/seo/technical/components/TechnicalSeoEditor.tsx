// app/seo/technical/components/TechnicalSeoEditor.tsx
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import ReactSwal from '@/lib/swal-config';

import { getSeoEntryById } from '@/app/seo/actions/seo';
import { updateTechnicalSeo } from '@/app/seo/actions/update-seo';
import TechnicalSeoFormFields, { type TechnicalSeoFormDataSubset } from '@/app/seo/components/edit-forms/technical-seo-form-fields';
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

type TechnicalSeoEditorProps = {
  seoEntryOptions: SeoEntryOption[];
};

const initialFormState: TechnicalSeoFormDataSubset = {
  securityHeaders: [],
  preloadAssets: [],
  httpEquiv: [],
};

const initialActionState = {
  success: false,
  errors: null,
  message: '',
};

export default function TechnicalSeoEditor({ seoEntryOptions }: TechnicalSeoEditorProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [currentSeoEntry, setCurrentSeoEntry] = useState<GlobalSEO | null>(null);
  const [formData, setFormData] = useState<TechnicalSeoFormDataSubset>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(updateTechnicalSeo, initialActionState);

  useEffect(() => {
    if (selectedEntryId) {
      setIsLoading(true);
      getSeoEntryById(selectedEntryId)
        .then(entry => {
          if (entry && entry.technicalSEO) {
            setCurrentSeoEntry(entry);
            setFormData({
              securityHeaders: entry.technicalSEO.securityHeaders || [],
              preloadAssets: entry.technicalSEO.preloadAssets || [],
              httpEquiv: entry.technicalSEO.httpEquiv || [],
            });
          } else {
            setCurrentSeoEntry(null);
            setFormData(initialFormState);
            if (entry) { // Entry exists but technicalSEO is null
              setFormData(initialFormState); // Ensure form is reset
            } else {
              ReactSwal.fire('Error', 'Could not load SEO entry details.', 'error');
            }
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
        text: state.message || 'Technical SEO updated successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push('/seo');
      });
    } else if (state.errors) {
      const errorMessages = Object.values(state.errors).flat().join('\n');
      ReactSwal.fire('Error!', errorMessages || state.message || 'Failed to update Technical SEO.', 'error');
    }
  }, [state, router]);

  const handleArrayChange = (name: keyof TechnicalSeoFormDataSubset, value: string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addToArray = (name: keyof TechnicalSeoFormDataSubset, inputId: string) => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement && inputElement.value.trim()) {
      const currentArray = formData[name] as string[] || [];
      setFormData(prev => ({
        ...prev,
        [name]: [...currentArray, inputElement.value.trim()],
      }));
      inputElement.value = '';
    }
  };

  const removeFromArray = (name: keyof TechnicalSeoFormDataSubset, index: number) => {
    const currentArray = formData[name] as string[] || [];
    setFormData(prev => ({
      ...prev,
      [name]: currentArray.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select SEO Entry</CardTitle>
        <CardDescription>Choose an existing page/entity to manage its technical SEO.</CardDescription>
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
            <TechnicalSeoFormFields
              formData={formData}
              errors={state.errors || {}}
              handleArrayChange={handleArrayChange}
              addToArray={addToArray}
              removeFromArray={removeFromArray}
            />
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Technical SEO'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
