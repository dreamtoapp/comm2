// app/seo/social/components/SocialSeoEditor.tsx
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import ReactSwal from '@/lib/swal-config';

import { getSeoEntryById } from '@/app/seo/actions/seo'; // To fetch full entry details
import { updateSocialSeo } from '@/app/seo/actions/update-seo'; // New server action
import SocialSeoFormFields, { type SocialSeoFormDataSubset } from '@/app/seo/components/edit-forms/social-seo-form-fields';
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

type SocialSeoEditorProps = {
  seoEntryOptions: SeoEntryOption[];
};

const initialFormState: SocialSeoFormDataSubset = {
  openGraphTitle: '',
  openGraphDescription: '',
  openGraphImages: [], // Assuming it's an array of image URLs or objects
  twitterCardType: '',
  twitterSite: '',
  twitterCreator: '',
  twitterTitle: '',
  twitterDescription: '',
  twitterImages: [], // Assuming it's an array
};

const initialActionState = {
  success: false,
  errors: null,
  message: '',
};

export default function SocialSeoEditor({ seoEntryOptions }: SocialSeoEditorProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [currentSeoEntry, setCurrentSeoEntry] = useState<GlobalSEO | null>(null);
  const [formData, setFormData] = useState<SocialSeoFormDataSubset>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(updateSocialSeo, initialActionState);

  useEffect(() => {
    if (selectedEntryId) {
      setIsLoading(true);
      getSeoEntryById(selectedEntryId)
        .then(entry => {
          if (entry) {
            setCurrentSeoEntry(entry);
            setFormData({
              openGraphTitle: entry.socialMedia?.openGraphTitle || '',
              openGraphDescription: entry.socialMedia?.openGraphDescription || '',
              openGraphImages: entry.socialMedia?.openGraphImages ? JSON.parse(JSON.stringify(entry.socialMedia.openGraphImages)) : [],
              twitterCardType: entry.socialMedia?.twitterCardType || '',
              twitterSite: entry.socialMedia?.twitterSite || '',
              twitterCreator: entry.socialMedia?.twitterCreator || '',
              twitterTitle: entry.socialMedia?.twitterTitle || '',
              twitterDescription: entry.socialMedia?.twitterDescription || '',
              twitterImages: entry.socialMedia?.twitterImages ? JSON.parse(JSON.stringify(entry.socialMedia.twitterImages)) : [],
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
        text: state.message || 'Social SEO updated successfully!',
        icon: 'success',
        timer: 2000, // Keep it short as we are redirecting
        showConfirmButton: false,
      }).then(() => {
        router.push('/seo'); // Redirect to /seo
        // router.refresh() might not be needed if redirecting, 
        // but if the /seo page needs fresh data immediately upon load, keep it or ensure /seo revalidates
      });
    } else if (state.errors) {
      const errorMessages = Object.values(state.errors).flat().join('\n');
      ReactSwal.fire('Error!', errorMessages || state.message || 'Failed to update Social SEO.', 'error');
    }
  }, [state, router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectValueChange = (name: keyof SocialSeoFormDataSubset, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: keyof SocialSeoFormDataSubset, value: string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addToArray = (name: keyof Pick<SocialSeoFormDataSubset, 'openGraphImages' | 'twitterImages'>, inputId: string) => {
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

  const removeFromArray = (name: keyof Pick<SocialSeoFormDataSubset, 'openGraphImages' | 'twitterImages'>, index: number) => {
    const currentArray = formData[name] as string[] || [];
    setFormData(prev => ({
      ...prev,
      [name]: currentArray.filter((_, i) => i !== index),
    }));
  };

  // handleSubmit is no longer needed as formAction is passed directly to the form
  // const handleSubmit = () => { ... };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select SEO Entry</CardTitle>
        <CardDescription>Choose an existing page/entity to manage its social media SEO.</CardDescription>
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
          <form action={formAction}> {/* Pass formAction to the action prop */}
            {/* Add a hidden input for entryId if not already part of formData sent by SocialSeoFormFields */}
            <input type="hidden" name="entryId" value={selectedEntryId} />
            <SocialSeoFormFields
              formData={formData}
              errors={state.errors || {}}
              handleChange={handleChange}
              handleSelectValueChange={handleSelectValueChange} // Pass the new handler
              handleArrayChange={handleArrayChange}
              addToArray={addToArray}
              removeFromArray={removeFromArray}
            />
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Social SEO'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
