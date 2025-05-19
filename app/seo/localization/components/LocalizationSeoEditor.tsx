// app/seo/localization/components/LocalizationSeoEditor.tsx
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import ReactSwal from '@/lib/swal-config';

import { getSeoEntryById } from '@/app/seo/actions/seo';
import { updateLocalizationSeo } from '@/app/seo/actions/update-seo';
import LocalizationSeoFormFields, { type LocalizationSeoFormDataSubset } from '@/app/seo/components/edit-forms/localization-seo-form-fields';
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

type LocalizationSeoEditorProps = {
  seoEntryOptions: SeoEntryOption[];
};

const initialFormState: LocalizationSeoFormDataSubset = {
  defaultLanguage: 'ar-SA',
  supportedLanguages: ['ar-SA'],
  hreflang: '', // Expecting stringified JSON from the form field
};

const initialActionState = {
  success: false,
  errors: null,
  message: '',
};

export default function LocalizationSeoEditor({ seoEntryOptions }: LocalizationSeoEditorProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [currentSeoEntry, setCurrentSeoEntry] = useState<GlobalSEO | null>(null);
  const [formData, setFormData] = useState<LocalizationSeoFormDataSubset>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(updateLocalizationSeo, initialActionState);

  useEffect(() => {
    if (selectedEntryId) {
      setIsLoading(true);
      getSeoEntryById(selectedEntryId)
        .then(entry => {
          if (entry && entry.localization) {
            setCurrentSeoEntry(entry);
            setFormData({
              defaultLanguage: entry.localization.defaultLanguage || 'ar-SA',
              supportedLanguages: entry.localization.supportedLanguages || ['ar-SA'],
              hreflang: entry.localization.hreflang ? JSON.stringify(entry.localization.hreflang, null, 2) : '',
            });
          } else {
            setCurrentSeoEntry(null);
            setFormData(initialFormState);
            if (entry) {
              setFormData(initialFormState);
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
        text: state.message || 'Localization SEO updated successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push('/seo');
      });
    } else if (state.errors) {
      const errorMessages = Object.values(state.errors).flat().join('\n');
      ReactSwal.fire('Error!', errorMessages || state.message || 'Failed to update Localization SEO.', 'error');
    }
  }, [state, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: keyof Pick<LocalizationSeoFormDataSubset, 'supportedLanguages'>, value: string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addToArray = (name: keyof Pick<LocalizationSeoFormDataSubset, 'supportedLanguages'>, inputId: string) => {
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

  const removeFromArray = (name: keyof Pick<LocalizationSeoFormDataSubset, 'supportedLanguages'>, index: number) => {
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
        <CardDescription>Choose an existing page/entity to manage its localization SEO.</CardDescription>
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
            <LocalizationSeoFormFields
              formData={formData}
              errors={state.errors || {}}
              handleChange={handleChange}
              handleArrayChange={handleArrayChange}
              addToArray={addToArray}
              removeFromArray={removeFromArray}
            />
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Localization SEO'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
