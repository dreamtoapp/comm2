'use client';

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import type {
  SeoFormData,
  ServerActionResult,
} from '@/app/seo/actions/seo';
import { updateSeoEntry } from '@/app/seo/actions/seo';
import AdvancedSeoFormFields, {
  type AdvancedSeoFormDataSubset,
} from '@/app/seo/components/edit-forms/advanced-seo-form-fields';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { GlobalSEO } from '@prisma/client';
import {
  EntityType,
  IndustryType,
} from '@prisma/client';

// Full form state for this page
type PageFormState = AdvancedSeoFormDataSubset & {
  selectedEntryId: string;
  // Include all other fields from SeoFormData
  entityId: string;
  entityType: EntityType;
  industryType: IndustryType;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
  keywords: string[];
  openGraphTitle: string;
  openGraphImages: string;
  twitterCardType: string;
  twitterImages: string;
  securityHeaders: string[];
  preloadAssets: string[];
  httpEquiv: string[];
  defaultLanguage: string;
  supportedLanguages: string[];
  hreflang: string;
};

const initialAdvancedFields: AdvancedSeoFormDataSubset = {
  schemaOrg: '',
  industryData: '',
};

const dummySeoEntriesForSelect: GlobalSEO[] = [
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
    schemaOrg: '{"@type": "WebPage"}', // Example stringified JSON
    industryData: '{"customField": "customValue"}', // Example stringified JSON
    createdAt: new Date(),
    updatedAt: new Date(),
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

export default function EditAdvancedSeoPage() {
  const router = useRouter();
  const [allPageSeoEntries, setAllPageSeoEntries] = useState<GlobalSEO[]>(dummySeoEntriesForSelect as GlobalSEO[]);
  const [selectedEntryFullData, setSelectedEntryFullData] = useState<GlobalSEO | null>(null);

  const [formData, setFormData] = useState<PageFormState>({
    selectedEntryId: '',
    ...initialAdvancedFields,
    entityId: '', entityType: EntityType.PAGE, industryType: IndustryType.OTHER,
    metaTitle: '', metaDescription: '', canonicalUrl: '', robots: 'index, follow', keywords: [],
    openGraphTitle: '', openGraphImages: '', twitterCardType: '', twitterImages: '',
    securityHeaders: [], preloadAssets: [], httpEquiv: [],
    defaultLanguage: 'ar-SA', supportedLanguages: ['ar-SA'], hreflang: '',
  });

  const [errors, setErrors] = useState<Record<string, string[] | string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const safeJsonStringify = (value: any): string => value ? JSON.stringify(value) : '';

  const handlePageSelectChange = async (entryId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEntryId: entryId,
      ...initialAdvancedFields,
      entityId: '', entityType: EntityType.PAGE, industryType: IndustryType.OTHER,
      metaTitle: '', metaDescription: '', canonicalUrl: '', robots: 'index, follow', keywords: [],
      openGraphTitle: '', openGraphImages: '', twitterCardType: '', twitterImages: '',
      securityHeaders: [], preloadAssets: [], httpEquiv: [],
      defaultLanguage: 'ar-SA', supportedLanguages: ['ar-SA'], hreflang: '',
    }));
    setSelectedEntryFullData(null);

    if (entryId) {
      setIsLoadingDetails(true);
      try {
        const entryDetails = dummySeoEntriesForSelect.find(e => e.id === entryId) || null;
        setSelectedEntryFullData(entryDetails);
        if (entryDetails) {
          setFormData(prev => ({
            ...prev,
            selectedEntryId: entryId,
            entityId: entryDetails.entityId,
            entityType: entryDetails.entityType,
            industryType: entryDetails.industryType,
            metaTitle: entryDetails.metaTitle,
            metaDescription: entryDetails.metaDescription,
            canonicalUrl: entryDetails.canonicalUrl || '',
            robots: entryDetails.robots,
            keywords: entryDetails.keywords || [],
            openGraphTitle: entryDetails.socialMedia?.openGraphTitle || '',
            openGraphImages: safeJsonStringify(entryDetails.socialMedia?.openGraphImages),
            twitterCardType: entryDetails.socialMedia?.twitterCardType || '',
            twitterImages: safeJsonStringify(entryDetails.socialMedia?.twitterImages),
            securityHeaders: entryDetails.technicalSEO?.securityHeaders || [],
            preloadAssets: entryDetails.technicalSEO?.preloadAssets || [],
            httpEquiv: entryDetails.technicalSEO?.httpEquiv || [],
            defaultLanguage: entryDetails.localization?.defaultLanguage || 'ar-SA',
            supportedLanguages: entryDetails.localization?.supportedLanguages || ['ar-SA'],
            hreflang: safeJsonStringify(entryDetails.localization?.hreflang),
            schemaOrg: safeJsonStringify(entryDetails.schemaOrg),
            industryData: safeJsonStringify(entryDetails.industryData),
          }));
        }
      } catch (error) {
        console.error("Failed to set entry details from dummy data:", error);
        setErrors(prev => ({ ...prev, _form: ['Failed to load page details.'] }));
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => { // Only Textareas in Advanced form
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.selectedEntryId || !selectedEntryFullData) {
      setErrors({ _form: ['Please select a page entry to configure.'] });
      return;
    }
    setIsSubmitting(true);
    setErrors({});

    const { selectedEntryId: _selectedEntryId, ...dataToSubmit } = formData;
    const fullDataForUpdate: SeoFormData = dataToSubmit as SeoFormData;

    try {
      const result: ServerActionResult = await updateSeoEntry(formData.selectedEntryId, fullDataForUpdate);

      if (result.success && result.data?.id) {
        router.refresh();
        alert('Advanced SEO settings updated successfully!');
      } else {
        setErrors(result.errors || { _form: ['Failed to update SEO entry.'] });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ _form: ['An unexpected error occurred.'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const advancedFormDataForChild: AdvancedSeoFormDataSubset = {
    schemaOrg: formData.schemaOrg,
    industryData: formData.industryData,
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Advanced Page SEO</h1>
          <p className="mt-2 text-muted-foreground">
            Select a Page SEO entry and configure its advanced settings (Schema.org, Industry Data).
          </p>
        </div>

        {errors._form && (
          <div className='mb-4 rounded border border-destructive bg-destructive/10 px-4 py-3 text-destructive'>
            {Array.isArray(errors._form) ? errors._form.map((err, i) => <p key={i}>{err}</p>) : <p>{errors._form as string}</p>}
          </div>
        )}

        {isLoadingEntries ? (
          <p>Loading page entries...</p>
        ) : allPageSeoEntries.length === 0 ? (
          <p className="text-muted-foreground">
            No Page SEO entries found. Please create one first.
          </p>
        ) : (
          <div className="max-w-xl space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <Label htmlFor="seo-entry-select-advanced">Select Page Entry</Label>
            <Select onValueChange={handlePageSelectChange} value={formData.selectedEntryId}>
              <SelectTrigger id="seo-entry-select-advanced" className="w-full">
                <SelectValue placeholder="Choose a page..." />
              </SelectTrigger>
              <SelectContent>
                {allPageSeoEntries.map((entry) => (
                  <SelectItem key={entry.id} value={entry.id}>
                    {entry.entityId} ({entry.metaTitle || 'No title'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.selectedEntryId && <p className='text-sm text-destructive'>{errors.selectedEntryId[0]}</p>}
          </div>
        )}

        {formData.selectedEntryId && (isLoadingDetails ? (
          <p className="mt-4">Loading details...</p>
        ) : selectedEntryFullData ? (
          <div className="mt-8 space-y-8 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold">Editing Advanced SEO for: {selectedEntryFullData.entityId}</h3>
            <AdvancedSeoFormFields
              formData={advancedFormDataForChild}
              errors={errors}
              handleChange={handleChange}
            />
            <div className='flex justify-end pt-6'>
              <Button type='submit' disabled={isSubmitting || !formData.selectedEntryId}>
                {isSubmitting ? 'Saving...' : 'Save Advanced Settings'}
              </Button>
            </div>
          </div>
        ) : (
          !isLoadingEntries && <p className="mt-4 text-muted-foreground">Selected page details could not be loaded. Please try re-selecting.</p>
        ))}
      </form>
    </TooltipProvider>
  );
}
